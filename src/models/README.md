# Models

This folder holds the Mongoose models used by the API.

## Files

- `User.ts` - user account schema with slug generation.
- `Category.ts` - category schema with name and slug.
- `Product.ts` - product schema with category reference (ObjectId), sizes, availability, and slug. The controller accepts both ObjectId and category name for the category field.
- `Order.ts` - order schema with embedded order items and status.