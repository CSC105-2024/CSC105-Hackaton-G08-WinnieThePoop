-- CreateTable
CREATE TABLE `User` (
    `UserId` INTEGER NOT NULL AUTO_INCREMENT,
    `UserPassword` VARCHAR(191) NOT NULL,
    `UserEmail` VARCHAR(191) NOT NULL,
    `Username` VARCHAR(191) NOT NULL,
    `UserProfilePic` VARCHAR(191) NOT NULL DEFAULT 'Men1',
    `UserNoRecord` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_UserEmail_key`(`UserEmail`),
    PRIMARY KEY (`UserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Record` (
    `RecordId` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `RecordName` VARCHAR(191) NOT NULL,
    `RecordDescription` VARCHAR(191) NOT NULL,
    `RecordDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `RecordColor` ENUM('Brown', 'Yellow', 'Green', 'Red', 'Black', 'Gray') NOT NULL DEFAULT 'Brown',
    `RecordStatus` ENUM('Normal', 'Worrisome', 'Abnormal') NOT NULL DEFAULT 'Normal',

    PRIMARY KEY (`RecordId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`UserId`) ON DELETE RESTRICT ON UPDATE CASCADE;
