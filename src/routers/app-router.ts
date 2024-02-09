import Express from 'express';

export interface AppRouter {
    getRouter(): Express.Router;
}
