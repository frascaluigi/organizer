import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { User } from "../entities/User";
import ErrorCustom, { StatusCode } from "../helpers/ErrorCustom";

export default class AuthController{

    private static registerUser = async (req:Request, res:Response) => {
        const {email, password, firstName, lastName} = req.body;
        const user:User = new User();
        user.email = email;
        user.password = password;
        user.firstname = firstName;
        user.lastname = lastName;

        const errors = await validate(user);
        if(errors.length) throw new ErrorCustom(StatusCode.BadRequest, 'user validation failed');

        user.hashPassword();

        const userCreate = await getRepository(User).save(user);
        return userCreate;
    }

    static registerUserResponse = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const user = await AuthController.registerUser(req, res);
            res.status(StatusCode.Created).send(`registration succesfully for ${user.email}`);
        } catch (error) {
            next(error);  
        }
    }

    private static loginUser = async (req:Request, res:Response) => {
        const {email, password} = req.body;
        const user:User = await getRepository(User).findOne({email});

        //always return unauthorized to not expose information
        if(!user) throw new ErrorCustom(StatusCode.Unauthorized, "unhautorized");
        if(!user.isUnencryptedPasswordValid(password)) throw new ErrorCustom(StatusCode.Unauthorized, "unhautorized");

        //sing token
        const token = jwt.sign({
            userId: user.id, 
            username: user.email}, 
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        return token;
    }

    static loginUserResponse = async (req:Request, res:Response, next:NextFunction) => {
        try{
            const token = await AuthController.loginUser(req, res);
            res.status(StatusCode.Ok).send(token);
        }catch(error){
            next(error);
        }
    }
}
