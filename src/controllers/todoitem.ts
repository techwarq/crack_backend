import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/express";

const prisma = new PrismaClient();

// Add an item to a TodoList
export const addTodoItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { todoListId } = req.params;
    const { title } = req.body;

    if (!title?.trim() || !todoListId) {
      res.status(400).json({ error: "Title and TodoList ID are required" });
      return;
    }

    const todoItem = await prisma.todoItem.create({
      data: {
        title: title.trim(),
        isCompleted: false, // Default value
        todoList: { connect: { id: todoListId } },
      },
    });

    res.status(201).json(todoItem);
  } catch (error) {
    console.error("Error adding TodoItem:", error);
    res.status(500).json({
      error: "An error occurred while adding the TodoItem",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all items in a TodoList
export const getTodoItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { todoListId } = req.params;

    if (!todoListId) {
      res.status(400).json({ error: "TodoList ID is required" });
      return;
    }

    const todoItems = await prisma.todoItem.findMany({
      where: { todoListId },
    });

    res.status(200).json(todoItems);
  } catch (error) {
    console.error("Error retrieving TodoItems:", error);
    res.status(500).json({
      error: "An error occurred while retrieving TodoItems",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update the completion status of a TodoItem
export const toggleTodoItemCompletion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { itemId } = req.params;
    const { isCompleted } = req.body;

    if (typeof isCompleted !== "boolean") {
      res.status(400).json({ error: "Invalid value for isCompleted. Must be a boolean." });
      return;
    }

    const updatedItem = await prisma.todoItem.update({
      where: { id: itemId },
      data: { isCompleted },
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating TodoItem:", error);
    res.status(500).json({
      error: "An error occurred while updating the TodoItem",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
