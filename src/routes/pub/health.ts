import { Router, Request, Response } from "express";
import HealthController from "../../controllers/HealthController";

const router = Router();

/**
 * @swagger
 *  /health/:
 *   get:
 *     tags:
 *       - Health
 *     summary: "check webserver is up and running"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return object with info about webserver
 */
router.get('/', HealthController.serverHealthCheck);

export default router;