-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `fullName` VARCHAR(64) NOT NULL,
    `email` VARCHAR(64) NOT NULL,
    `twoFactor` BOOLEAN NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtpToken` (
    `userId` CHAR(36) NOT NULL,
    `token` CHAR(10) NOT NULL,
    `expiration` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OtpToken_userId_key`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
