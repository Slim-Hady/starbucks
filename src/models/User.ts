import {Schema , model} from 'mongoose';

import validator from 'validator';

const UserSchema = new Schema({
    name : {
        type : String,
        required : [true , "User name must be filled"],
        trim : true,
        validate : [validator.isAlpha , "User name must be only a character"]
    },
    email :{
        type : String,
        required:[true , "User Email must be filled"],
        trim : true,
        unique : true,
        lowercase : true,
        validate : [validator.isEmail , "User Email must be on email format"]
    },
    password : {
        type: String,
        required:[true,"user password must be filled"],
        trim : true,
        minLength : 8,
        validate : [validator.isStrongPassword , "User password must be strong"]
    },
    role :{
        type : String,
        enum: {
            values: ["Admin", "Customer"],
            message: "Role is either: Admin or Customer"
        },
        default: "Customer"
    },
    createdAt : {
        type : Date,
        default: Date.now()
    }
})

export const User = model('User', UserSchema);