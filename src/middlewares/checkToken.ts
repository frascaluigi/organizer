import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import { StatusCode } from "../helpers/ErrorCustom";


export const checkToken = (req:Request, res:Response, next:NextFunction) => {
    // get jwt token from the head
    const token = <string>req.headers["auth"];
    let tokenPayload;

    try{
        tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.tokenPayload = tokenPayload;
    }catch(error){
        res.status(StatusCode.Unauthorized).send();
        return;
    }

    //The token is valid for 1hr
    const {userId, username} = tokenPayload;
    const newToken = jwt.sign({userId, username}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.setHeader("token", newToken);
    next();
} 