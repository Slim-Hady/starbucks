import { User } from '../models/User';
import { NextFunction, Request , Response } from 'express';

import mongoose from 'mongoose';
import APIFeature from '../utils/APIFeature';

export const getAllUsers = async (req : Request,res: Response) => {
    try {
        const features = new APIFeature(User.find(), req.query as any)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const users = await features.query;

        res.status(200).json({
            status: "Sucess get all users",
            result: users.length,
            data: {
                users
            }
        })
    }
    catch(err:any){
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}

export const getUser = async (req: Request , res : Response) => {
    try {
        const user = (req as any).user;
    
        res.status(200)
        .json({
            status: "Success get user",
            data : {
                user
            }
        })
    }
    catch(err:any){
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }

}

export const CreateUser = async(req: Request , res: Response) => {
    try {
        const user = await User.create(req.body);

        res.status(201)
        .json({
            status: "Success create user",
            data : {
                user
            }
        })
    }
    catch(err:any){
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}

export const UpdateUser = async(req: Request , res: Response) => {
    try {
        const user = (req as any).user;
        await User.findByIdAndUpdate(user._id , req.body ,{
            new: true,
            runValidators: true
        });
        res.status(200)
        .json({
            status: "Success Update User",
            data : {
                user
            }
        })
    }
    catch(err:any){
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}

export const DeleteUser = async(req: Request , res: Response) => {
    try {
        const user = (req as any).user;

        await User.findByIdAndDelete(user._id);
        res.status(200)
        .json({
            status: "Success Update User",
            message : "User deleted succefully"
        })
    }
    catch(err:any){
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}




// middelwares 

// check if the id like the mongoDB format
export const checkValidID = (req:Request , res:Response , next: NextFunction , val:string) => {
    if(!mongoose.Types.ObjectId.isValid(val)) { 
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid ID format'
        });
    }
    next();
}
// checks if id exist
export const checkExistID = async (req:Request , res:Response , next: NextFunction) => {
    try { 
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(401).json({
                status: 'fail',
                message: 'ID not found'
            });
        }
        (req as any).user = user;
        next();
    }
    catch(err:any){
        res.status(500)
        .json({
            status : "err",
            message : err.message
        })
    }
}
