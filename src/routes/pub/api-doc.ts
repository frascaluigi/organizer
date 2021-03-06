import {Router} from "express";
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJSDoc from 'swagger-jsdoc';
const pjson = require('../../../package.json');

const router = Router();

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
	openapi: '3.0.1',
	info: {
		title: 'Organizer API',
		version: pjson.version,
		description: 'organizer api',
	},
	servers: [{
		url: `http://${process.env.SERVICE_URL}:${process.env.SERVICE_PORT}/`,
		variables:{
			protocol:{
				enum:["http"],
				default: "http"
			}
		}
	}],
	components: {
		securitySchemes: {
			jwtAuth: {
				type: 'apiKey',
				in: 'header',
				name: 'auth',
			},
		},
	},
	security: [
		{
			jwtAuth: [],
		},
	],
};

const options: swaggerJSDoc.Options = {
	swaggerDefinition: swaggerDefinition,
	apis: ['src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;