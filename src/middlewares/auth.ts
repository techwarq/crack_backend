import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { PrismaClient, User } from "@prisma/client";
import { AuthRequest } from "../types/express";

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header is missing' });
      return;
    }

    // Check for Bearer scheme
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization must start with "Bearer "' });
      return;
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token is missing' });
      return;
    }

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // Log for debugging
    console.log('Token payload:', {
      userId: payload.userId,
      iat: payload.iat,
      exp: payload.exp
    });

    const user = await prisma.user.findUnique({ 
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
    createdAt: true,
    updatedAt: true,
    profileImage: true,

        // Add other fields you need, but exclude sensitive ones
      }
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Log successful authentication
    console.log('User authenticated:', user.id);

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Authentication error' });
    }
  }
};

export default authMiddleware;