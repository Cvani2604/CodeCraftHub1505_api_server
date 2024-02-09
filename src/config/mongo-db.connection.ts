import { MongoClient, Binary, Filter, ObjectId } from 'mongodb';
import * as fs from 'fs';
import 'dotenv/config'

import { logger } from '../middlewares/logging-middleware';


export class MongoDBConnection {

    private connectionString: string;;
    private client: MongoClient;

    public database: any;
    constructor() {
        logger.verbose('MongoDBConnection constructor');
        this.connectionString = 'mongodb+srv://sivaranjani2604:YnGFGhOJTRHC0CML@cluster0.ynrb1tz.mongodb.net/?retryWrites=true&w=majority';

        this.client = new MongoClient(this.connectionString);
        this.client.connect();
        this.database = this.client.db('spare_hub');

        console.log('MongoDBConnection connected*****')

        // this.connect();

    }

    private connect() {
        try {
            const database = this.client.db('spare_hub');
            const spareCollection = database.collection('spare_items');

            console.log('database created')

        } catch (err: any) {
            console.log(err)
        }
    }

    public async getNextId(dbName: string, idTrackerCollectionName: string): Promise<number> {
        const db = this.client.db(dbName);
        const idTrackerCollection = db.collection(idTrackerCollectionName);

        const filter: Filter<any> = { _id: 'your_collection_id' };

        const result: any = await idTrackerCollection.findOneAndUpdate(
            filter,
            { $inc: { sequence_value: 1 } },
            { returnDocument: 'after', upsert: true }
        );

        return result.value.sequence_value;
    }


}
