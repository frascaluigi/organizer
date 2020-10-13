
export enum StatusCode{
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404
}



class ErrorCustom extends Error{

    private statusCode?:StatusCode;

    constructor(statusCode:StatusCode, message:string){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }

    static errorHandledResponse = (err, res) => {
        const statusCode = err.statusCode ? err.statusCode : 500;
        res.status(statusCode).json({
          status: "error",
          statusCode: err.statusCode || 500,
          message: err.message
        });
    };

}

export default ErrorCustom;
