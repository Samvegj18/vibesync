-- VibeSync TiDB Import Script
-- Clean version compatible with TiDB Serverless

USE vibesync;

-- TABLE: users
CREATE TABLE IF NOT EXISTS users (
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50) NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar        VARCHAR(255) DEFAULT 'default_avatar.png',
    bio           TEXT DEFAULT NULL,
    vibe_score    INT DEFAULT 0,
    listening_streak INT DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- TABLE: artists
CREATE TABLE IF NOT EXISTS artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    bio       TEXT,
    avatar    VARCHAR(255) DEFAULT 'default_artist.png',
    INDEX idx_artist_name (name)
);

-- TABLE: songs
CREATE TABLE IF NOT EXISTS songs (
    song_id     INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    duration    INT NOT NULL DEFAULT 180,
    artist_id   INT NOT NULL,
    cover_image VARCHAR(255) DEFAULT 'default_cover.png',
    audio_url   VARCHAR(255) DEFAULT NULL,
    play_count  INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
    INDEX idx_song_title (title),
    INDEX idx_play_count (play_count)
);

-- TABLE: moods
CREATE TABLE IF NOT EXISTS moods (
    mood_id    INT AUTO_INCREMENT PRIMARY KEY,
    mood_name  VARCHAR(50) NOT NULL UNIQUE,
    mood_color VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    mood_icon  VARCHAR(50) DEFAULT 'music',
    INDEX idx_mood_name (mood_name)
);

-- TABLE: song_mood
CREATE TABLE IF NOT EXISTS song_mood (
    song_id INT NOT NULL,
    mood_id INT NOT NULL,
    PRIMARY KEY (song_id, mood_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
    FOREIGN KEY (mood_id) REFERENCES moods(mood_id) ON DELETE CASCADE
);

-- TABLE: playlists
CREATE TABLE IF NOT EXISTS playlists (
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255) DEFAULT 'default_playlist.png',
    visibility  ENUM('public', 'private') DEFAULT 'public',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_playlist_user (user_id),
    INDEX idx_playlist_visibility (visibility)
);

-- TABLE: playlist_songs
CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id INT NOT NULL,
    song_id     INT NOT NULL,
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
);

-- TABLE: likes
CREATE TABLE IF NOT EXISTS likes (
    like_id     INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    playlist_id INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (user_id, playlist_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE
);

-- TABLE: comments
CREATE TABLE IF NOT EXISTS comments (
    comment_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    playlist_id  INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    INDEX idx_comment_playlist (playlist_id)
);

-- TABLE: followers
CREATE TABLE IF NOT EXISTS followers (
    follower_id  INT NOT NULL,
    following_id INT NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CHECK (follower_id != following_id)
);

-- TABLE: listening_history
CREATE TABLE IF NOT EXISTS listening_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    song_id    INT NOT NULL,
    played_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
    INDEX idx_history_user (user_id),
    INDEX idx_history_played (played_at)
);
