import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/express";  // Ensure this path is correct

const prisma = new PrismaClient()

export const postGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
   
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { title, description } = req.body;

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        userId: req.user.id,  
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create goal" });
  }
};

// Controller for fetching goals for the authenticated user
export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id }, 
      include: { topics: true },
    });

    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};
