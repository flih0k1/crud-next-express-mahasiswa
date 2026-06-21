-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_kampus
CREATE DATABASE IF NOT EXISTS `db_kampus` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_kampus`;

-- Dumping structure for table db_kampus.mahasiswa
CREATE TABLE IF NOT EXISTS `mahasiswa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nim` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `prodi` varchar(100) NOT NULL,
  `angkatan` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nim` (`nim`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_kampus.mahasiswa: ~3 rows (approximately)
INSERT INTO `mahasiswa` (`id`, `nim`, `nama`, `prodi`, `angkatan`, `created_at`) VALUES
	(1, '2201001', 'Ahmad Fauzi', 'Informatika', 2022, '2026-06-13 04:11:59'),
	(2, '2201002', 'Siti Aminah', 'Sistem Informasi', 2022, '2026-06-13 04:11:59'),
	(3, '2201003', 'Rafli Sujatmiko', 'Teknik Industri', 2023, '2026-06-13 04:16:39');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
