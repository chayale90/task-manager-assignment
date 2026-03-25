import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getTags = async (req: AuthRequest, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });

    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};
