-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorMethod" TEXT,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "twoFactorStatus" TEXT NOT NULL DEFAULT 'not_setup';
