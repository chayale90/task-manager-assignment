import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { createTaskSchema, updateTaskSchema } from '../../../shared/schemas/task';

const prisma = new PrismaClient();

const userSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
} as const;

const taskInclude = {
  user: { select: userSelect },
  assignments: {
    include: { user: { select: userSelect } },
  },
  tags: {
    include: { tag: true },
  },
} as const;

export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { status } = req.query;

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      ...(status && { status: status as string }),
    },
    include: taskInclude,
    orderBy: { createdAt: 'desc' },
  });

  res.json(tasks);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    const validationResult = createTaskSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const titleError = errors.find(err => err.path.includes('title'));
      
      if (titleError) {
        return res.status(400).json({ 
          error: 'Title is required',
          message: 'Please enter a title for the task'
        });
      }
      
      return res.status(400).json({ 
        error: 'Validation error',
        details: errors.map(err => ({ field: err.path.join('.'), message: err.message }))
      });
    }

    const { title, description, status, priority, assigneeIds } = validationResult.data;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        userId: userId!,
        ...(Array.isArray(assigneeIds) && assigneeIds.length > 0 && {
          assignments: {
            create: assigneeIds.map((uid: string) => ({ userId: uid })),
          },
        }),
      },
      include: taskInclude,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assigneeIds } = req.body;

    await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
      },
    });

    if (Array.isArray(assigneeIds)) {
      await prisma.taskAssignment.deleteMany({ where: { taskId: id } });
      if (assigneeIds.length > 0) {
        await prisma.taskAssignment.createMany({
          data: assigneeIds.map((uid: string) => ({ taskId: id, userId: uid })),
        });
      }
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.taskAssignment.deleteMany({ where: { taskId: id } });
    await prisma.task.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        ...taskInclude,
        comments: {
          include: { user: { select: userSelect } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

