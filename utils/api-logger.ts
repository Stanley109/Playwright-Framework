
export class APILogger{
    
    private recentLogs: any[] = []     //create a variable of an array of any type and initialize it with an empty array

    logRequest(apiRequestMethod: string, url: string, headers: Record<string,string>, body?: any){    //body is optional because get method doesn't have a body
        const logEntry = {apiRequestMethod, url, headers, body}
        this.recentLogs.push({type: 'Request Details', data: logEntry})
    }    

    logResponse(statusCode: number, body?: any){    //body is optional because get method doesn't have a body
        const logEntry = {statusCode, body}
        this.recentLogs.push({type: 'Response Details', data: logEntry})
    } 

    getRecentLogs(){
        const logs = this.recentLogs.map(log =>{
            return `====${log.type}====\n${JSON.stringify(log.data, null, 4)}`      //prints the json string and do 4 spaces of indention to make it readable
        }).join('\n\n')
        return logs
    }

    removeLogs(){
        this.recentLogs.length = 0    
    }
}