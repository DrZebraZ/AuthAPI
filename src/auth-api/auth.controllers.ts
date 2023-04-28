import { FastifyReply, FastifyRequest } from "fastify";
import { LoginInput } from './auth.schema';
import { } from './auth.schema';
import Logger from '../entity/logger'
import { executeLogin } from "./auth.service";
import ResultValidation from "../entity/result-validation";

async function applyResult(result:ResultValidation, reply: FastifyReply, successStatusCode: number, request: FastifyRequest) {
  const logger = new Logger()
  let message:any 
  let status:any
  if(result.hasError()) {
    if(result.hasCriticalError()) {
      status = 500
      message = "Untreated Error"
    }
    else if (result.findErrorByTags([
      'user-authorization',
    ])){
      status = 401
      message="Authentication Error"
    }
    else if (result.findErrorByTags([
      'EMPTY', "WRONG_PASSWORD"
    ])){
      status = 401
      message="User or password is incorrect"
    }
    else {
      status = 400
      message = "Internal Error"
    }
    await logger.error(result.getErrorList(),message, status, request)
    reply.status(status)
    reply.send(message);
  }else if(result.isResultEmpty()) {
    reply.status(204);
    reply.send([]);
  } else {
    reply.status(successStatusCode);
    reply.send(result.getResult());
  }
}

export async function loginHandler(request: FastifyRequest<{Body: LoginInput}>, reply:FastifyReply){
  const resultValidation = new ResultValidation()
  await executeLogin(request.body, resultValidation)
  await applyResult(resultValidation, reply, 200, request)
}

export async function verifyToken(request: FastifyRequest|any, reply:FastifyReply){
  const resultValidation = new ResultValidation()
  resultValidation.setResult("Ola: " + request.user['login'])
  await applyResult(resultValidation, reply, 200, request)
}

