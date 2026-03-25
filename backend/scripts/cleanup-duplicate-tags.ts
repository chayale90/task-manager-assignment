import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDuplicateTags() {
  console.log('Cleaning up duplicate tags...');

  const tagNames = ['Frontend', 'Backend', 'Urgent', 'Bug'];

  for (const tagName of tagNames) {
    const tags = await prisma.tag.findMany({
      where: { name: tagName },
      orderBy: { createdAt: 'asc' },
    });

    if (tags.length > 1) {
      console.log(`Found ${tags.length} duplicates of "${tagName}"`);
      
      const keepTag = tags[0];
      const duplicates = tags.slice(1);

      for (const duplicate of duplicates) {
        await prisma.taskTag.updateMany({
          where: { tagId: duplicate.id },
          data: { tagId: keepTag.id },
        });

        await prisma.tag.delete({
          where: { id: duplicate.id },
        });

        console.log(`  Deleted duplicate tag: ${duplicate.id}`);
      }
    }
  }

  console.log('Cleanup complete!');
}

cleanupDuplicateTags()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
