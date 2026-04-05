
const Pool = require('pg').Pool
const config = require("../../config/index");

// const pool = new Pool({
//   user: config.db.username,
//   host: "localhost",
//   database: config.db.database,
//   password: config.db.password,
//   port: config.db.port,
// });

// module.exports = pool;




let pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.username,
    password: config.db.password,
    max: config.db.maxConnections
});



pool.on('connect', client => {
 console.log(`${Date.now()} - Process ID : ${client.processID} - Database client connected..!`)
});

pool.on('error', err => {
    console.log(`${Date.now()} - Process ID : ${client.processID} - Database error ${err}`, 'error')
});

pool.on('remove', client => {
    console.log(`${Date.now()} - Process ID : ${client.processID} - Database client has disconnected..!`)
});



class BaseController {
   
    static async getClient() {
        return await pool.connect();
    }


    static async executeSelectQuery(query, inputArray) {    
        const client = await BaseController.getClient();


        try {
            if (query.toLowerCase().includes('select') == false ||  query.toLowerCase().includes('update ') == true || query.toLowerCase().includes('delete ') == true) {
                throw new Error(`Query Not Allowed`);
            }

            const sql = {
                text: query,
                values: inputArray
            }
            const result = await client.query(sql);
            
            console.log(`Query : ${query}, conditions : ${inputArray}, result : rowCount ${JSON.stringify(result.rowCount)} rows ${JSON.stringify(result.rows)}`);
            
            client.release();
            return result;
        } catch (error) {
            console.log(error);
            
            client.release();
            console.log(`Error ${JSON.stringify(error)}, while Executing ${query}, input : ${inputArray}`, 'error');
            //throw new customError(12000);
        }
    }
    
    static async executeCustomQuery(query, inputArray) {
        const client = await BaseController.getClient();
        try {
            const sql = {
                text: query,
                values: inputArray
            }
            const result = await client.query(sql);
            client.release();
            return result;
        } catch (error) {
            console.log(error);
           
            client.release();
            console.log(`Error ${JSON.stringify(error)}, while Executing ${query}, input : ${inputArray}`, 'error');
            //throw new customError(12000);
        }
    }


}
module.exports = BaseController;
