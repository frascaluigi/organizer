import {Router} from "express";
import EventController from "../controllers/EventController";
import {checkToken} from '../middlewares/checkToken';
const router = Router();


/**
 * @swagger
 * components:
 *  schema:
 *   EventSchema:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       address:
 *         type: string
 *       start:
 *         type: string
 *         format: date-time
 *       end:
 *         type: string
 *         format: date-time
 */

/**
 * @swagger
 *  /event/{id}:
 *   get:
 *     tags:
 *       - Event
 *     description: get user event by event id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id event
 *         required: true
 *         type: string
 *     security:
 *       - jwtAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return event details
 */
router.get('/:id', [checkToken], EventController.getEventByIdResponse);

/**
 * @swagger
 *  /event/{period}:
 *   get:
 *     tags:
 *       - Event
 *     description: get user event by event id
 *     parameters:
 *       - name: period
 *         in: path
 *         description: period time
 *         required: false
 *         type: string
 *     security:
 *       - jwtAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return events in that period
 */
router.get('/', [checkToken], EventController.getEventByPeriodResponse);

/**
 * @swagger
 *  /event/:
 *   post:
 *     tags:
 *       - Event
 *     summary: "create a new user event"
 *     requestBody:
 *         description: information about event
 *         required: true
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/EventSchema'
 *     security:
 *       - jwtAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return id of new event
 */
router.post('/', [checkToken], EventController.createEventResponse);

/**
 * @swagger
 *  /event/{id}:
 *   put:
 *     tags:
 *       - Event
 *     summary: "update an event by id"
 *     requestBody:
 *         description: information about event
 *         required: true
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/EventSchema'
 *     security:
 *       - jwtAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: NO CONTENT
 */
router.put('/:id', [checkToken], EventController.updateEventResponse);

/**
 * @swagger
 *  /event/{id}:
 *   delete:
 *     tags:
 *       - Event
 *     summary: "remove an event by id"
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id event
 *         required: true
 *         type: string
 *     security:
 *       - jwtAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: NO CONTENT
 */
router.delete('/:id', [checkToken], EventController.deleteEventByIdResponse);

export default router;