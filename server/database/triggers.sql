-- =============================================
-- VIBESYNC - SQL Triggers
-- =============================================
-- Triggers = Auto-run code when data changes
-- They enforce business rules automatically
-- =============================================

USE vibesync;

-- TRIGGER 1: Increment play_count when a song is played
-- Fires AFTER a new row is inserted into listening_history
DELIMITER //
CREATE TRIGGER trg_increment_play_count
AFTER INSERT ON listening_history
FOR EACH ROW
BEGIN
    UPDATE songs 
    SET play_count = play_count + 1 
    WHERE song_id = NEW.song_id;
END //
DELIMITER ;

-- TRIGGER 2: Update vibe_score when user creates a playlist
-- Users earn 10 points for creating a playlist
DELIMITER //
CREATE TRIGGER trg_playlist_vibe_score
AFTER INSERT ON playlists
FOR EACH ROW
BEGIN
    UPDATE users 
    SET vibe_score = vibe_score + 10 
    WHERE user_id = NEW.user_id;
END //
DELIMITER ;

-- TRIGGER 3: Update vibe_score when user gets a like
-- Playlist creator earns 5 points per like
DELIMITER //
CREATE TRIGGER trg_like_vibe_score
AFTER INSERT ON likes
FOR EACH ROW
BEGIN
    UPDATE users 
    SET vibe_score = vibe_score + 5 
    WHERE user_id = (
        SELECT user_id FROM playlists 
        WHERE playlist_id = NEW.playlist_id
    );
END //
DELIMITER ;

-- TRIGGER 4: Decrease vibe_score when a like is removed
DELIMITER //
CREATE TRIGGER trg_unlike_vibe_score
AFTER DELETE ON likes
FOR EACH ROW
BEGIN
    UPDATE users 
    SET vibe_score = GREATEST(vibe_score - 5, 0)
    WHERE user_id = (
        SELECT user_id FROM playlists 
        WHERE playlist_id = OLD.playlist_id
    );
END //
DELIMITER ;
