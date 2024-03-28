import {
  getProfile,
  loginUser,
  registerUser
} from '@/controllers/user.controller';
import { isAuthenticated } from '@/middlewares/auth';
import express from 'express';

const router = express.Router();
export const userRoute = router;

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', isAuthenticated, getProfile);
