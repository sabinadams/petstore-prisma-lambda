/*
  Warnings:

  - You are about to drop the `Snake` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Snake";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Rabbit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL
);
