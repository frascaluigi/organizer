
import * as express from 'express';
import * as cors from "cors";
import * as helmet from "helmet";
// import "reflect-metadata";
import * as bodyparser from 'body-parser';
import routes from './src/routes';
import { handleError } from './src/middlewares/handleError';
import * as path from 'path';


const startApp = () => {

    const app = express();
    app.use(cors())
    app.use(helmet());

    app.use(bodyparser.json({ limit: '12mb' }));

    app.set("view engine", "pug");
    app.set("views", path.join(__dirname, "src", "views"));

    app.use('/',routes);

    //error middleware
    app.use(handleError);

    return app;
}

export default startApp;