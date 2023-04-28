import { buildJsonSchemas, register } from "fastify-zod";
import { authSchema } from "./auth-api/auth.schema";

export async function setSchemas(server:any){
  for (let schema of [
    ...authSchema]
    ){
    await server.addSchema(schema);
  }
}