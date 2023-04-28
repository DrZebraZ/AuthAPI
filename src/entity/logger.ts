import { FastifyRequest } from 'fastify';
import { databaseConnector } from '../server';

class Logger {
    async error(error:any, message:string, statusCode:any, request:FastifyRequest|any) {
        console.log("ERROR")
        console.log(error)
        console.log(message)
        let requestJSON:any | null = null
        if (request){
            requestJSON={
                headers: request.headers,
                body: request.body,
                user: request.user
            }
            if (requestJSON.body.password){
                requestJSON.body.password = '**************'
            }
        }
        await logInDatabase("ERROR", error, message, statusCode, requestJSON)
    }

    async info(message:any) {
        console.log("INFO")
        console.log(message)
        await logInDatabase("INFO", null, message, 1, null)
    }

    async warn(error:any, message:any) {
        console.log("WARN")
        console.log(error)
        console.log(message)
        await logInDatabase("WARN", error, message, 0, null)
    }

    debug(message:any) {
        console.log(`DEBUG: ${message}`)
    }

    

}
async function logInDatabase(logType:string|null=null, error:any|null=null, message: string|null = null, statusCode:any|null = null, request:any|JSON|null = null){
    try{
        console.log(`${logType} : ${error} : ${message} : ${statusCode} : ${request}`)
        //const CONN = await databaseConnector.getConnection()
        //await CONN.execute(`insert into logger (type, message, request, error, statusCode) values (?, ?, ?, ?, ?)`,[logType, message, request, error, statusCode])
        //CONN.commit()
    }catch(e){
        console.log(e)
    }
}

export default Logger
