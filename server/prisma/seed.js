import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { firebaseId: 'demo-user-123' },
        update: {},
        create: {
            firebaseId: 'demo-user-123',
            email: 'priya@example.com',
            name: 'Priya',
            role: 'ENTREPRENEUR',
            industry: 'Textiles',
            location: 'Coimbatore',
            growthScore: 78,
        },
    });

    console.log('Seeded User:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
