
const asyncHandler = function( inputFunction ){

    return (req,res,next) => {

        Promise
        .resolve(inputFunction(req,res,next))
        .catch( (err) => next(err) )

    }

}

export {asyncHandler}