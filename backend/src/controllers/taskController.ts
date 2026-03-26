import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { createTaskSchema, updateTaskSchema } from '../../../shared/schemas/task';
import { createActivity } from '../services/activityService';

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
  const { status, priority, search } = req.query;

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { userId },
        { assignments: { some: { userId } } },
      ],
      deletedAt: null,
      ...(status && { status: status as string }),
      ...(priority && { priority: priority as string }),
      ...(search && {
        OR: [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ],
      }),
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

    const { title, description, status, priority, assigneeIds, tagIds } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

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
        ...(Array.isArray(tagIds) && tagIds.length > 0 && {
          tags: {
            create: tagIds.map((tid: string) => ({ tagId: tid })),
          },
        }),
      },
      include: taskInclude,
    });

    await createActivity({
      taskId: task.id,
      userId: userId!,
      type: 'TASK_CREATED',
      description: 'created this task',
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
    const userId = req.userId;
    const { title, description, status, priority, assigneeIds, tagIds } = req.body;

    const oldTask = await prisma.task.findUnique({
      where: { id },
      include: {
        assignments: true,
      },
    });

    if (!oldTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
      },
    });

    if (status && status !== oldTask.status) {
      await createActivity({
        taskId: id,
        userId: userId!,
        type: 'STATUS_CHANGED',
        description: `changed status from ${oldTask.status} to ${status}`,
      });
    }

    if (priority && priority !== oldTask.priority) {
      await createActivity({
        taskId: id,
        userId: userId!,
        type: 'PRIORITY_CHANGED',
        description: `changed priority from ${oldTask.priority} to ${priority}`,
      });
    }

    if (Array.isArray(assigneeIds)) {
      const oldAssigneeIds = oldTask.assignments.map((a) => a.userId).sort();
      const newAssigneeIds = [...assigneeIds].sort();
      const assigneesChanged = JSON.stringify(oldAssigneeIds) !== JSON.stringify(newAssigneeIds);

      await prisma.taskAssignment.deleteMany({ where: { taskId: id } });
      if (assigneeIds.length > 0) {
        await prisma.taskAssignment.createMany({
          data: assigneeIds.map((uid: string) => ({ taskId: id, userId: uid })),
        });
      }

      if (assigneesChanged) {
        await createActivity({
          taskId: id,
          userId: userId!,
          type: 'ASSIGNEE_CHANGED',
          description: 'updated assignees',
        });
      }
    }

    if (Array.isArray(tagIds)) {
      await prisma.taskTag.deleteMany({ where: { taskId: id } });
      if (tagIds.length > 0) {
        await prisma.taskTag.createMany({
          data: tagIds.map((tid: string) => ({ taskId: id, tagId: tid })),
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
    const userId = req.userId;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is the owner
    if (task.userId !== userId) {
      return res.status(403).json({ error: 'Only the task owner can delete this task' });
    }

    // Soft delete: set deletedAt instead of removing from DB
    await prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Log activity — task still exists so no cascade issue
    await createActivity({
      taskId: id,
      userId: userId!,
      type: 'TASK_DELETED',
      description: 'deleted this task',
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: { id, deletedAt: null },
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

export const getTaskActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const activities = await prisma.activity.findMany({
      where: { taskId: id },
      include: {
        user: {
          select: userSelect,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching task activity:', error);
    res.status(500).json({ error: 'Failed to fetch task activity' });
  }
};
