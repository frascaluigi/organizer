import { Request, Response } from "express";
import { StatusCode } from "../helpers/ErrorCustom";


class HealthController{

    static serverHealthCheck = (req:Request, res:Response) => {
        const pjson = require('../../package.json');
        console.info('check health of application ..');
        res.status(StatusCode.Ok).send({
            name: pjson.name,
            version: pjson.version
        });
    }
}

export default HealthController;