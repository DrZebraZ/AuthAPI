import mysql from 'mysql2/promise';

class DatabaseConnector {
	pool: mysql.Pool | any = ''
	connection: mysql.Connection | any = ''

	async configurePool() {
		let connectionLimit: number = +(process.env.DATABASE_CONNECTION_LIMIT || 2)
		const config = {
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME,
			connectionLimit: connectionLimit
		};

		const pool = mysql.createPool(config);
		this.pool = pool
	}
	
	async getConnection():Promise<mysql.PoolConnection>{
		if (!this.pool){
			await this.configurePool()
		}
		if (!this.connection){
			let connection = await this.pool.getConnection();
			this.connection = connection
		}
		return this.connection;
	};

	async closeConn(conn:mysql.PoolConnection) {
		conn.end()
		if (this.connection){
			this.connection.release()
		}
		this.connection = ''
	}
}

export default DatabaseConnector;
