import { loginHandler, verifyToken } from "./auth.controllers";
import { $ref } from "./auth.schema";

async function authRoutes(server:any){

  server.post('/login',{schema:{body:$ref('LoginSchema')}},loginHandler);
  server.post('/tokenValidator',{preHandler:[server.RequireAuth]},verifyToken);
  }

export default authRoutes