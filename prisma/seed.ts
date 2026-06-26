import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoLinks = [
  "https://example.com/gemini-subscription/demo-001",
  "https://example.com/gemini-subscription/demo-002",
  "https://example.com/gemini-subscription/demo-003"
];

async function main() {
  await prisma.link.createMany({
    data: demoLinks.map((link) => ({ link })),
    skipDuplicates: true
  });

  const available = await prisma.link.count({ where: { status: "available" } });
  console.log(`Seed complete. Available links: ${available}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
