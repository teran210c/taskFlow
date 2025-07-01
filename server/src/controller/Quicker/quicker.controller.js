import httpResponse from '../../util/httpResponse.js'
import responseMessage from '../../constant/responseMessage.js'
import httpError from '../../util/httpError.js'

export default {
    self: (req, res, next) => {
        try {
            httpResponse(req, res, 200, responseMessage.SERVICE('Quicker'));
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    displayName: (req, res, next) => {
        try {
            const { name } = req.body

            if(!name){
                return httpError(next, new Error(responseMessage.COMMON.INVALID_PARAMETERS), req, 400);
            }
            httpResponse(req,res,200,responseMessage.customMessage(`Your name is ${name}`))
        } catch (err) {
            httpError(next, err, req, 500);
        }
    }
    // TODO:
    // Write an get request which will send a user data , define a user data and send
    // Take two numbers and respond with the sum of two numbers , substraction of two number , multiplication , division
    // num1= 10 and num2= 5 > sum : 15
};
