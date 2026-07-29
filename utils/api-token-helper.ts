import { APIRequestContext } from "playwright";
import { APILogger } from "./api-logger";
import { RequestHandler } from "./api-request-handler";

// this file manages the token creation

export async function createToken(request:APIRequestContext, email: string, password: string) {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api'
        const logger = new APILogger()
        const api = new RequestHandler(request, baseUrl, logger)

    try{
        const tokenResponse = await api
        .path('/users/login')
        .body({"user":{"email":email, "password":password}})
        .postRequest(200)

        return 'Token ' + tokenResponse.user.token
    }
    catch(error:any){
        Error.captureStackTrace(error, createToken);
        throw error;
    } 
}