import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/express";

const prisma = new PrismaClient();

export const postTopics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { goalId } = req.params;
    const { title, description } = req.body;

    // Validate required fields
    if (!title?.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    if (!goalId) {
      res.status(400).json({ error: "Goal ID is required" });
      return;
    }

    // Create topic with direct field assignment since we have the fields in our schema
    const topic = await prisma.topic.create({
      data: {
        title: title.trim(),
        description: description?.trim(), // Optional in schema
        goalId: goalId,     // Required in schema
        userId: req.user.id // Optional in schema
      },
      include: {
        goal: true,
        todoLists: true,
        subTopics: true,
        questions: true
      }
    });

    console.log('Topic created:', topic);
    res.status(201).json(topic);

  } catch (error) {
    console.error("Error details:", error);
    
    // Check for specific Prisma errors
    if (error instanceof Error && error.message.includes('Foreign key constraint failed')) {
      res.status(400).json({ 
        error: "Goal not found or does not belong to user",
        details: error.message 
      });
      return;
    }

    res.status(500).json({ 
      error: "An error occurred while creating the topic",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getTopic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { goalId } = req.params;

    if (!goalId) {
      res.status(400).json({ error: "Goal ID is required" });
      return;
    }

    const topics = await prisma.topic.findMany({
      where: { 
        userId: req.user.id, 
        goalId: goalId
      },
      include: {
        goal: true,
        todoLists: true,
        subTopics: true,
        questions: true
      }
    });

    res.status(200).json(topics);

  } catch (error) {
    console.error("Error getting topics:", error);
    res.status(500).json({ 
      error: "An error occurred while getting topics",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};