# User Dataset

This repository contains a JSON file with 25 mock users generated according to a Mongoose schema.  
The schema enforces:

- **name**: only letters, numbers, underscores, required.
- **email**: valid email format, unique, lowercase.
- **password**: strong password (min. 8 chars, validated with `validator.isStrongPassword`).
- **role**: either `"Admin"` or `"Customer"` (default: `"Customer"`).
- **createdAt**: default to current date (mock dates used in this dataset).

## File
- `users.json` – list of 25 user objects.

## Admin Users

The following users have the role **Admin** (6 out of 25):

| #  | Name            | Email                             | Role  | Created At (UTC)          |
|----|-----------------|-----------------------------------|-------|---------------------------|
| 1  | jane_smith      | jane.smith2@example.com           | Admin | 2025-02-10T14:20:00.000Z  |
| 2  | sarah_lee       | sarah.lee6@example.com            | Admin | 2025-01-25T08:00:00.000Z  |
| 3  | olivia_white    | olivia.white10@example.com        | Admin | 2025-03-15T10:00:00.000Z  |
| 4  | lily_taylor     | lily.taylor14@example.com         | Admin | 2025-02-14T09:35:00.000Z  |
| 5  | ava_martinez    | ava.martinez18@example.com        | Admin | 2025-01-18T14:50:00.000Z  |
| 6  | isabella_moore  | isabella.moore22@example.com      | Admin | 2025-03-18T13:55:00.000Z  |

## Usage (Node.js + Mongoose)

Use the `userManager.ts` script to manage user data in MongoDB:

```bash
# Import all users from JSON to MongoDB
npm run data:import

# Update a user by email
npm run data:update "john.doe1@example.com" "role=Admin"

# Delete a user by email
npm run data:delete "john.doe1@example.com"

# Delete all users
npm run data:deleteAll
```

Or use the combined command with sub-commands:
```bash
npm run data import
npm run data update <email> <field>=<value>
npm run data delete <email>
npm run data deleteAll
```

Make sure to set `MONGODB_URI` in your `.env` file (defaults to `mongodb://localhost:27017/starbucks`).