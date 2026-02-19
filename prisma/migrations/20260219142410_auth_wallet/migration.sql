/*
  Warnings:

  - The values [CREATED,PENDING_PROVIDER,HOLD_PLACED,SENT_TO_PROVIDER,SUCCEEDED] on the enum `TxStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `idempotencyKey` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `providerRef` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,2)` to `Integer`.
  - You are about to drop the `LedgerEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WalletAccount` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reference]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `walletId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TxStatus_new" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
ALTER TABLE "Transaction" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Transaction" ALTER COLUMN "status" TYPE "TxStatus_new" USING ("status"::text::"TxStatus_new");
ALTER TYPE "TxStatus" RENAME TO "TxStatus_old";
ALTER TYPE "TxStatus_new" RENAME TO "TxStatus";
DROP TYPE "TxStatus_old";
ALTER TABLE "Transaction" ALTER COLUMN "status" SET DEFAULT 'SUCCESS';
COMMIT;

-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_creditAccountId_fkey";

-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_debitAccountId_fkey";

-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_txId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "WalletAccount" DROP CONSTRAINT "WalletAccount_userId_fkey";

-- DropIndex
DROP INDEX "Transaction_idempotencyKey_key";

-- DropIndex
DROP INDEX "Transaction_providerRef_idx";

-- DropIndex
DROP INDEX "Transaction_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "currency",
DROP COLUMN "idempotencyKey",
DROP COLUMN "providerRef",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "walletId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'SUCCESS',
ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "LedgerEntry";

-- DropTable
DROP TABLE "WalletAccount";

-- DropEnum
DROP TYPE "AccountType";

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE INDEX "Transaction_walletId_createdAt_idx" ON "Transaction"("walletId", "createdAt");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
