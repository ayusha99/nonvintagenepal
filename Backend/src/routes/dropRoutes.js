import express from 'express';
import { getDrops } from '../controllers/dropController.js';

const router = express.Router();

router.get('/', getDrops);

export default router;
