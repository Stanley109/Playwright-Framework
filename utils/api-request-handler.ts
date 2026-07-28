import { test, APIRequestContext, expect } from '@playwright/test';
import { APILogger } from './api-logger';
import { log } from 'node:console';


//this is an example of fluent interface design pattern. It is a famous API design style that allows methhod chaining.
export class RequestHandler {

    private request: APIRequestContext
    private logger: APILogger
    private baseUrl: string | undefined
    private defaultBaseUrl: string
    private apiPath: string = ''
    private queryParams: object = {}                    // Record<any,any>  or 'any' also works
    private apiHeaders: Record<string,string> = {}      //or { [key: string]: string } or just type 'any'
    private apiBody: object = {}

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger){
        this.request = request
        this.defaultBaseUrl = apiBaseUrl
        this.logger = logger
    }

    url(url: string){
        this.baseUrl = url
        return this
    }

    path(path: string){
        this.apiPath = path
        return this
    }

    params(params: object){
        this.queryParams = params
        return this
    }

    headers(headers: Record<string,string>){
        this.apiHeaders = headers
        return this
    }

    body(body: object){
        this.apiBody = body
        return this
    }

    async getRequest(statusCode: number){
        let responseJSON: any
        const url = this.getUrl()

        await test.step(`GET request to ${url}`,async()=>{
            this.logger.logRequest('GET', url, this.apiHeaders)       //log the request
            const response = await this.request.get(url,{             //do the actual GET request
                headers: this.apiHeaders
            })
            this.cleanupFields()                            // reset the parameters after each request call because usually in 1 end to end api test, lots of endpoints are called and is only using the same request-handler instance.
            
            const actualStatus =  response.status()         //the reason why response.status doesn't need await is because request.get already wait for the response.header (eg. the code status)
            responseJSON = await response.json()      //however, for the body, since request.get doesn't wait for the body response, hence we need to do the await here.
            
            this.logger.logResponse(actualStatus, responseJSON)                   //log the response
            this.statusCodeValidator(actualStatus, statusCode, this.getRequest)   //replaces the expect(actualStatus).toEqual(statusCode)
            
            //this.logger.removeLogs()                        //if you want to clear this whole method's log record for the current test instance, use this
            //expect (actualStatus).toEqual(statusCode)       //not needed anymore as statusCodeValidator is implemented
        })
        return responseJSON
    }

    async postRequest(statusCode: number){
        let responseJSON: any
        const url = this.getUrl()

        await test.step(`POST request to ${url}`,async()=>{
            this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody)
            const response = await this.request.post(url,{
                headers: this.apiHeaders,
                data: this.apiBody
            })
            this.cleanupFields()       
            
            const actualStatus =  response.status()
            responseJSON = await response.json()      
            
            this.logger.logResponse(actualStatus, responseJSON)                    
            this.statusCodeValidator(actualStatus, statusCode, this.postRequest)  
        })
        return responseJSON
    }

    async putRequest(statusCode: number){
        let responseJSON: any
        const url = this.getUrl()

        await test.step(`PUT request to ${url}`,async()=>{
            this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody)
            const response = await this.request.put(url,{
                headers: this.apiHeaders,
                data: this.apiBody
            })
            this.cleanupFields()

            const actualStatus =  response.status()         
            responseJSON = await response.json()      
            
            this.logger.logResponse(actualStatus, responseJSON)                     
            this.statusCodeValidator(actualStatus, statusCode, this.putRequest) 
        })
        return responseJSON
    }

    async deleteRequest(statusCode: number){
        let responseText: any
        const url = this.getUrl()

        await test.step(`DELETE request to ${url}`,async()=>{
            this.logger.logRequest('DELETE', url, this.apiHeaders)
            const response = await this.request.delete(url,{
                headers: this.apiHeaders,
                data: this.apiBody
            })
            this.cleanupFields()

            const actualStatus =  response.status()         
            responseText = await response.text()                // we need to change from response.json to response.text because delete can have no body
            
            this.logger.logResponse(actualStatus, responseText)                     
            this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)   
        })
        return responseText;
    }

    private getUrl(){                                   //constructs the url path. appends necessary params
        const url = new URL(`${this.baseUrl || this.defaultBaseUrl}${this.apiPath}`)
        for(const [key, value] of Object.entries(this.queryParams)){
            url.searchParams.append(key,value)          //automatically appends url params with ?<key>:value&<key>:<value ...
        }
        console.log(`url is now: ${url.toString()}`)
        return url.toString()
    }

    private cleanupFields(){        //we need to call this method are every api request call so that paramaters are reset. otherwise if 1 test contains multiple request calls, since 1 test = only 1 instance of request-handler, the params might get shared.
        this.apiBody = {}
        this.apiHeaders = {}
        this.baseUrl = undefined
        this.apiPath = ''
        this.queryParams = {}
    }

    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function){

        const logs = this.logger.getRecentLogs()

        if(actualStatus!== expectedStatus){
            const error = new Error(`Expected status ${expectedStatus} but got ${actualStatus}\n\n Recent API Activity: \n${logs}`)
            Error.captureStackTrace(error, callingMethod)           //allows to pinpoint the caller of this method to be the printed error for more readability
            throw error
        }

       //if you want to log every time (even if passed), just console.log it
       //console.log(`Success! Expected status ${expectedStatus} and got ${actualStatus}\n\n Recent API Activity: \n${logs}`)
        
    }
}