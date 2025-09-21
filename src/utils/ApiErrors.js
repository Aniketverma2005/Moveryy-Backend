class ApiErrors extends Error {
    constructor(
        statusCode,
        message = "",  
        errors = [], 
        stack = ""

    ){
        super(statusCode, message)
        this.statusCode = statusCode;
        this.errors = errors;   
        this.message = message;
        this.success = false;

        if(stack) {
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }

    }
}

export {ApiErrors}