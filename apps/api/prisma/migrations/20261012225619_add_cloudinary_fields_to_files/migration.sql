/*
  Warnings:

  - You are about to drop the column `path` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `storedName` on the `files` table. All the data in the column will be lost.
  - Added the required column `public_id` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource_type` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "path",
DROP COLUMN "storedName",
ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "resource_type" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
