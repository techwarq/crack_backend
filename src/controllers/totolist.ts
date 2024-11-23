import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/express";

const prisma = new PrismaClient();

// Create a new TodoList
export const createTodoList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { title, description, topicId } = req.body;

    if (!title?.trim() || !topicId) {
      res.status(400).json({ error: "Title and Topic ID are required" });
      return;
    }

    const todoList = await prisma.todoList.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        topic: { connect: { id: topicId } },
        user: { connect: { id: req.user.id } },
      },
    });

    res.status(201).json(todoList);
  } catch (error) {
    console.error("Error creating TodoList:", error);
    res.status(500).json({
      error: "An error occurred while creating the TodoList",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all TodoLists for a user
export const getTodoLists = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { topicId } = req.params;

    if (!topicId) {
      res.status(400).json({ error: "Topic ID is required" });
      return;
    }

    const todoLists = await prisma.todoList.findMany({
      where: {
        userId: req.user.id,
        topicId,
      },
      include: {
        items: true,
      },
    });

    res.status(200).json(todoLists);
  } catch (error) {
    console.error("Error retrieving TodoLists:", error);
    res.status(500).json({
      error: "An error occurred while retrieving TodoLists",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
