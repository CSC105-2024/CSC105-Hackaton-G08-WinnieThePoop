import * as Recordcontroller from '../controllers/record.controller.ts';
import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.ts';

const recordRouter = new Hono();
recordRouter.use('*', authMiddleware);

recordRouter.get('/', Recordcontroller.fetchRecordsController);
recordRouter.get('/count/:date', Recordcontroller.fetchRecordCountByDateController);
recordRouter.post('/', Recordcontroller.createRecordController);
recordRouter.put('/:id', Recordcontroller.updateRecordController);
recordRouter.delete('/:id', Recordcontroller.deleteRecordController);

export default recordRouter;