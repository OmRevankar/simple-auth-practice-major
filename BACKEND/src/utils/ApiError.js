class ApiError extends Error {

    constructor(statusCode , message="Something went wrong", error=[],stack)
    { 
        super(message),
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = false,
        this.errors = error

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }

    toJSON() {
    return {
      success: this.success,
      message: this.message,
      errors: this.errors,
      statusCode: this.statusCode,
      data: this.data,
    };
  }

}

export {ApiError}