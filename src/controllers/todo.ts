import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/express";

const prisma = new PrismaClient();

export const getTodo = async(req: AuthRequest, res: Response): Promise<void>  =>{
    try {
        if(!req.user){
            res.status(401).json({ error: "Unauthorized" });
            return; 
        }

        const {topicId} = req.params;

        if(!topicId){
            res.status(400).json({ error: "topic id is required" });
      return;
        }

        const todos = await prisma.todoList.findMany({
            where: {
                userId: req.user.id,
                topicId
            },

            include: {
                topic: true,
                items: true,
            }
        })
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error getting topics:", error);
    res.status(500).json({ 
      error: "An error occurred while getting topics",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}


export const postTodo = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Ensure the user is authenticated
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Extract the topicId from the request parameters
        const { topicId } = req.params;
        // Extract title and description from the request body
        const { title, description } = req.body;

        // Check if the required data (title and topicId) is provided
        if (!title || !topicId) {
            res.status(400).json({ error: "Title and topicId are required" });
            return;
        }

        // Create a new TodoList entry in the database
        const todos = await prisma.todoList.create({
            data: {
                title,
                description,
                topic: {
                    connect: { id: topicId }, // Link the TodoList to the specified topic
                },
                user: {
                    connect: { id: req.user.id }, // Link the TodoList to the current user
                },
            },
        });

        // Return the newly created TodoList
        res.status(201).json(todos);

    } catch (error) {
        console.error("Error creating TodoList:", error);
        res.status(500).json({
            error: "An error occurred while creating the TodoList",
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

