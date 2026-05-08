-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: vibesync
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artists` (
  `artist_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `bio` text,
  `avatar` varchar(255) DEFAULT 'default_artist.png',
  PRIMARY KEY (`artist_id`),
  KEY `idx_artist_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` VALUES (1,'The Weeknd','Canadian singer known for dark R&B vibes','https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26571c'),(2,'Billie Eilish','Gen-Z icon with haunting melodies','https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf'),(3,'Travis Scott','Houston rapper with psychedelic trap sound','https://i.scdn.co/image/ab6761610000e5eb19c2790744c792d05570bb71'),(4,'Lana Del Rey','Cinematic sad-girl aesthetic queen','https://i.scdn.co/image/ab6761610000e5ebb99cacf8acd5378206767261'),(5,'Eminem','Rap God - raw energy and lyrical power','https://i.scdn.co/image/ab6761610000e5eba00b11c129f27a75f0058c7a'),(6,'Dua Lipa','Pop queen with infectious dance tracks','https://i.scdn.co/image/ab6761610000e5eb1bbee4a02b96bcc8a85a58e3'),(7,'Post Malone','Genre-blending artist with emotional depth','https://i.scdn.co/image/ab6761610000e5ebe17c0aa1714a03d62b5ce4e0'),(8,'Ariana Grande','Powerhouse vocalist with pop perfection','https://i.scdn.co/image/ab6761610000e5eb40b5c07ab77b6b1a9075fdc0'),(9,'Kendrick Lamar','Conscious hip-hop genius','https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff0a38'),(10,'Taylor Swift','Storytelling mastermind across genres','https://i.scdn.co/image/ab6761610000e5ebe672b5f553298dcdccb0e676'),(11,'Arijit Singh','India\'s most beloved playback singer, known for soulful melodies','default_artist.png'),(12,'Pritam','Bollywood composer known for hit film soundtracks','default_artist.png'),(13,'A.R. Rahman','Oscar-winning composer, the Mozart of Madras','default_artist.png'),(14,'Shreya Ghoshal','One of the most versatile female playback singers in India','default_artist.png'),(15,'Atif Aslam','Pakistani-born singer with massive Bollywood hits','default_artist.png'),(16,'Jubin Nautiyal','Rising Bollywood singer known for romantic tracks','default_artist.png'),(17,'KK','Legendary playback singer remembered for timeless melodies','default_artist.png'),(18,'Darshan Raval','Popular indie and Bollywood singer-songwriter','default_artist.png');
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_comment_playlist` (`playlist_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`playlist_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,2,1,'This playlist hits different at 3am ≡ƒÆ½','2026-05-07 21:06:08'),(2,3,1,'Exactly what I needed tonight','2026-05-07 21:06:08'),(3,4,2,'Gym motivation on another level ≡ƒöÑ','2026-05-07 21:06:08'),(4,5,3,'Late night drives with this playlist = therapy','2026-05-07 21:06:08'),(5,1,5,'The pain is beautiful ≡ƒÆö','2026-05-07 21:06:08'),(6,4,6,'Party vibes activated! ≡ƒÄë','2026-05-07 21:06:08'),(7,5,7,'Romantic playlist of the year Γ¥ñ∩╕Å','2026-05-07 21:06:08'),(8,1,4,'Coding with this on repeat, absolute focus mode','2026-05-07 21:06:08');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `followers`
--

DROP TABLE IF EXISTS `followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followers` (
  `follower_id` int NOT NULL,
  `following_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`,`following_id`),
  KEY `following_id` (`following_id`),
  CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `followers_chk_1` CHECK ((`follower_id` <> `following_id`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followers`
--

LOCK TABLES `followers` WRITE;
/*!40000 ALTER TABLE `followers` DISABLE KEYS */;
INSERT INTO `followers` VALUES (1,2,'2026-05-07 21:06:08'),(1,3,'2026-05-07 21:06:08'),(1,4,'2026-05-07 21:06:08'),(2,1,'2026-05-07 21:06:08'),(2,3,'2026-05-07 21:06:08'),(2,5,'2026-05-07 21:06:08'),(3,1,'2026-05-07 21:06:08'),(3,4,'2026-05-07 21:06:08'),(4,1,'2026-05-07 21:06:08'),(4,2,'2026-05-07 21:06:08'),(4,5,'2026-05-07 21:06:08'),(5,1,'2026-05-07 21:06:08'),(5,3,'2026-05-07 21:06:08');
/*!40000 ALTER TABLE `followers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `like_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `unique_like` (`user_id`,`playlist_id`),
  KEY `playlist_id` (`playlist_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`playlist_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,1,3,'2026-05-07 21:06:08'),(2,1,5,'2026-05-07 21:06:08'),(3,1,6,'2026-05-07 21:06:08'),(4,2,1,'2026-05-07 21:06:08'),(5,2,2,'2026-05-07 21:06:08'),(6,2,9,'2026-05-07 21:06:08'),(7,3,1,'2026-05-07 21:06:08'),(8,3,4,'2026-05-07 21:06:08'),(9,3,7,'2026-05-07 21:06:08'),(10,4,2,'2026-05-07 21:06:08'),(11,4,3,'2026-05-07 21:06:08'),(12,4,10,'2026-05-07 21:06:08'),(13,5,1,'2026-05-07 21:06:08'),(14,5,5,'2026-05-07 21:06:08'),(15,5,6,'2026-05-07 21:06:08');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listening_history`
--

DROP TABLE IF EXISTS `listening_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listening_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `song_id` int NOT NULL,
  `played_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `song_id` (`song_id`),
  KEY `idx_history_user` (`user_id`),
  KEY `idx_history_played` (`played_at`),
  CONSTRAINT `listening_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `listening_history_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`song_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listening_history`
--

LOCK TABLES `listening_history` WRITE;
/*!40000 ALTER TABLE `listening_history` DISABLE KEYS */;
INSERT INTO `listening_history` VALUES (1,1,1,'2026-05-07 21:06:08'),(2,1,3,'2026-05-07 21:06:08'),(3,1,4,'2026-05-07 21:06:08'),(4,1,7,'2026-05-07 21:06:08'),(5,1,10,'2026-05-07 21:06:08'),(6,1,19,'2026-05-07 21:06:08'),(7,1,31,'2026-05-07 21:06:08'),(8,2,1,'2026-05-07 21:06:08'),(9,2,8,'2026-05-07 21:06:08'),(10,2,20,'2026-05-07 21:06:08'),(11,2,31,'2026-05-07 21:06:08'),(12,2,33,'2026-05-07 21:06:08'),(13,3,4,'2026-05-07 21:06:08'),(14,3,5,'2026-05-07 21:06:08'),(15,3,7,'2026-05-07 21:06:08'),(16,3,9,'2026-05-07 21:06:08'),(17,3,13,'2026-05-07 21:06:08'),(18,3,16,'2026-05-07 21:06:08'),(19,4,6,'2026-05-07 21:06:08'),(20,4,11,'2026-05-07 21:06:08'),(21,4,12,'2026-05-07 21:06:08'),(22,4,19,'2026-05-07 21:06:08'),(23,4,24,'2026-05-07 21:06:08'),(24,4,30,'2026-05-07 21:06:08'),(25,5,9,'2026-05-07 21:06:08'),(26,5,13,'2026-05-07 21:06:08'),(27,5,14,'2026-05-07 21:06:08'),(28,5,25,'2026-05-07 21:06:08'),(29,5,15,'2026-05-07 21:06:08'),(30,5,7,'2026-05-07 21:06:08'),(31,6,60,'2026-05-08 16:51:31'),(32,6,47,'2026-05-08 16:52:17'),(33,6,16,'2026-05-08 16:52:55'),(34,6,13,'2026-05-08 16:53:35'),(35,6,30,'2026-05-08 16:54:10'),(36,6,4,'2026-05-08 16:54:43'),(37,6,59,'2026-05-08 16:55:05'),(38,6,40,'2026-05-08 16:55:26'),(39,6,19,'2026-05-08 17:00:37'),(40,6,52,'2026-05-08 17:01:07');
/*!40000 ALTER TABLE `listening_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moods`
--

DROP TABLE IF EXISTS `moods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `moods` (
  `mood_id` int NOT NULL AUTO_INCREMENT,
  `mood_name` varchar(50) NOT NULL,
  `mood_color` varchar(7) NOT NULL DEFAULT '#ffffff',
  `mood_icon` varchar(50) DEFAULT 'music',
  PRIMARY KEY (`mood_id`),
  UNIQUE KEY `mood_name` (`mood_name`),
  KEY `idx_mood_name` (`mood_name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moods`
--

LOCK TABLES `moods` WRITE;
/*!40000 ALTER TABLE `moods` DISABLE KEYS */;
INSERT INTO `moods` VALUES (1,'Heartbreak','#ff4757','heart-crack'),(2,'Gym','#ff6348','dumbbell'),(3,'Lonely','#5f27cd','cloud-rain'),(4,'Study','#54a0ff','book-open'),(5,'Coding','#00d2d3','code'),(6,'Late Night','#341f97','moon'),(7,'Romantic','#ff6b81','heart'),(8,'Party','#feca57','party-popper'),(9,'Rage','#ee5a24','flame'),(10,'Chill','#1dd1a1','leaf'),(11,'Sad','#576574','cloud'),(12,'Happy','#f368e0','smile');
/*!40000 ALTER TABLE `moods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist_songs`
--

DROP TABLE IF EXISTS `playlist_songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist_songs` (
  `playlist_id` int NOT NULL,
  `song_id` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`playlist_id`,`song_id`),
  KEY `song_id` (`song_id`),
  CONSTRAINT `playlist_songs_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`playlist_id`) ON DELETE CASCADE,
  CONSTRAINT `playlist_songs_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`song_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist_songs`
--

LOCK TABLES `playlist_songs` WRITE;
/*!40000 ALTER TABLE `playlist_songs` DISABLE KEYS */;
INSERT INTO `playlist_songs` VALUES (1,3,'2026-05-07 21:06:08'),(1,4,'2026-05-07 21:06:08'),(1,10,'2026-05-07 21:06:08'),(1,20,'2026-05-07 21:06:08'),(1,31,'2026-05-07 21:06:08'),(2,9,'2026-05-07 21:06:08'),(2,13,'2026-05-07 21:06:08'),(2,14,'2026-05-07 21:06:08'),(2,15,'2026-05-07 21:06:08'),(2,25,'2026-05-07 21:06:08'),(3,1,'2026-05-07 21:06:08'),(3,8,'2026-05-07 21:06:08'),(3,20,'2026-05-07 21:06:08'),(3,31,'2026-05-07 21:06:08'),(3,33,'2026-05-07 21:06:08'),(4,6,'2026-05-07 21:06:08'),(4,12,'2026-05-07 21:06:08'),(4,19,'2026-05-07 21:06:08'),(4,20,'2026-05-07 21:06:08'),(4,32,'2026-05-07 21:06:08'),(5,4,'2026-05-07 21:06:08'),(5,5,'2026-05-07 21:06:08'),(5,10,'2026-05-07 21:06:08'),(5,21,'2026-05-07 21:06:08'),(5,34,'2026-05-07 21:06:08'),(6,7,'2026-05-07 21:06:08'),(6,16,'2026-05-07 21:06:08'),(6,17,'2026-05-07 21:06:08'),(6,22,'2026-05-07 21:06:08'),(6,23,'2026-05-07 21:06:08'),(7,2,'2026-05-07 21:06:08'),(7,11,'2026-05-07 21:06:08'),(7,19,'2026-05-07 21:06:08'),(7,24,'2026-05-07 21:06:08'),(7,30,'2026-05-07 21:06:08'),(8,6,'2026-05-07 21:06:08'),(8,12,'2026-05-07 21:06:08'),(8,19,'2026-05-07 21:06:08'),(8,29,'2026-05-07 21:06:08'),(9,9,'2026-05-07 21:06:08'),(9,13,'2026-05-07 21:06:08'),(9,14,'2026-05-07 21:06:08'),(9,15,'2026-05-07 21:06:08'),(9,25,'2026-05-07 21:06:08'),(10,6,'2026-05-07 21:06:08'),(10,12,'2026-05-07 21:06:08'),(10,19,'2026-05-07 21:06:08'),(10,20,'2026-05-07 21:06:08'),(10,29,'2026-05-07 21:06:08');
/*!40000 ALTER TABLE `playlist_songs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlists` (
  `playlist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `cover_image` varchar(255) DEFAULT 'default_playlist.png',
  `visibility` enum('public','private') DEFAULT 'public',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`playlist_id`),
  KEY `idx_playlist_user` (`user_id`),
  KEY `idx_playlist_visibility` (`visibility`),
  CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists`
--

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;
INSERT INTO `playlists` VALUES (1,1,'Midnight Echoes','Songs for those 3am feelings','default_playlist.png','public','2026-05-07 21:06:08'),(2,1,'Locked In Mode','Gym playlist that hits different','default_playlist.png','public','2026-05-07 21:06:08'),(3,2,'Late Night Drive','Windows down, music up','default_playlist.png','public','2026-05-07 21:06:08'),(4,2,'Coding Flow','Focus music for developers','default_playlist.png','public','2026-05-07 21:06:08'),(5,3,'Heartbreak Hotel','When you need to feel the pain','default_playlist.png','public','2026-05-07 21:06:08'),(6,3,'Party Starter','Get the vibes going','default_playlist.png','public','2026-05-07 21:06:08'),(7,4,'Soft Hours','Romantic vibes only','default_playlist.png','public','2026-05-07 21:06:08'),(8,4,'Study Lounge','Background music for studying','default_playlist.png','private','2026-05-07 21:06:08'),(9,5,'Rage Mode','Pure aggression and energy','default_playlist.png','public','2026-05-07 21:06:08'),(10,5,'Chill Vibes','Just relax and breathe','default_playlist.png','public','2026-05-07 21:06:08');
/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `song_mood`
--

DROP TABLE IF EXISTS `song_mood`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `song_mood` (
  `song_id` int NOT NULL,
  `mood_id` int NOT NULL,
  PRIMARY KEY (`song_id`,`mood_id`),
  KEY `mood_id` (`mood_id`),
  CONSTRAINT `song_mood_ibfk_1` FOREIGN KEY (`song_id`) REFERENCES `songs` (`song_id`) ON DELETE CASCADE,
  CONSTRAINT `song_mood_ibfk_2` FOREIGN KEY (`mood_id`) REFERENCES `moods` (`mood_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `song_mood`
--

LOCK TABLES `song_mood` WRITE;
/*!40000 ALTER TABLE `song_mood` DISABLE KEYS */;
INSERT INTO `song_mood` VALUES (2,1),(3,1),(4,1),(5,1),(10,1),(11,1),(21,1),(34,1),(35,1),(37,1),(38,1),(41,1),(51,1),(55,1),(60,1),(61,1),(7,2),(9,2),(13,2),(14,2),(15,2),(25,2),(26,2),(3,3),(4,3),(5,3),(6,3),(10,3),(12,3),(21,3),(45,3),(49,3),(57,3),(62,3),(6,4),(12,4),(19,4),(20,4),(39,4),(43,4),(45,4),(49,4),(52,4),(54,4),(57,4),(1,5),(7,5),(8,5),(31,5),(32,5),(33,5),(45,5),(62,5),(1,6),(3,6),(8,6),(10,6),(20,6),(31,6),(33,6),(42,6),(47,6),(56,6),(58,6),(2,7),(11,7),(19,7),(24,7),(30,7),(47,7),(58,7),(61,7),(1,8),(7,8),(9,8),(16,8),(17,8),(18,8),(22,8),(23,8),(36,8),(37,8),(38,8),(41,8),(42,8),(46,8),(51,8),(55,8),(58,8),(61,8),(9,9),(13,9),(14,9),(15,9),(25,9),(6,10),(12,10),(19,10),(20,10),(29,10),(37,10),(39,10),(40,10),(41,10),(42,10),(43,10),(44,10),(46,10),(48,10),(50,10),(52,10),(53,10),(54,10),(55,10),(56,10),(59,10),(60,10),(63,10),(4,11),(5,11),(10,11),(21,11),(27,11),(34,11),(35,11),(16,12),(17,12),(18,12),(22,12),(28,12),(29,12),(30,12),(36,12),(47,12),(56,12),(63,12);
/*!40000 ALTER TABLE `song_mood` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `songs`
--

DROP TABLE IF EXISTS `songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `songs` (
  `song_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `duration` int NOT NULL DEFAULT '180',
  `artist_id` int NOT NULL,
  `cover_image` varchar(255) DEFAULT 'default_cover.png',
  `audio_url` varchar(255) DEFAULT NULL,
  `play_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`song_id`),
  KEY `artist_id` (`artist_id`),
  KEY `idx_song_title` (`title`),
  KEY `idx_play_count` (`play_count`),
  CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`artist_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `songs`
--

LOCK TABLES `songs` WRITE;
/*!40000 ALTER TABLE `songs` DISABLE KEYS */;
INSERT INTO `songs` VALUES (1,'Blinding Lights',200,1,'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/17/b4/8f/17b48f9a-0b93-6bb8-fe1d-3a16623c2cfb/mzaf_9560252727299052414.plus.aac.p.m4a',15000,'2026-05-07 21:06:08'),(2,'Save Your Tears',215,1,'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8b/38/17/8b3817e4-c0e9-7e02-2654-3e2ecee93603/mzaf_18415642125637540903.plus.aac.p.m4a',12000,'2026-05-07 21:06:08'),(3,'After Hours',361,1,'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/54/2b/61/542b6133-80f7-f30f-4dcf-059490db9d84/mzaf_1539067797902127760.plus.aac.p.m4a',9500,'2026-05-07 21:06:08'),(4,'Lovely',200,2,'https://i.scdn.co/image/ab67616d0000b2738a3f0a3ca7929dea23cd274c','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1e/d8/8d/1ed88d91-fb06-b3f2-5391-afd732cc2ff9/mzaf_18444937225262929488.plus.aac.p.m4a',18000,'2026-05-07 21:06:08'),(5,'When The Party\'s Over',196,2,'https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2a/ba/44/2aba4410-ba71-89ce-e075-10120409c31c/mzaf_16887001963655152332.plus.aac.p.m4a',14000,'2026-05-07 21:06:08'),(6,'Ocean Eyes',200,2,'https://i.scdn.co/image/ab67616d0000b2732cafcdd985630d72594ecc49','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d6/59/2b/d6592b0b-1e7e-4743-b2e4-f2af038fd783/mzaf_7697277787797935735.plus.aac.p.m4a',11000,'2026-05-07 21:06:08'),(7,'SICKO MODE',312,3,'https://i.scdn.co/image/ab67616d0000b273daec894c14c0ca42d76eeb32','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/85/49/e2/8549e207-7ecf-21a9-7b2f-b414175c6a74/mzaf_10189975321658500285.plus.aac.p.m4a',20000,'2026-05-07 21:06:08'),(8,'goosebumps',243,3,'https://i.scdn.co/image/ab67616d0000b2738752a7355996e64709247c53','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/03/0a/ae/030aaeb0-a9fc-280e-c33c-e02d0b95264c/mzaf_13068295871760308152.plus.aac.p.m4a',16000,'2026-05-07 21:06:08'),(9,'FE!N',193,3,'https://i.scdn.co/image/ab67616d0000b27304481c826dd292e5e4983b3f','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/85/82/96/8582960b-2b19-b1eb-8179-b03be49f332b/mzaf_10214925442893249225.plus.aac.p.m4a',22000,'2026-05-07 21:06:08'),(10,'Summertime Sadness',265,4,'https://i.scdn.co/image/ab67616d0000b273ebc8cfac8b586bc475b04918','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/f5/a3/d0/f5a3d08a-635d-dc15-4c3f-ad8a04246d80/mzaf_17059298264221524369.plus.aac.p.m4a',13000,'2026-05-07 21:06:08'),(11,'Young and Beautiful',236,4,'https://i.scdn.co/image/ab67616d0000b273d7fb3e4c63020039d1cff6b2','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d7/0b/8a/d70b8adf-8a27-aafa-76a4-f59200be9ab0/mzaf_6008955516336655319.plus.aac.p.m4a',10000,'2026-05-07 21:06:08'),(12,'Video Games',281,4,'https://i.scdn.co/image/ab67616d0000b273ebc8cfac8b586bc475b04918','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/47/26/17/472617f8-9b82-7cc8-8b52-fee8e767174d/mzaf_11594634014908206633.plus.aac.p.m4a',8500,'2026-05-07 21:06:08'),(13,'Lose Yourself',326,5,'https://i.scdn.co/image/ab67616d0000b273b6ef2ebd34efb08cb76f6eec','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/62/0a/a5/620aa56f-189e-708a-80f0-cebdada3872e/mzaf_7131619873177773332.plus.aac.p.m4a',25000,'2026-05-07 21:06:08'),(14,'Till I Collapse',297,5,'https://i.scdn.co/image/ab67616d0000b2736ca5c90113b30c3c43ffb8f4','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b4/6c/d2/b46cd2fc-0439-2248-6964-179c076476b5/mzaf_8281165515046215092.plus.aac.p.m4a',21000,'2026-05-07 21:06:08'),(15,'Not Afraid',262,5,'https://i.scdn.co/image/ab67616d0000b273c08d5fa5c0f1a834acef5100','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4e/04/5c/4e045c50-d65a-b975-9d76-abbd05baa7f0/mzaf_12189073980444891219.plus.aac.p.m4a',17000,'2026-05-07 21:06:08'),(16,'Levitating',203,6,'https://i.scdn.co/image/ab67616d0000b273c88bae7846e62a8ba59ee0bd','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/59/dc/4d/59dc4dda-93ff-8f1c-c536-f005f6ea6af5/mzaf_3066686759813252385.plus.aac.p.m4a',19000,'2026-05-07 21:06:08'),(17,'Don\'t Start Now',183,6,'https://i.scdn.co/image/ab67616d0000b273c88bae7846e62a8ba59ee0bd','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/3d/34/243d3413-a0fc-b229-f54a-1715ebd3a9ca/mzaf_11578996572221800393.plus.aac.p.m4a',16500,'2026-05-07 21:06:08'),(18,'Dance The Night',176,6,'https://i.scdn.co/image/ab67616d0000b2733781a47fee690ad0b5c6c071','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9d/9f/56/9d9f566f-abf6-5f10-bcdb-09e14dcace42/mzaf_10277018989080903908.plus.aac.p.m4a',14500,'2026-05-07 21:06:08'),(19,'Sunflower',158,7,'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/f0/d6/98f0d67e-f8bf-762d-cac7-1c6b3b6b35dd/mzaf_4543283896248560946.plus.aac.p.m4a',23000,'2026-05-07 21:06:08'),(20,'Circles',215,7,'https://i.scdn.co/image/ab67616d0000b2739478c87599550dd73bfa7e02','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f9/b1/aa/f9b1aaed-3e24-227f-153d-99969f8b8464/mzaf_6272498007975402144.plus.aac.p.m4a',18500,'2026-05-07 21:06:08'),(21,'I Fall Apart',222,7,'https://i.scdn.co/image/ab67616d0000b27355404f712deb84d0650a4b41','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/42/ae/b9/42aeb93d-88db-62cb-7cb5-aa6dfc75a628/mzaf_16806444494818895874.plus.aac.p.m4a',12500,'2026-05-07 21:06:08'),(22,'thank u, next',207,8,'https://i.scdn.co/image/ab67616d0000b27356ac7b86e090f307e218e9c8','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/89/96/16/8996169e-2309-a298-f6f0-e7c52fe8e176/mzaf_590631660224715451.plus.aac.p.m4a',20000,'2026-05-07 21:06:08'),(23,'7 rings',178,8,'https://i.scdn.co/image/ab67616d0000b27356ac7b86e090f307e218e9c8','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d5/c8/f3/d5c8f31b-1c8f-93ed-e78b-8c0bce3e8b66/mzaf_14456154925680073521.plus.aac.p.m4a',17500,'2026-05-07 21:06:08'),(24,'positions',173,8,'https://i.scdn.co/image/ab67616d0000b27355b8f4c3458e256eca14f18f','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/cd/b2/46cdb240-11e4-4aed-31bd-6fb953752580/mzaf_15823372495978399916.plus.aac.p.m4a',13500,'2026-05-07 21:06:08'),(25,'HUMBLE.',177,9,'https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/30/3f/27/303f27c8-1997-8c57-66b3-b67e7c720779/mzaf_5598476068977070849.plus.aac.p.m4a',19500,'2026-05-07 21:06:08'),(26,'POWER',250,9,'https://i.scdn.co/image/ab67616d0000b273eddb2639b74ac6c202032ebe','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/4b/de/df/4bdedfcf-8133-8df9-336d-5aa400a66592/mzaf_14735938688869467893.plus.aac.p.m4a',15500,'2026-05-07 21:06:08'),(27,'Swimming Pools',314,9,'https://i.scdn.co/image/ab67616d0000b273b5ef185d28724c5573c2ac9c','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6c/8b/69/6c8b6925-647d-db57-2846-8cff9d02d565/mzaf_3261562986439060143.plus.aac.p.m4a',12000,'2026-05-07 21:06:08'),(28,'Anti-Hero',200,10,'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1d/56/2a/1d562a07-dc5f-a9c0-1f36-2051a8c14eb7/mzaf_7214829135431340590.plus.aac.p.m4a',22000,'2026-05-07 21:06:08'),(29,'Cruel Summer',178,10,'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/af/81/44af8168-9609-1b85-5048-ada08dceacf3/mzaf_1341699644335558812.plus.aac.p.m4a',19000,'2026-05-07 21:06:08'),(30,'Love Story',235,10,'https://i.scdn.co/image/ab67616d0000b273877ea8fa223c26f19aaef92d','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8b/4c/b3/8b4cb3a5-b1d1-c82c-e6ab-48cc3969d4ff/mzaf_858711921713575608.plus.aac.p.m4a',16000,'2026-05-07 21:06:08'),(31,'Starboy',230,1,'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3f/a0/ba/3fa0ba5b-088d-bcf2-e4bd-355a5d505617/mzaf_3355567893400963384.plus.aac.p.m4a',17000,'2026-05-07 21:06:08'),(32,'bad guy',194,2,'https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c3/87/1f/c3871f7e-3260-d615-1c66-5fdca2c3a48f/mzaf_10721331211699880949.plus.aac.p.m4a',21000,'2026-05-07 21:06:08'),(33,'HIGHEST IN THE ROOM',176,3,'https://i.scdn.co/image/ab67616d0000b273cc7bfe087a97a09f54c92b28','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/cf/b1/d9/cfb1d96a-86e4-07a5-e228-539246a1a241/mzaf_2820870448525548346.plus.aac.p.m4a',14000,'2026-05-07 21:06:08'),(34,'Born to Die',287,4,'https://i.scdn.co/image/ab67616d0000b273ebc8cfac8b586bc475b04918','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/ae/78/68ae78bf-62f3-1265-38f5-a907ecb46f7e/mzaf_8700054924527140553.plus.aac.p.m4a',9000,'2026-05-07 21:06:08'),(35,'Mockingbird',250,5,'https://i.scdn.co/image/ab67616d0000b2731bec21e57fff76db49e15a70','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/be/07/78/be077892-4a77-d929-85a9-76dbad9bc7c4/mzaf_9497500682559418910.plus.aac.p.m4a',16000,'2026-05-07 21:06:08'),(36,'New Rules',209,6,'https://i.scdn.co/image/ab67616d0000b2737833c9a792ad032d788d4011','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/07/2e/84/072e84d4-2970-034b-0941-60c112f36a2b/mzaf_5630674587159822008.plus.aac.p.m4a',15000,'2026-05-07 21:06:08'),(37,'Tum Hi Ho',262,11,'https://i.scdn.co/image/ab67616d0000b2736404721c1943d5069f0805f3','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/38/de/b9/38deb942-d44a-f2bb-205c-ddf05be84693/mzaf_9747647124859107103.plus.aac.p.m4a',28500,'2026-05-08 16:34:45'),(38,'Channa Mereya',289,11,'https://i.scdn.co/image/ab67616d0000b27358397d59e15b5149adf86033','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d5/f9/98/d5f998a7-0090-ee2d-03f8-557ad6c5bf65/mzaf_14251357991592637728.plus.aac.p.m4a',24300,'2026-05-08 16:34:45'),(39,'Kesariya',268,11,'https://i.scdn.co/image/ab67616d0000b273f9de0806dd65b1d5e15cefd1','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a',31200,'2026-05-08 16:34:45'),(40,'Apna Bana Le',274,11,'https://i.scdn.co/image/ab67616d0000b273c7b32b2ebd1ed948c9e7e5c5','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/b2/c2/ffb2c28b-2139-4ec4-f61e-271bc06bddad/mzaf_12403837045914372948.plus.aac.p.m4a',19800,'2026-05-08 16:34:45'),(41,'Phir Bhi Tumko Chahunga',315,11,'https://i.scdn.co/image/ab67616d0000b273aca529b2fdfaabf2f50fc9e3','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/71/c1/85/71c18529-2c27-f0d1-3b23-f5b5b70bc93f/mzaf_8603372778770751468.plus.aac.p.m4a',22100,'2026-05-08 16:34:45'),(42,'Agar Tum Saath Ho',342,11,'https://i.scdn.co/image/ab67616d0000b27325f7621c3c70dd1f868b61bc','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/b1/ef/60/b1ef60e4-edb1-9c6c-831c-63156a648460/mzaf_1954453039481622269.plus.aac.p.m4a',20500,'2026-05-08 16:34:45'),(43,'Gerua',308,12,'https://i.scdn.co/image/ab67616d0000b273bb40803742e3314f33af3f5f','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bf/6e/24/bf6e24d8-d4d5-1cac-adc6-4a0fc07e98da/mzaf_14186979808495752044.plus.aac.p.m4a',18700,'2026-05-08 16:34:45'),(44,'Raabta',258,12,'https://i.scdn.co/image/ab67616d0000b273e810a88d506b30bdc0935247','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0f/f5/da/0ff5dae3-df29-f5d9-0d88-c2d1be7056a4/mzaf_15534038032745935157.plus.aac.p.m4a',15300,'2026-05-08 16:34:45'),(45,'Jai Ho',330,13,'https://i.scdn.co/image/ab67616d0000b2732f4d7c01664823cb4297ce21','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/43/c6/39/43c63936-05a7-6c45-ebb0-bb170886dc53/mzaf_5453553336720503044.plus.aac.p.m4a',26800,'2026-05-08 16:34:45'),(46,'Tere Bina',318,13,'https://i.scdn.co/image/ab67616d0000b2730504fdf58bae8cd52dd13047','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/23/61/64/236164d3-f330-d526-6045-d975a4be4a64/mzaf_17030153012157637966.plus.aac.p.m4a',16900,'2026-05-08 16:34:45'),(47,'Kun Faya Kun',458,13,'https://i.scdn.co/image/ab67616d0000b27354e544672baa16145d67612b','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2e/99/e2/2e99e2ff-1d1b-615c-9d87-1cd3b122ad7f/mzaf_4773314624008046164.plus.aac.p.m4a',21400,'2026-05-08 16:34:45'),(48,'Roja Jaaneman',290,13,'https://i.scdn.co/image/ab67616d0000b27372e0aa417797b88ef05169a4','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/85/e3/ab/85e3ab8d-2998-9d9c-a28b-4e0ff1f744f7/mzaf_11760071985635714416.plus.aac.p.m4a',14200,'2026-05-08 16:34:45'),(49,'Ghoomar',280,14,'https://i.scdn.co/image/ab67616d0000b27360b0e7a743e592877961038a','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d9/c9/40/d9c94030-237c-1acf-4bff-a8ea8f9abaa8/mzaf_3319838461581527542.plus.aac.p.m4a',17600,'2026-05-08 16:34:45'),(50,'Deewani Mastani',326,14,'https://i.scdn.co/image/ab67616d0000b273d296ae49d6d7f22f5bb26cf4','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/88/7d/db/887ddb12-34da-8db7-a63e-06239214208a/mzaf_1960881532787811673.plus.aac.p.m4a',19200,'2026-05-08 16:34:45'),(51,'Sun Raha Hai Na Tu',305,14,'https://i.scdn.co/image/ab67616d0000b273301293be03d810fedac87242','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/df/6b/4c/df6b4cde-949f-7331-2519-340f4a63c831/mzaf_7140982401207414746.plus.aac.p.m4a',23100,'2026-05-08 16:34:45'),(52,'Dil Diyan Gallan',288,15,'https://i.scdn.co/image/ab67616d0000b273f7991610fad937fd9f29f55d','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/70/5a/67/705a67b0-a61f-db2c-bb6a-ab06c78a4386/mzaf_5706499000965104644.plus.aac.p.m4a',21700,'2026-05-08 16:34:45'),(53,'Pehli Dafa',262,15,'https://i.scdn.co/image/ab67616d0000b273afd2bc3f876235be94c0d36d','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/a0/94/f9/a094f99f-c175-d9dd-c475-040048553ea1/mzaf_16550135546441316062.plus.aac.p.m4a',14800,'2026-05-08 16:34:45'),(54,'Jeene Laga Hoon',245,15,'https://i.scdn.co/image/ab67616d0000b273cab73e6ac9bf4bf3c6931570','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6c/42/27/6c42274a-832c-9c1b-b955-5328aa0e91b6/mzaf_14885254077776408990.plus.aac.p.m4a',16300,'2026-05-08 16:34:45'),(55,'Lut Gaye',248,16,'https://i.scdn.co/image/ab67616d0000b2736fdbdd369b1dbf7a66595997','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/00/68/e6/0068e67b-cdb8-2d91-8b4b-95a44a014964/mzaf_9566492396252024088.plus.aac.p.m4a',27500,'2026-05-08 16:34:45'),(56,'Raataan Lambiyan',237,16,'https://i.scdn.co/image/ab67616d0000b27374aa42b31ece2c10fe5a4b93','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/0c/38/990c381b-0530-8c0d-87a9-18b050b97f0a/mzaf_10418866714500530894.plus.aac.p.m4a',25900,'2026-05-08 16:34:45'),(57,'Manike',209,16,'https://i.scdn.co/image/ab67616d0000b273377b9c9d7c0eb54633f1256a','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/25/19/a4/2519a44e-e9cf-48dc-9caf-a05b92fe28c7/mzaf_8884340860706509729.plus.aac.p.m4a',18400,'2026-05-08 16:34:45'),(58,'Pal',286,17,'https://i.scdn.co/image/ab67616d0000b273f99cb6f65e480ac900fe3100','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/10/12/9910123a-acad-39b2-75e9-f6a8f7e2534f/mzaf_12778523448332716611.plus.aac.p.m4a',19800,'2026-05-08 16:34:45'),(59,'Aankhon Mein Teri',295,17,'https://i.scdn.co/image/ab67616d0000b2738f9f2e1b7ac8cf49a256a6eb','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/7b/91/c7/7b91c71a-5bdb-72c2-72fc-6ce0a0597600/mzaf_15774025671457237551.plus.aac.p.m4a',17200,'2026-05-08 16:34:45'),(60,'Khuda Jaane',308,17,'https://i.scdn.co/image/ab67616d0000b273a08c7022ea424b2f048b46e9','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/07/3e/9b/073e9b86-f18f-f88a-8cf4-aa1173bbea4c/mzaf_1018658659811187633.plus.aac.p.m4a',15600,'2026-05-08 16:34:45'),(61,'Tera Zikr',222,18,'https://i.scdn.co/image/ab67616d0000b27337781c0e18852ccabd84a36c','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/82/a7/75/82a77557-9770-fd37-bc25-09f8dd8491f1/mzaf_285963533071971698.plus.aac.p.m4a',16100,'2026-05-08 16:34:45'),(62,'Kamariya',196,18,'https://i.scdn.co/image/ab67616d0000b273db65c78dd48dfb2acf1c5875','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/68/a2/52/68a25205-0edc-a326-42f2-2dc7c3ccdac0/mzaf_6457468538517338790.plus.aac.p.m4a',14500,'2026-05-08 16:34:45'),(63,'Hawa Banke',242,18,'https://i.scdn.co/image/ab67616d0000b27348e880ae0247973e88169c56','https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c1/ce/d7/c1ced781-9e62-8b50-35ce-5b2bc188d19b/mzaf_6203332614097293293.plus.aac.p.m4a',13200,'2026-05-08 16:34:45');
/*!40000 ALTER TABLE `songs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT 'default_avatar.png',
  `bio` text,
  `vibe_score` int DEFAULT '0',
  `listening_streak` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'vibemaster','vibe@demo.com','$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa','https://api.dicebear.com/7.x/avataaars/svg?seed=vibemaster','Music is my therapy ≡ƒÄ╡',420,15,'2026-05-07 21:06:08'),(2,'nightowl','night@demo.com','$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa','https://api.dicebear.com/7.x/avataaars/svg?seed=nightowl','Late night drives and lo-fi beats',380,12,'2026-05-07 21:06:08'),(3,'beatdrop','beat@demo.com','$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa','https://api.dicebear.com/7.x/avataaars/svg?seed=beatdrop','Bass boosted everything ≡ƒöè',350,8,'2026-05-07 21:06:08'),(4,'melodymuse','melody@demo.com','$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa','https://api.dicebear.com/7.x/avataaars/svg?seed=melodymuse','Finding beauty in every note',290,20,'2026-05-07 21:06:08'),(5,'rhythmking','rhythm@demo.com','$2a$10$8K1p/VEL5p5GhJhQzUJlKORzC7EIAspDO7Nh0nS7tGv4zDnUVKxXa','https://api.dicebear.com/7.x/avataaars/svg?seed=rhythmking','Hip-hop head since day one',410,10,'2026-05-07 21:06:08'),(6,'samj18','smokies@gmail.com','$2a$10$LOQ6EgV6.pbMMeq.12Gb9.rSxDZnl04U/9w0CyvXSgLCDJBCDAY86','https://ui-avatars.com/api/?name=samj18&background=f368e0&color=fff&size=200',NULL,10,10,'2026-05-07 21:20:21'),(7,'john','john123@gmail.com','$2a$10$9MflVZc/PfqiOKyi2Rp6a.J3KoH6qxYAK.5EFHcg1pF7GP7TMeQhi','https://ui-avatars.com/api/?name=john&background=feca57&color=fff&size=200',NULL,0,0,'2026-05-08 16:38:26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_mood_popularity`
--

DROP TABLE IF EXISTS `vw_mood_popularity`;
/*!50001 DROP VIEW IF EXISTS `vw_mood_popularity`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_mood_popularity` AS SELECT 
 1 AS `mood_id`,
 1 AS `mood_name`,
 1 AS `mood_color`,
 1 AS `mood_icon`,
 1 AS `song_count`,
 1 AS `total_plays`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_playlist_details`
--

DROP TABLE IF EXISTS `vw_playlist_details`;
/*!50001 DROP VIEW IF EXISTS `vw_playlist_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_playlist_details` AS SELECT 
 1 AS `playlist_id`,
 1 AS `name`,
 1 AS `description`,
 1 AS `cover_image`,
 1 AS `visibility`,
 1 AS `created_at`,
 1 AS `user_id`,
 1 AS `username`,
 1 AS `user_avatar`,
 1 AS `song_count`,
 1 AS `like_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_song_details`
--

DROP TABLE IF EXISTS `vw_song_details`;
/*!50001 DROP VIEW IF EXISTS `vw_song_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_song_details` AS SELECT 
 1 AS `song_id`,
 1 AS `title`,
 1 AS `duration`,
 1 AS `cover_image`,
 1 AS `audio_url`,
 1 AS `play_count`,
 1 AS `created_at`,
 1 AS `artist_id`,
 1 AS `artist_name`,
 1 AS `artist_avatar`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_trending_songs`
--

DROP TABLE IF EXISTS `vw_trending_songs`;
/*!50001 DROP VIEW IF EXISTS `vw_trending_songs`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_trending_songs` AS SELECT 
 1 AS `song_id`,
 1 AS `title`,
 1 AS `duration`,
 1 AS `cover_image`,
 1 AS `play_count`,
 1 AS `artist_name`,
 1 AS `mood_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_user_stats`
--

DROP TABLE IF EXISTS `vw_user_stats`;
/*!50001 DROP VIEW IF EXISTS `vw_user_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_user_stats` AS SELECT 
 1 AS `user_id`,
 1 AS `username`,
 1 AS `email`,
 1 AS `avatar`,
 1 AS `bio`,
 1 AS `vibe_score`,
 1 AS `listening_streak`,
 1 AS `created_at`,
 1 AS `playlist_count`,
 1 AS `following_count`,
 1 AS `follower_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'vibesync'
--

--
-- Final view structure for view `vw_mood_popularity`
--

/*!50001 DROP VIEW IF EXISTS `vw_mood_popularity`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_mood_popularity` AS select `m`.`mood_id` AS `mood_id`,`m`.`mood_name` AS `mood_name`,`m`.`mood_color` AS `mood_color`,`m`.`mood_icon` AS `mood_icon`,count(`sm`.`song_id`) AS `song_count`,coalesce(sum(`s`.`play_count`),0) AS `total_plays` from ((`moods` `m` left join `song_mood` `sm` on((`m`.`mood_id` = `sm`.`mood_id`))) left join `songs` `s` on((`sm`.`song_id` = `s`.`song_id`))) group by `m`.`mood_id` order by `total_plays` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_playlist_details`
--

/*!50001 DROP VIEW IF EXISTS `vw_playlist_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_playlist_details` AS select `p`.`playlist_id` AS `playlist_id`,`p`.`name` AS `name`,`p`.`description` AS `description`,`p`.`cover_image` AS `cover_image`,`p`.`visibility` AS `visibility`,`p`.`created_at` AS `created_at`,`u`.`user_id` AS `user_id`,`u`.`username` AS `username`,`u`.`avatar` AS `user_avatar`,count(distinct `ps`.`song_id`) AS `song_count`,count(distinct `l`.`like_id`) AS `like_count` from (((`playlists` `p` join `users` `u` on((`p`.`user_id` = `u`.`user_id`))) left join `playlist_songs` `ps` on((`p`.`playlist_id` = `ps`.`playlist_id`))) left join `likes` `l` on((`p`.`playlist_id` = `l`.`playlist_id`))) group by `p`.`playlist_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_song_details`
--

/*!50001 DROP VIEW IF EXISTS `vw_song_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_song_details` AS select `s`.`song_id` AS `song_id`,`s`.`title` AS `title`,`s`.`duration` AS `duration`,`s`.`cover_image` AS `cover_image`,`s`.`audio_url` AS `audio_url`,`s`.`play_count` AS `play_count`,`s`.`created_at` AS `created_at`,`a`.`artist_id` AS `artist_id`,`a`.`name` AS `artist_name`,`a`.`avatar` AS `artist_avatar` from (`songs` `s` join `artists` `a` on((`s`.`artist_id` = `a`.`artist_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_trending_songs`
--

/*!50001 DROP VIEW IF EXISTS `vw_trending_songs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_trending_songs` AS select `s`.`song_id` AS `song_id`,`s`.`title` AS `title`,`s`.`duration` AS `duration`,`s`.`cover_image` AS `cover_image`,`s`.`play_count` AS `play_count`,`a`.`name` AS `artist_name`,count(distinct `sm`.`mood_id`) AS `mood_count` from ((`songs` `s` join `artists` `a` on((`s`.`artist_id` = `a`.`artist_id`))) left join `song_mood` `sm` on((`s`.`song_id` = `sm`.`song_id`))) group by `s`.`song_id` order by `s`.`play_count` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_user_stats`
--

/*!50001 DROP VIEW IF EXISTS `vw_user_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_user_stats` AS select `u`.`user_id` AS `user_id`,`u`.`username` AS `username`,`u`.`email` AS `email`,`u`.`avatar` AS `avatar`,`u`.`bio` AS `bio`,`u`.`vibe_score` AS `vibe_score`,`u`.`listening_streak` AS `listening_streak`,`u`.`created_at` AS `created_at`,count(distinct `p`.`playlist_id`) AS `playlist_count`,count(distinct `f1`.`following_id`) AS `following_count`,count(distinct `f2`.`follower_id`) AS `follower_count` from (((`users` `u` left join `playlists` `p` on((`u`.`user_id` = `p`.`user_id`))) left join `followers` `f1` on((`u`.`user_id` = `f1`.`follower_id`))) left join `followers` `f2` on((`u`.`user_id` = `f2`.`following_id`))) group by `u`.`user_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-08 22:31:47
