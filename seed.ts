import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/starbucks';

const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    slug: String,
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: Number,
    description: String,
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    categoryName: String,
    sizes: [String],
    isAvailable: Boolean,
    slug: String,
});

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, enum: ['Admin', 'Customer'], default: 'Customer' },
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

const categories = [
    { name: 'Frappuccino', description: 'Blended beverages with coffee, milk and ice' },
    { name: 'Cold Brew', description: 'Slow-steeped cold coffee drinks' },
    { name: 'Americano', description: 'Espresso shots with hot water' },
    { name: 'Latte', description: 'Espresso with steamed milk' },
    { name: 'Cappuccino', description: 'Espresso with equal parts steamed and foamed milk' },
    { name: 'Mocha', description: 'Espresso with chocolate and steamed milk' },
    { name: 'Tea', description: 'Premium teas and matcha' },
    { name: 'Food', description: 'Bakery items and snacks' },
    { name: 'Merchandise', description: ' tumblers and accessories' },
];

const products = [
    // Frappuccino
    { name: 'Caramel Frappuccino', price: 5.95, description: 'Coffee, caramel, milk and ice blended with whipped cream', category: 'Frappuccino', image: 'https://globalassets.starbucks.com/assets/f5725d9b23d44a789c9589514f445608.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Mocha Frappuccino', price: 5.95, description: 'Coffee, chocolate, milk and ice blended with whipped cream', category: 'Frappuccino', image: 'https://globalassets.starbucks.com/assets/51d900d4940141e8a1564490f43d52c1.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Strawberry Frappuccino', price: 5.45, description: 'Strawberries, milk and ice blended with vanilla', category: 'Frappuccino', image: 'https://globalassets.starbucks.com/assets/8f0d4e76f3c44b8eb1dd6202a8b0b0a0.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Vanilla Bean Frappuccino', price: 4.95, description: 'Vanilla bean, milk and ice blended (no coffee)', category: 'Frappuccino', image: 'https://globalassets.starbucks.com/assets/9e4c3c2b5b5e4b9aa0e2c2a5b8b0b0a0.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Java Chip Frappuccino', price: 5.95, description: 'Coffee, chocolate chips, milk and ice blended', category: 'Frappuccino', image: 'https://globalassets.starbucks.com/assets/1f1b2b3b4b5b6b7b8b9b0b1b2b3b4b5.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },

    // Cold Brew
    { name: 'Vanilla Sweet Cream Cold Brew', price: 4.99, description: 'Slow-steeped cold brew with vanilla sweet cream', category: 'Cold Brew', image: 'https://globalassets.starbucks.com/assets/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Cold Brew', price: 3.49, description: 'Signature smooth cold brew served over ice', category: 'Cold Brew', image: 'https://globalassets.starbucks.com/assets/b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Cold Brew with Milk', price: 3.99, description: 'Cold brew with choice of milk served over ice', category: 'Cold Brew', image: 'https://globalassets.starbucks.com/assets/c3d4e5f6g7h8i9j0k1l2m3n4o5p6q.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Nitro Cold Brew', price: 4.49, description: 'Nitrogen-infused cold brew with creamy texture', category: 'Cold Brew', image: 'https://globalassets.starbucks.com/assets/d4e5f6g7h8i9j0k1l2m3n4o5p6q7.png', sizes: ['Tall', 'Grande'], isAvailable: true },

    // Americano
    { name: 'Caffe Americano', price: 3.19, description: 'Espresso shots with hot water for a rich flavor', category: 'Americano', image: 'https://globalassets.starbucks.com/assets/e5f6g7h8i9j0k1l2m3n4o5p6q7r8.png', sizes: ['Short', 'Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Caffe Americano with Oatmilk', price: 3.99, description: 'Espresso with oatmilk and hot water', category: 'Americano', image: 'https://globalassets.starbucks.com/assets/f6g7h8i9j0k1l2m3n4o5p6q7r8s9.png', sizes: ['Short', 'Tall', 'Grande', 'Venti'], isAvailable: true },

    // Latte
    { name: 'Caffe Latte', price: 4.45, description: 'Espresso with steamed milk and light foam', category: 'Latte', image: 'https://globalassets.starbucks.com/assets/g7h8i9j0k1l2m3n4o5p6q7r8s9t0.png', sizes: ['Short', 'Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Cinnamon Dolce Latte', price: 4.95, description: 'Espresso with steamed milk, cinnamon and dolce', category: 'Latte', image: 'https://globalassets.starbucks.com/assets/h8i9j0k1l2m3n4o5p6q7r8s9t0u1.png', sizes: ['Short', 'Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Hazelnut Latte', price: 4.95, description: 'Espresso with hazelnut flavor and steamed milk', category: 'Latte', image: 'https://globalassets.starbucks.com/assets/i9j0k1l2m3n4o5p6q7r8s9t0u1v2.png', sizes: ['Short', 'Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Oatmilk Latte', price: 4.95, description: 'Espresso with oatmilk and light foam', category: 'Latte', image: 'https://globalassets.starbucks.com/assets/j0k1l2m3n4o5p6q7r8s9t0u1v2w3.png', sizes: ['Short', 'Tall', 'Grande', 'Venti'], isAvailable: true },

    // Cappuccino
    { name: 'Cappuccino', price: 4.45, description: 'Espresso with equal parts steamed and foamed milk', category: 'Cappuccino', image: 'https://globalassets.starbucks.com/assets/k1l2m3n4o5p6q7r8s9t0u1v2w3x4.png', sizes: ['Short', 'Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Extra Hot Cappuccino', price: 4.45, description: 'Cappuccino served extra hot', category: 'Cappuccino', image: 'https://globalassets.starbucks.com/assets/l2m3n4o5p6q7r8s9t0u1v2w3x4y5.png', sizes: ['Short', 'Tall', 'Grande'], isAvailable: true },

    // Mocha
    { name: 'Caffe Mocha', price: 4.95, description: 'Espresso with chocolate and steamed milk', category: 'Mocha', image: 'https://globalassets.starbucks.com/assets/m3n4o5p6q7r8s9t0u1v2w3x4y5z6.png', sizes: ['Short', 'Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'White Chocolate Mocha', price: 5.25, description: 'Espresso with white chocolate and steamed milk', category: 'Mocha', image: 'https://globalassets.starbucks.com/assets/n4o5p6q7r8s9t0u1v2w3x4y5z6a7.png', sizes: ['Short', 'Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Mocha Macchiato', price: 5.45, description: 'Espresso with chocolate, milk and caramel drizzle', category: 'Mocha', image: 'https://globalassets.starbucks.com/assets/o5p6q7r8s9t0u1v2w3x4y5z6a7b8.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },

    // Tea
    { name: 'Chai Latte', price: 4.45, description: 'Spiced black tea with steamed milk', category: 'Tea', image: 'https://globalassets.starbucks.com/assets/p6q7r8s9t0u1v2w3x4y5z6a7b8c9.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'Matcha Green Tea Latte', price: 4.95, description: 'Sweet matcha with steamed milk', category: 'Tea', image: 'https://globalassets.starbucks.com/assets/q7r8s9t0u1v2w3x4y5z6a7b8c9d0.png', sizes: ['Tall', 'Grande', 'Venti'], isAvailable: true },
    { name: 'English Breakfast Tea', price: 2.95, description: 'Bold black tea', category: 'Tea', image: 'https://globalassets.starbucks.com/assets/r8s9t0u1v2w3x4y5z6a7b8c9d0e1.png', sizes: ['Short', 'Tall', 'Grande'], isAvailable: true },
    { name: 'Emperor\'s Clouds & Mist', price: 2.95, description: 'Organic green tea', category: 'Tea', image: 'https://globalassets.starbucks.com/assets/s9t0u1v2w3x4y5z6a7b8c9d0e1f2.png', sizes: ['Short', 'Tall', 'Grande'], isAvailable: true },
    { name: 'Passion Tango Tea', price: 2.95, description: 'Herbal tea with citrus and hibiscus', category: 'Tea', image: 'https://globalassets.starbucks.com/assets/t0u1v2w3x4y5z6a7b8c9d0e1f2g3.png', sizes: ['Short', 'Tall', 'Grande'], isAvailable: true },

    // Food
    { name: 'Butter Croissant', price: 3.49, description: 'Flaky, buttery pastry', category: 'Food', image: 'https://globalassets.starbucks.com/assets/u1v2w3x4y5z6a7b8c9d0e1f2g3h4.png', sizes: ['One size'], isAvailable: true },
    { name: 'Blueberry Muffin', price: 3.29, description: 'Moist muffin with blueberries', category: 'Food', image: 'https://globalassets.starbucks.com/assets/v2w3x4y5z6a7b8c9d0e1f2g3h4i5.png', sizes: ['One size'], isAvailable: true },
    { name: 'Chocolate Chip Cookie', price: 2.49, description: 'Classic chocolate chip cookie', category: 'Food', image: 'https://globalassets.starbucks.com/assets/w3x4y5z6a7b8c9d0e1f2g3h4i5j6.png', sizes: ['One size'], isAvailable: true },
    { name: 'Avocado Spread', price: 2.49, description: 'Fresh avocado spread on artisan bread', category: 'Food', image: 'https://globalassets.starbucks.com/assets/x4y5z6a7b8c9d0e1f2g3h4i5j6k7.png', sizes: ['One size'], isAvailable: true },
    { name: 'Egg & Cheese Portuguese Style Muffin', price: 4.49, description: 'Portuguese muffin with egg and cheese', category: 'Food', image: 'https://globalassets.starbucks.com/assets/y5z6a7b8c9d0e1f2g3h4i5j6k7l8.png', sizes: ['One size'], isAvailable: true },
    { name: 'Bacon, Sausage & Egg Wrap', price: 4.99, description: 'Warm tortilla with bacon, sausage, egg and cheese', category: 'Food', image: 'https://globalassets.starbucks.com/assets/z6a7b8c9d0e1f2g3h4i5j6k7l8m9.png', sizes: ['One size'], isAvailable: true },
    { name: 'Chicken & Honey Mustard Bagel', price: 4.99, description: 'Grilled chicken with honey mustard on bagel', category: 'Food', image: 'https://globalassets.starbucks.com/assets/a7b8c9d0e1f2g3h4i5j6k7l8m9n0.png', sizes: ['One size'], isAvailable: true },

    // Merchandise
    { name: 'Starbucks Reusable Tumbler', price: 24.95, description: '16oz reusable plastic tumbler', category: 'Merchandise', image: 'https://globalassets.starbucks.com/assets/b8c9d0e1f2g3h4i5j6k7l8m9n0o1.png', sizes: ['One size'], isAvailable: true },
    { name: 'Ceramic Mug - Classic Logo', price: 14.95, description: '12oz ceramic mug with Starbucks logo', category: 'Merchandise', image: 'https://globalassets.starbucks.com/assets/c9d0e1f2g3h4i5j6k7l8m9n0o1p2.png', sizes: ['One size'], isAvailable: true },
    { name: 'Stainless Steel Tumbler', price: 29.95, description: '20oz stainless steel tumbler', category: 'Merchandise', image: 'https://globalassets.starbucks.com/assets/d0e1f2g3h4i5j6k7l8m9n0o1p2q3.png', sizes: ['One size'], isAvailable: true },
    { name: 'Cold Cup Straw Set', price: 5.95,description: 'Set of 2 reusable straws', category: 'Merchandise', image: 'https://globalassets.starbucks.com/assets/e1f2g3h4i5j6k7l8m9n0o1p2q3r4.png', sizes: ['One size'], isAvailable: true },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await Category.deleteMany({});
        console.log('Cleared categories');

        await Product.deleteMany({});
        console.log('Cleared products');

        const createdCategories: Record<string, mongoose.Types.ObjectId> = {};
        for (const cat of categories) {
            const c = await Category.create(cat);
            createdCategories[cat.name] = c._id as mongoose.Types.ObjectId;
            console.log(`Created category: ${cat.name}`);
        }

        for (const prod of products) {
            const categoryId = createdCategories[prod.category];
            if (!categoryId) {
                console.log(`Skipping ${prod.name} - no category found`);
                continue;
            }
            await Product.create({
                ...prod,
                category: categoryId,
                categoryName: prod.category,
            });
            console.log(`Created product: ${prod.name}`);
        }

        const hashedPassword = await bcrypt.hash('Admin123!', 12);
        await User.create({
            name: 'Admin',
            email: 'admin@starbucks.com',
            password: hashedPassword,
            role: 'Admin',
        });
        console.log('Created admin user: admin@starbucks.com');

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding:', err);
        process.exit(1);
    }
}

seed();