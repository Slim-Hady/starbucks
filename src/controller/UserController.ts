import { User } from '../models/User';
import { Request , Response } from 'express';

export const getAllUsers = async (req : Request,res: Response) => {
    try {
        const users = await User.find(); 

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
        const user = await User.findById(req.params.id);
        // i will add a middelware check if task even exist or not
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
        const user = await User.findByIdAndUpdate(req.params.id , req.body ,{
            new: true,
            runValidators: true
        });
        // will use the same middelware to check if id exist
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
        const user = await User.findByIdAndDelete(req.params.id);
        // will use the same middelware to check if id exist
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