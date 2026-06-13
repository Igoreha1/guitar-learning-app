-- AlterTable
ALTER TABLE `users` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verification_code` VARCHAR(191) NULL,
    ADD COLUMN `verification_expires` DATETIME(3) NULL;
