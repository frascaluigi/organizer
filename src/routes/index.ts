import {Request, Response, Router} from "express";
import health from './pub/health';
import event from './event';
import auth from './pub/auth';
import docs from './pub/api-doc';

const router = Router();

router.use('/', docs) ;
router.use('/auth', auth);
router.use('/health', health);
router.use('/event', event);
router.use('*', (req:Request, res:Response) => {
    res.render('welcome');
})

export default router;