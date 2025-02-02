/*
  Warnings:

  - You are about to drop the column `commentsCount` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `repost_id` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_repost_id_fkey";

-- DropIndex
DROP INDEX "posts_commentsCount_idx";

-- DropIndex
DROP INDEX "posts_likesCount_idx";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "commentsCount",
DROP COLUMN "likesCount",
DROP COLUMN "repost_id",
ADD COLUMN     "original_id" TEXT,
ADD COLUMN     "original_user_id" TEXT;

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_original_id_fkey" FOREIGN KEY ("original_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
