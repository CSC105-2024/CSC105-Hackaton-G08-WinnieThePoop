-- AlterTable
ALTER TABLE `Record` ADD COLUMN `RecordTexture` ENUM('HardLump', 'Sausage', 'SoftBlob', 'Mushy', 'Liquid') NOT NULL DEFAULT 'Sausage';
