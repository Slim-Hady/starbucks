# Models

This folder holds the Mongoose models used by the API.

## Files

- `User.ts` - user account schema with slug generation.
- `Category.ts` - category schema with name and slug.
- `Product.ts` - product schema with category reference, sizes, availability, and slug.
- `Order.ts` - order schema with embedded order items and status.