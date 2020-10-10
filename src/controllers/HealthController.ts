import { Request, Response } from "express";


class HealthController{

    static serverHealthCheck = (req:Request, res:Response) => {
        const pjson = require('../../package.json');
        console.log('check status ...');
        res.status(200).send({
            name: pjson.name,
            version: pjson.version
        });
    }
}

export default HealthController;