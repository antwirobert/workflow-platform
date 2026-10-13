import { prisma } from "../src/lib/prisma";

async function main() {
  const result = await prisma.invitation.deleteMany({
    where: { email: "thename3438@gmail.com", status: "PENDING" },
  });
  console.log("Deleted:", result.count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
