import { Query } from 'mongoose';

type QueryString = Record<string, string | undefined>;

class APIFeature<T> {
	query: Query<any, T>;
	queryString: QueryString;

	// this is constructor for init the APIFeature on other classes
	// and it takes query = Todo.find and queryString = req.query
	constructor(query: Query<any, T>, queryString: QueryString) {
		this.query = query;
		this.queryString = queryString;
	}

	// filter function that finds the thing user writes in the query
	filter() {
		/* because the query could have some query like sort, page, etc.
		and this is not exist on our DB
		we need to just search things user writes and exist on DB
		*/

		// 1) taking a copy from the query to remove the fields
		const queryOBJ: Record<string, unknown> = { ...this.queryString };

		// 2) choosing the fields and removing them
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((field) => delete queryOBJ[field]);

		// 3) make the query string because it could be something like repetition[gt]=5
		// so DB don't understand [gt], so we make it repetition $gt = 5
		let queryStr = JSON.stringify(queryOBJ);
		queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (match) => `$${match}`);

		// making a query to find it and return it to json again
		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		/*
		first we see if user want to sort on the query so we see the req.query if it contains sort
		then split , and make it space because it could be sort = x,y so make it x y
		then use the built in function sort else sorted by the time it created and reverse (-)
		*/
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}
    mergeSort(){
        
    }
	limitFields() {
		/*
		user writes some fields he want to see only so first if he writes fields = {fields} so we
		1- see if user writes fields split , and make space then select it
		2- else remove __v
		*/
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}

		return this;
	}

	pagination() {
		/*
		pagination is we need to limit the things that appear so we make every page contain some number of things
		1- limit if user / front end writes how many things will appear for page or make it 10
		2- if user writes the page he is in or make it first page
		3- the formula of skipping if we on page 2 so we skip 10 so it's (2-1) * 10
		*/
		const limit = Number(this.queryString.limit) || 10;
		const page = Number(this.queryString.page) || 1;
		const skip = (page - 1) * limit;

		// this is a function on mongoose
		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

export default APIFeature;