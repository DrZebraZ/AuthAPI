import { FastifyInstance } from 'fastify';
import authRoutes from './auth-api/auth.route';
import healthCheck from './healthcheck';


export async function setRoutes(server:FastifyInstance){
  
  healthCheck(server)

  server.register(authRoutes, { prefix: '/auth'});
  
}