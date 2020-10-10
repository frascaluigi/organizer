import * as express from 'express';
import * as cors from "cors";
import * as helmet from "helmet";
import * as bodyparser from 'body-parser';
import routes from './src/routes';
import {createConnection, ConnectionOptions} from "typeorm";

const connection:ConnectionOptions = {
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USER,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: process.env.TYPEORM_SYNCHRONIZE == 'true',
    logging: process.env.TYPEORM_LOGGING == 'true',
    entities: [
        require('path').resolve(__dirname, "./src/entities/**/*.ts"),
        require('path').resolve(__dirname, "./src/entities/**/*.js")
      ],
      migrations: [
        require('path').resolve(__dirname, "./src/migration/**/*.ts"),
        require('path').resolve(__dirname, "./src/migration/**/*.js"),
      ],
      subscribers: [
        require('path').resolve(__dirname, "./src/subscriber/**/*.ts"),
        require('path').resolve(__dirname, "./src/subscriber/**/*.js")
      ],
    cli: {
      entitiesDir: "entities",
      migrationsDir: "migration",
      subscribersDir: "subscriber"
    },
    uuidExtension: 'pgcrypto'
}

const app = express();
app.use(cors())
app.use(helmet());
app.use(bodyparser.json({ limit: '12mb' }));

app.use('/',routes);

createConnection(connection)
    .then(() => {
        console.log("connection started");
        app.listen('3010', () => {
            console.log("organizer server started at port 3010");
        });
    })
    .catch((err) => console.error("something is wrong: ", err));







