import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { signupSchema, loginSchema } from '../validations/user';
import { AuthRequest } from '../types/express';

const prisma = new PrismaClient();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

export const signup = async (req: Request, res: Response): Promise<void> => {
  
  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({ error: validationResult.error.errors });
    return;
  }

  const { email, password, name } = validationResult.data;

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = hashSync(password, 10);

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  // Validate request data with Zod
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({ error: validationResult.error.errors });
    return;
  }

  const { email, password } = validationResult.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(400).json({ error: 'User does not exist' });
      return;
    }

    if (!compareSync(password, user.password)) {
      res.status(400).json({ error: 'Incorrect password' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user' });
  }
};



export const me = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    res.json(req.user);
  };