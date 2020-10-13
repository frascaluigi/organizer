import { NextFunction, Request, Response } from "express";
import ErrorCustom from "../helpers/ErrorCustom";


export const handleError = (err:Error, req:Request, res:Response, next:NextFunction) => {
    console.error(`${err.stack}`);
    ErrorCustom.errorHandledResponse(err, res);
}