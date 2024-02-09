// The framework used to manage routes
import Express from 'express';

// For creating secure Webservices
import * as http from 'http';
import * as https from 'https';
import moment from 'moment-timezone'
import Path from 'path';
import Morgan from 'morgan';
import BodyParser from 'body-parser';
import cors from 'cors';
import { DateTime } from "luxon";

import { logger } from './middlewares/logging-middleware';
import { ResponseHelper } from './utils/response-helpers';
import { MongoDBConnection } from './config/mongo-db.connection';

import 'dotenv/config'
import { AppRouter } from './routers/app-router';
import { SpareRouter } from './routers/spare-router';

class App {

    public app: Express.Application;

    private httpServer: http.Server | undefined;
    private httpsServer: https.Server | undefined;

    private readonly defaultHttpPort = 4443;
    private activePort: number = this.defaultHttpPort;

    private baseSpareUrl: string;
    private baseAppStaicUrl: string;
    private corsOptions: cors.CorsOptions;

    private mongoDbConnection: MongoDBConnection;

    private clientUrl = [
        'http://localhost:4200',
        'http://localhost:4443/',
        /localhost:4443$/
    ];


    constructor() {
        this.app = Express();
        this.activePort = process.env.PORT_NO ? parseInt(process.env.PORT_NO) : this.defaultHttpPort;

        this.baseSpareUrl = `${process.env.BASE_APP_URL}/spare`;
        this.baseAppStaicUrl = `${process.env.BASE_APP_STAIC_URL}` ? `${process.env.BASE_APP_STATIC_URL}` : '/api-server/static';

        this.mongoDbConnection = new MongoDBConnection();

        this.corsOptions = {
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Access-Control-Allow-Origin', 'X-Access-Token', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
            credentials: true,
            methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
            origin: this.clientUrl,
            preflightContinue: false
        };


        Morgan.token('date', (req: any, res: any, tz: any) => {
            return moment().tz(tz).format();
        })
        let d = DateTime.local();
        Morgan.format('myformat', ':date[' + `${d.zoneName}` + '] ":method :url" :status :res[content-length] - :response-time ms');
        this.app.use(Morgan('myformat', { stream: logger.stream() }));
        this.app.use(Express.json());
        this.app.use(cors(this.corsOptions));
        this.app.use(cors({ origin: '*' }));


        this.app.use(Express.static(Path.join(__dirname, 'public')));
        this.app.use('/images', Express.static(Path.join(__dirname, 'images')));
        this.httpServer = http.createServer(this.app);

        this.app.use((err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            logger.error('Error caught by the server...');

            if (err) {
                logger.error('App Error');
                logger.error(err.message);
                ResponseHelper.sendError(res, err.code, err.errorType, `${err.message}`);
            }
            else {
                // All other errors
                logger.error('Unknown Error');
                logger.error(err);
                ResponseHelper.sendError(res, 500, 'server-error', `${err.message}`);
            }
            next();
        });

        this.initRoutes();
    }
    public getServer(): http.Server | https.Server | undefined {
        return (this.httpsServer != null) ? this.httpsServer : this.httpServer;
    }

    public getPort(): number {
        return this.activePort;
    }

    private async initRoutes(): Promise<void> {
        this.app.use(BodyParser.json({ type: 'application/*+json' }));
        this.app.use(BodyParser.urlencoded({ extended: true }));

        const spareRouter: AppRouter = new SpareRouter();
        this.app.use(this.baseSpareUrl, spareRouter.getRouter());

    }

}
// Export an instance of the app
export default new App();