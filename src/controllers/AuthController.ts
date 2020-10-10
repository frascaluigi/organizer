import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { User } from "../entities/User";

export default class AuthController{

    private static registerUser = async (req:Request, res:Response) => {
        const {email, password, firstName, lastName} = req.body;
        const user:User = new User();
        user.email = email;
        user.password = password;
        user.firstname = firstName;
        user.lastname = lastName;

        const errors = await validate(user);
        if(errors.length) throw new Error('validation user failed');

        user.hashPassword();

        const userCreate = await getRepository(User).save(user);
        if(!userCreate) throw new Error('creation user failed');

        return userCreate;
    }

    static registerUserResponse = async (req:Request, res:Response) => {
        try {
            const user = await AuthController.registerUser(req, res);
            res.status(201).send(`registration succesfully for ${user.email}`);
        } catch (error) {
            console.error("something went wrong: ", error);
            res.status(400).send();   
        }
    }

    private static loginUser = async (req:Request, res:Response) => {
        const {email, password} = req.body;
        const user:User = await getRepository(User).findOne({email});

        if(!user) throw new Error('not found');
        if(!user.isUnencryptedPasswordValid(password)) throw new Error('unhautorized');

        //sing token
        const token = jwt.sign({
            userId: user.id, 
            username: user.email}, 
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        return token;
    }

    static loginUserResponse = async (req:Request, res:Response) => {
        try{
            const token = await AuthController.loginUser(req, res);
            res.status(200).send(token);
        }catch(error){
            console.error("something went wrong: ", error);
            res.status(401).send();
        }
    }
}
