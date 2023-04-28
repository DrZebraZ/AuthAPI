import { databaseConnector, encryptKey } from '../server';
import server from '../server';
import jwtDecode from "jwt-decode"
import crypto from 'crypto';
import { LoginInput, UserDatabaseSchema } from './auth.schema';
import ResultValidation from '../entity/result-validation';

export async function executeLogin(input: LoginInput, resultValidation: ResultValidation):Promise<any>{
  try{
    const { login, password } = input
    await _getUserByLogin(login, resultValidation)
    if (resultValidation.hasError()){
      return resultValidation
    }
    if (resultValidation.isResultEmpty()){
      resultValidation.addError("EMPTY", "No user found")
      return resultValidation
    }
    const user:UserDatabaseSchema = resultValidation.getResult()
    await _verifyPassword(password, user.salt, user.hash ,resultValidation)
    if (resultValidation.hasError()){
      return resultValidation
    }
    await _generateJWT(user, resultValidation)
    return resultValidation
  }catch(e){
    resultValidation.addError("error","teste")
    return resultValidation
  }
}

async function _getUserByLogin(login:string, resultValidation:ResultValidation):Promise<ResultValidation>{
  try{
    const CONN = await databaseConnector.getConnection()
    const [results]:any = await CONN.query(`
      select * from user where login = ? and deleted_at is null 
    `,[login])
    resultValidation.setResult('')
    if (results[0]){
      const response:UserDatabaseSchema = {
        id: results[0].id,
        login: results[0].login,
        hash: results[0].hash,
        salt: results[0].salt,
        deleted_at: results[0].deleted_at,
        roles: results[0].roles
      }      
      resultValidation.setResult(response)
    }
    return resultValidation
  }catch(e){
    resultValidation.addError("user-repository",`Error at findUserByLogin: ${e}`, true)
    return resultValidation
  }
}

async function _generateJWT(user: UserDatabaseSchema, resultValidation:ResultValidation){
  try{
    const tokenFormatter = {
      id: user.id,
      login: user.login,
      roles: user.roles,
      exp: Math.floor(Date.now() / 1000) + 10
    }
    const key = encryptKey
    const jwtToken = server.jwt.sign(tokenFormatter)
    const encryptedToken = encrypt(jwtToken, key)
   
    return resultValidation.setResult({Token: encryptedToken})
  }catch(e){
    resultValidation.addError("TOKEN_ERROR",`Error at GenerateJWT: ${e}`)
    return resultValidation
  }
}

function encrypt(text:string, masterKey:string) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(masterKey).digest('base64').substr(0, 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

async function hashPassword(password: string, resultValidation:ResultValidation):Promise<ResultValidation>{
  try{
    const salt = crypto.randomBytes(64).toString("hex")
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 200, "SHA512").toString("hex")
    resultValidation.setResult([hash,salt])
    return resultValidation
  }catch (e){
    resultValidation.addError("user-authorization", `Error at hashPassword: ${e}`, true)
    return resultValidation
  }
}

async function hashToken(token: any, resultValidation:ResultValidation):Promise<ResultValidation>{
  try{
    const textEncoder = new TextEncoder()
    const salt = textEncoder.encode(process.env.TOKEN_SALT)
    const hashed_token = crypto.pbkdf2Sync(token, salt, 1000, 255, "SHA512").toString("hex")
    resultValidation.setResult([token, hashed_token])
    return resultValidation
  }catch(e){
    resultValidation.addError("user-authorization", `Error at hashToken: ${e}`, true)
    return resultValidation
  }

}

async function _verifyPassword(
    candidatePassword:string, 
    salt:string, 
    hash:string,
    resultValidation:ResultValidation
    )
    :Promise<ResultValidation>
  {
  try{
    const candidateHash = crypto.pbkdf2Sync(candidatePassword, salt, 1000, 200, "sha512").toString("hex")
    if (candidateHash === hash){
      resultValidation.setResult(true)
    }else{
      resultValidation.addError("WRONG_PASSWORD", "")
    }
    return resultValidation;
  }catch(e){
    resultValidation.addError("user-authorization", `Error at verifyPassword: ${e}`, true)
    return resultValidation
  }
}

async function getID(token:string, resultValidation:ResultValidation):Promise<ResultValidation>{
  try{
    const authorized:any = await jwtDecode(token)
    const id = authorized.id.toString()
    resultValidation.setResult(id)
    return resultValidation
  }catch (e){
    resultValidation.addError("user-authorization", `Error at getID: ${e}`, true)
    return resultValidation
  }
}
