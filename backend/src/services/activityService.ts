import { PrismaClient, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateActivityParams {
  taskId: string;
  userId: string;
  type: ActivityType;
  description: string;
}

export const createActivity = async ({
  taskId,
  userId,
  type,
  description,
}: CreateActivityParams) => {
  return await prisma.activity.create({ 
    data: {
      taskId,
      userId,
      type,
      description,
    },
  });
};
