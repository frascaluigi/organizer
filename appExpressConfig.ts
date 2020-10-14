
import * as express from 'express';
import * as cors from "cors";
import * as helmet from "helmet";
// import "reflect-metadata";
import * as bodyparser from 'body-parser';
import routes from './src/routes';
import { handleError } from './src/middlewares/handleError';


const startApp = () => {

    const app = express();
    app.use(cors())
    app.use(helmet());

    app.use(bodyparser.json({ limit: '12mb' }));

    app.use('/',routes);

    //error middleware
    app.use(handleError);

    return app;
}

export default startApp;