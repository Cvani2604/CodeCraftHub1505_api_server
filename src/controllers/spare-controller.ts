import Express from 'express';
import { logger } from '../middlewares/logging-middleware';
import { ResponseHelper } from '../utils/response-helpers';
import { SpareService } from '../modules/service/spare.service';



export class SpareController {

    constructor() {

    }


    public async uploadImage(req: Express.Request, res: Express.Response) {

        try {
            const dbService: SpareService = new SpareService();
            const path = req.body.path;
            const id = req.body.id;
            const data = await dbService.uploadImage(id, path);
            ResponseHelper.sendSuccess(req, res, 'Image Upload Successfully', data);
        }

        catch (error) {
            logger.debug('error : ' + error)
            ResponseHelper.sendError(res, 500, 'error', error + '');
        }
    }

    public async getImage(req: Express.Request, res: Express.Response) {

        try {
            const dbService: SpareService = new SpareService();
            // const id = req.body.id;
            const data = await dbService.getImage();
            ResponseHelper.sendSuccess(req, res, 'Image retrived Successfully', data);
        }

        catch (error) {
            logger.debug('error : ' + error)
            ResponseHelper.sendError(res, 500, 'error', error + '');
        }
    }


    public async getSpareList(req: Express.Request, res: Express.Response) {

        try {
            const dbService: SpareService = new SpareService();
            const data = await dbService.getSpareList();
            ResponseHelper.sendSuccess(req, res, 'Spare List User Details retrieved', data);
        }

        catch (error) {
            logger.debug('error : ' + error)
            ResponseHelper.sendError(res, 500, 'error', 'The server was unable to process the request');
        }
    }


    public async addSpareDetails(req: Express.Request, res: Express.Response) {

        try {
            const id = req.body.id;
            const modelName = req.body.modelName;
            const name = req.body.name;
            const starCount = req.body.starCount;
            const noOfReview = req.body.noOfReview;
            const cost = req.body.cost;

            // {"id": "123", "modelName":"abc", "name": "testing","noOfReview":"25", "starCount":"4", "cost":"1000"}
            let spareObj = {
                id: id,
                modelName: modelName,
                name: name,
                starCount: starCount,
                noOfReview: noOfReview,
                cost: cost
            }

            const dbService: SpareService = new SpareService();
            const data = await dbService.addSpareDetails(spareObj);
            ResponseHelper.sendSuccess(req, res, 'Spare is inserted Successfully', data);
        }

        catch (error) {
            logger.debug('error : ' + error)
            ResponseHelper.sendError(res, 500, 'error', 'The server was unable to process the request');
        }
    }
}