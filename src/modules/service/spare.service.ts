import * as fs from 'fs';
import * as path from 'path';


import { logger } from '../../middlewares/logging-middleware';
import { MongoDBConnection } from '../../config/mongo-db.connection';
import { Binary } from 'mongodb';

import { SpareBuilder } from '../models/spare.builder';
import { Spare } from '../models/spare.model';

export class SpareService {

    private static databaseName = 'spare_hub';
    private static imageCollection = 'spare_images';
    private static productsCollection = 'feature_products';
    constructor() {
    }

    public async uploadImage(id: any, imgPath: string): Promise<any> {

        try {
            const db = new MongoDBConnection();

            let imageBinary = this.createImageBinary(imgPath);

            const document = { "id": id, "image": imageBinary };
            const collection = db.database.collection(SpareService.imageCollection);

            await collection.insertOne(document);
            logger.verbose('Image uploaded successfully')
        } catch (err: any) {
            logger.error('Error in uploadImage : ' + err);
            throw new Error('Error in uploadImage');
        }
    }


    public createImageBinary(path: string): any {

        const imageBuffer = fs.readFileSync(path);
        const imageBinary = new Binary(imageBuffer);

        return imageBinary
    }


    public async getImage(): Promise<void> {

        const promiseToken: any = new Promise(async (resolve, reject) => {
            try {
                const db = new MongoDBConnection();
                const collection = db.database.collection(SpareService.imageCollection);

                const query = {};
                const result: any[] = await collection.find(query).toArray();
                console.log(result)
                let imageUrl: any[] = [];

                if (result && result.length > 0) {
                    logger.verbose('Image retrieved successfully');

                    result.forEach(async (row: any) => {

                        try {
                            const savedImagePath = await this.saveImageFromBinary(row.image, row.id);
                            console.log(`Saved image path: ${savedImagePath}`);
                            imageUrl.push({ id: row.id, image_path: savedImagePath });

                            if (imageUrl.length === result.length) {
                                resolve(imageUrl);
                            }
                        } catch (err) {
                            logger.verbose('Error saving image:' + err);
                            reject(err);

                        }
                    });

                } else {
                    logger.verbose('Image not found in the collection');
                    resolve([]);
                }
            } catch (err: any) {
                logger.error('Error in getImage: ' + err);
                reject(err);
            }
        })
        return promiseToken;

    }
    public async saveImageFromBinary(imageBinary: any, id: any): Promise<string> {
        try {
            const outputPath = process.env.IMAGE_PATH || '';
            const outputFilePath: string = path.join(outputPath, `image_${id}.jpg`);

            // Convert the Binary instance to a Buffer
            const imageBuffer = Buffer.from(imageBinary.buffer);

            // Write the Buffer data to the file path
            fs.writeFileSync(outputFilePath, imageBuffer);


            console.log(`Image saved successfully at ${outputFilePath}`);
            const resString = outputFilePath.substring(outputFilePath.indexOf('/'));

            let url = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT_NO}${resString}`;
            console.log(url)
            return url;
        } catch (err: any) {
            console.error('Error saving image:', err);
            throw err;
        }
    }
    public async getSpareList(): Promise<any> {

        const promiseToken: any = new Promise(async (resolve, reject) => {
            try {
                const db = new MongoDBConnection();
                const collection = db.database.collection(SpareService.productsCollection);

                const query = {};
                const result: any[] = await collection.find(query).toArray();
                logger.verbose('getSpareList Data: ' + JSON.stringify(result));

                let spareData: Spare[] = [];
                if (result && result.length > 0) {
                    result.forEach((row: any) => {
                        row = this.processRow(row);
                        spareData.push(row);
                    });
                }
                resolve(spareData);

            } catch (error: any) {
                logger.verbose('Error in  getSpareList:' + error);
                reject(error);
            }
        })
        return promiseToken;
    }

    public async addSpareDetails(newObject: any): Promise<any> {

        const promiseToken: any = new Promise(async (resolve, reject) => {
            try {
                const db = new MongoDBConnection();
                const collection = db.database.collection(SpareService.productsCollection);

                const result = await collection.insertOne(newObject);
                resolve(result);

            } catch (error: any) {
                logger.verbose('Error in  addSpareDetails:' + error);
                reject(error);
            }
        })
        return promiseToken;
    }

    public processRow(row: any): Spare {

        return new SpareBuilder()
            .setId(row.id)
            .setModelName(row.model_name)
            .setName(row.name)
            .setStarCount(row.star_count)
            .setNoOfReview(row.no_of_review)
            .setCost(row.cost)
            .build();

    }
}