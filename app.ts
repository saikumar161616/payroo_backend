/**
 * Main application entry point for Paroo Mini Pay Run Backend Api Server
 * This file initializes the Express server, configures middlewares, routing, database connections, CORS,logging 
*/

import express, { Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser'; // the body-parser middleware is used to parse incoming request bodies , so that the data sent by client (JSON or URl Encoded params) can be easily accessed
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan'; // the morgan is used to log the HTTP Request/Response 
import { utc } from 'moment';
import http from 'http';

import helmet from 'helmet';

import config from './config/config';
import routes from './routes';
import databaseConfiguration from './config/databaseConfiguration';


// Set process timezone for all date/time operations
process.env.TZ = config.SERVER.TIMEZONE;

// Create the express app instance
const app = express();
app.use(morgan('dev'));
// Parse incoming req bodies as URl-Encoded data and JSON size limitsCORS_ORIGINS
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '10mb' }));

// 
console.log("CORS_ORIGINS", config.SERVER.CORS_ORIGINS);

// Configure CORS options with dynamic validation based on config
const corsOptionsDelegate: CorsOptions = {
    
    origin: (origin, callback) => {
        // Allow all origins if config allows '*'

        if (config.SERVER.CORS_ORIGINS[0] === '*') {
            callback(null, true);
        }
        else if (!origin || config.SERVER.CORS_ORIGINS.includes(origin)) {
            // Allow if origin is undefined (eg : server to server) or is ini whitelist
            callback(null, true);
        }
        else {
            // Block other origins with error
            callback(new Error('BLOCKED BY CORS RULE'))
        }
    },
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptionsDelegate));

// Use Helmet to set various HTTP headers for app security
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
        }
    }
}));

// routes handlinig
app.use('/api', routes);

// create http server warapping the express app.
const server = http.createServer(app);
server.listen(config.SERVER.PORT, async () => {
    console.info('******************************************************************');
    console.info(`**** SERVER RUNNING ON PORT ${config.SERVER.PORT} ****************`);
    console.info('******************************************************************');
    await databaseConfiguration.connect(config);
});

export default app;