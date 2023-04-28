import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import mysql from 'mysql2/promise';

async function healthCheck(server: FastifyInstance){
    server.get('/', async function(request: FastifyRequest, reply: FastifyReply) {
        let status = 200;
        let connectionStatus: Boolean = false;
        try {
            let connectionLimit: number = +(process.env.DATABASE_CONNECTION_LIMIT || 2)
            const config = {
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                connectionLimit: connectionLimit
            };

            const pool:mysql.Pool = mysql.createPool(config);
            connectionStatus = true
            pool.end()

            
        } catch (e) {
            console.error(`Erro na conexão com o mysql no healthcheck: ${e}`);
            status = 500;
            connectionStatus = false;
        }
    
        reply.status(status);
        reply.send(connectionStatus);
    })
    }

export default healthCheck;
