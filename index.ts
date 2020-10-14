import {createConnection, ConnectionOptions} from "typeorm";
import startApp from './appExpressConfig';

export const connection:ConnectionOptions = {
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT) || 5432,
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

process.env.NODE_ENV !== 'test' && 
createConnection(connection)
    .then(() => {
        console.info("connection started");
        const app=startApp();
        app.listen(process.env.SERVICE_PORT, () => {
            console.info(`URL http://${process.env.SERVICE_URL}:${process.env.SERVICE_PORT}`);
            console.info(`Organizer server started at port ${process.env.SERVICE_PORT}`);
        });
    })
    .catch((err) => console.error("something is wrong: ", err));







