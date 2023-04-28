import DatabaseConnector from "./data/database-connector";

import Logger from './entity/logger'
export const logger = new Logger()
import crypto from 'crypto';

const server = require('fastify')();

export default server

export const databaseConnector = new DatabaseConnector();
export const JWTKey = crypto.randomBytes(124).toString("hex")
export const encryptKey = crypto.randomBytes(65).toString("hex")