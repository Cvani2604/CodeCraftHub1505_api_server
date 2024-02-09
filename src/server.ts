import app from './app';
import { logger } from './middlewares/logging-middleware';

const server = app.getServer();
const port = app.getPort();

if (server) {

    server.listen(port, '0.0.0.0', () => {
        logger.verbose(`Listening on port ${port}...`);
    }).on('error', (err: any) => {
        if (err && err.code) {
            if (err.code === 'EADDRINUSE') {
                logger.verbose('Address in use');
                process.exit(0);
            }
            else {
                logger.verbose(err);
            }
        }
        else {
            logger.verbose(err);

        }
    });
}
else {
    logger.verbose('control came here in else')
}
