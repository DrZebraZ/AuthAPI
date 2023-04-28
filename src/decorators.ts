import crypto from 'crypto';
import { UserTokenSchema } from './auth-api/auth.schema';
import { FastifyInstance } from 'fastify';
import { JWTKey, encryptKey } from './server';
const jwtValidator = require('jsonwebtoken')

export async function registerDecorators(server: FastifyInstance){
  
  server.register(require('@fastify/jwt'), {
    secret: JWTKey
  })
  
  server.decorate(
    'RequireAuth',
    async (request:any, reply:any, done:any) => {
    try{
      const token = request.headers.authorization.split(' ')[1]
      const jwt = decrypt(token, encryptKey)
      var decoded = jwtValidator.verify(jwt, JWTKey);
      console.log(decoded)
      const user:UserTokenSchema = {
        id: decoded.id,
        login: decoded.login,
        roles: decoded.roles
      }
      request.user = user
    }catch(e){
      reply.code(403).send('UNAUTHORIZED')
    }
  })
}

function decrypt(encryptedText:string, masterKey:string) {
  try{
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(masterKey).digest('base64').substr(0, 32);

    const parts = encryptedText.split(':');
    const ivHex = parts.shift();
    if (!ivHex) {
      throw new Error('IV is missing');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = parts.join(':');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }catch(e){
    return new Error()
  }
}
