/*
  Warnings:

  - You are about to drop the column `membershipExpiry` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudentProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "membershipType" TEXT,
    "membershipEndDate" DATETIME,
    "monthlyFee" REAL,
    "observations" TEXT,
    "age" INTEGER,
    "details" TEXT,
    "pathologies" TEXT,
    CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentProfile_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StudentProfile" ("age", "details", "id", "monthlyFee", "observations", "pathologies", "professorId", "startDate", "userId") SELECT "age", "details", "id", "monthlyFee", "observations", "pathologies", "professorId", "startDate", "userId" FROM "StudentProfile";
DROP TABLE "StudentProfile";
ALTER TABLE "new_StudentProfile" RENAME TO "StudentProfile";
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
