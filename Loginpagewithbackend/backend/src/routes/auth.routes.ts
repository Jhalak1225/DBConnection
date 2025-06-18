import { Router } from 'express';
import { register, login, getUserCount } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user-count', getUserCount);

export default router;
