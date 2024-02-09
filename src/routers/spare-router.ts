import Express from 'express';

import { AppRouter } from "./app-router";
import { SpareController } from '../controllers/spare-controller';

export class SpareRouter implements AppRouter {

    private router: Express.Router;
    private spareController: SpareController;

    constructor() {
        this.router = Express.Router();
        this.spareController = new SpareController();
        this.initRoutes();
    }

    public getRouter(): Express.Router {
        return this.router;
    }

    private initRoutes(): void {

        this.router.route('/upload-image')
            .post((req: Express.Request, res: Express.Response) => {
                return this.spareController.uploadImage(req, res);
            })

        this.router.route('/get-images')
            .get((req: Express.Request, res: Express.Response) => {
                return this.spareController.getImage(req, res);
            })

        this.router.route('/add-spare-details')
            .post((req: Express.Request, res: Express.Response) => {
                return this.spareController.addSpareDetails(req, res);
            })


        this.router.route('/get-spare-details')
            .get((req: Express.Request, res: Express.Response) => {
                return this.spareController.getSpareList(req, res);
            })
    }

}