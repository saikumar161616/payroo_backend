import mongoose from 'mongoose';
import { Default } from './default';
import config from './config';


/**
 *  @class DatabaseConfiguration
 *  @description connects the application to the database and logs the connection status
*/

export class DatabaseConfiguration extends Default {
    constructor() {
        super();
    }

    /**
     * @method connect 
     * @description connects to the mongo data base with the given connection details
     * @param contains config object of DATABASE.URL string
    */
    async connect(config: { SERVER: { DATABASE_URL: string } }): Promise<void> {
        try {
            await mongoose.connect(config.SERVER.DATABASE_URL);
            this.logger.info('********************************************');
            this.logger.info('DATABASE connected sucessfully');
            this.logger.info('********************************************');
        }
        catch (error) {
            this.logger.error('Database connection error', error)
            throw (error);
        }
    }
}

export default new DatabaseConfiguration();