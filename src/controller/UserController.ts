import {json} from 'body-parser';
import fs from 'fs';
import { User } from '../models/User';
import { Request , Response } from 'express';

export const getAllUsers = async (req : Request,res: Response) => {
    try {
        const users = await User.find(); 

        res.status(200).json({
            status: "sucess",
            result: users.length,
            data: {
                users
            }
        })
    }
    catch(err:any){
        res.status(404).json({
            status: "Failed",
            message: err.message
        })
    }
}