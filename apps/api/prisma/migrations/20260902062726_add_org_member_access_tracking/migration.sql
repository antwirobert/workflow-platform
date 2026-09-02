-- AlterTable
ALTER TABLE "organization_members" ADD COLUMN     "access_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_accessed_at" TIMESTAMP(3);
