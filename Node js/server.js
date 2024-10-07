const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "hello",
    database: "postgres"
})


module.exports = client

//winston
// const winston = require('winston');

// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     transports: [new winston.transports.Console()],
//   });
  
//   logger.info('Hello from Winston logger!')