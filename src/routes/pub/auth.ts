import {Router} from "express";
import AuthController from "../../controllers/AuthController";


/**
 * @swagger
 * components:
 *  schema:
 *   RegisterSchema:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         format: email
 *       password:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 */

/**
 * @swagger
 * components:
 *  schema:
 *   LoginSchema:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         format: email
 *       password:
 *         type: string
 */
const router = Router();

/**
 * @swagger
 *  /auth/register/:
 *   post:
 *     tags:
 *       - Auth
 *     summary: "create a new user for organizer"
 *     requestBody:
 *         description: information of the user who wants to register
 *         required: true
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/RegisterSchema'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return id of new user
 *       409:
 *         description: user already exists
 */
router.post('/register', AuthController.registerUserResponse); //route public without authorization

/**
 * @swagger
 *  /auth/login/:
 *   post:
 *     tags:
 *       - Auth
 *     summary: "organizer platform login"
 *     requestBody:
 *         description: credentials for login
 *         required: true
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/LoginSchema'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return id of new user
 *       409:
 *         description: user already exists
 */
router.post('/login', AuthController.loginUserResponse);

export default router;