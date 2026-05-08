/**
 * ============================================
 * AI CONTROLLER
 * ============================================
 * Handles AI-powered features:
 * - Mood Analyzer (keyword-based)
 * - Playlist Generator
 * - VibeBot Chatbot
 * - Quote Generator
 * 
 * IMPORTANT: Uses simple keyword matching.
 * No ML models needed! Easy to explain in viva.
 * Optional: Gemini API integration if key is set.
 * ============================================
 */

const db = require('../config/db');

// ============================================
// MOOD KEYWORDS MAP
// Maps keywords to mood categories
// ============================================
const moodKeywords = {
  heartbreak: ['heartbreak', 'breakup', 'ex', 'crying', 'miss', 'hurt', 'pain', 'broken', 'cheated', 'goodbye', 'left me'],
  gym: ['gym', 'workout', 'exercise', 'lift', 'pump', 'gains', 'fit', 'strong', 'muscle', 'training', 'running'],
  lonely: ['lonely', 'alone', 'nobody', 'isolation', 'empty', 'lost', 'abandoned', 'no friends', 'solitude'],
  study: ['study', 'exam', 'homework', 'focus', 'reading', 'library', 'concentration', 'assignment', 'college'],
  coding: ['coding', 'programming', 'developer', 'debug', 'code', 'software', 'hackathon', 'terminal', 'computer'],
  'late night': ['night', 'midnight', 'insomnia', '3am', '2am', 'late', 'sleepless', 'awake', 'can\'t sleep', 'dark'],
  romantic: ['love', 'romance', 'crush', 'date', 'kiss', 'together', 'babe', 'sweetheart', 'couple', 'valentine'],
  party: ['party', 'dance', 'club', 'celebration', 'fun', 'turn up', 'lit', 'weekend', 'friday', 'drinks'],
  rage: ['angry', 'rage', 'furious', 'mad', 'frustrated', 'hate', 'aggressive', 'pissed', 'war', 'fight'],
  chill: ['chill', 'relax', 'calm', 'peace', 'zen', 'vibing', 'lazy', 'cozy', 'comfortable', 'easy'],
  sad: ['sad', 'depressed', 'down', 'unhappy', 'tears', 'grief', 'sorrow', 'melancholy', 'blue', 'gloomy'],
  happy: ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'blessed', 'fantastic', 'cheerful', 'smile']
};

// ============================================
// MOOD QUOTES - Aesthetic quotes per mood
// ============================================
const moodQuotes = {
  heartbreak: [
    "Some nights heal you slowly.",
    "Your heart knows how to mend itself — give it time.",
    "Every heartbreak is a melody waiting to be understood.",
    "The cracks in your heart let the music in."
  ],
  gym: [
    "Pain is temporary. Glory is forever.",
    "The iron never lies. You always get what you earn.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Beast mode isn't a switch — it's a lifestyle."
  ],
  lonely: [
    "Solitude is where the soul goes to find itself.",
    "In the silence, you find your truest rhythm.",
    "Being alone doesn't mean being lost.",
    "Some of the best music was born in lonely rooms."
  ],
  study: [
    "Knowledge is the ultimate playlist — it never gets old.",
    "Focus is your superpower. Use it.",
    "The grind today becomes tomorrow's greatness.",
    "Let the music carry your concentration."
  ],
  coding: [
    "In code we trust. In music we find clarity.",
    "Debugging at 3am hits different with the right playlist.",
    "Every great program started with a great soundtrack.",
    "Syntax errors fade, but good code is forever."
  ],
  'late night': [
    "The night understands what the day refuses to hear.",
    "3am thoughts deserve 3am playlists.",
    "Some stories are only told after midnight.",
    "The moon has its own playlist. You're listening to it."
  ],
  romantic: [
    "Every love story has a soundtrack.",
    "You are the melody I can't get out of my head.",
    "Love is just music the heart writes.",
    "Some songs remind you of someone. This is that song."
  ],
  party: [
    "Life's a party — dress up and show up.",
    "Turn the music up until you forget everything else.",
    "The night is young and so are we.",
    "Good vibes only. Everything else can wait."
  ],
  rage: [
    "Channel the chaos into power.",
    "Anger is energy. Use it wisely.",
    "Sometimes you need destruction to rebuild.",
    "Let the bass drop like your inhibitions."
  ],
  chill: [
    "Your playlist understands your silence.",
    "Breathe in the melody, exhale the chaos.",
    "Peace is not found — it's created.",
    "Let the waves of sound carry you home."
  ],
  sad: [
    "It's okay to not be okay. The music understands.",
    "Rain has its own rhythm. So do tears.",
    "Some songs arrive exactly when your heart needs them.",
    "Sadness is just the echo of something beautiful you once felt."
  ],
  happy: [
    "Happiness sounds like your favorite song on repeat.",
    "Smile — the universe just queued your favorite track.",
    "Joy is a frequency. Tune in.",
    "Today's vibe: unstoppable."
  ]
};

// ============================================
// PLAYLIST NAME TEMPLATES
// ============================================
const playlistTemplates = {
  heartbreak: ['Midnight Tears', 'Echo of Us', 'Unread Messages', 'When Love Left'],
  gym: ['LOCKED IN MODE', 'Beast Unleashed', 'Iron Will', 'No Mercy'],
  lonely: ['Empty Room Sessions', 'Solo Frequency', 'Midnight Monologue', 'Quiet Storm'],
  study: ['Deep Focus Flow', 'Brain Fuel', 'The Study Zone', 'Concentration Station'],
  coding: ['Debug Mode', 'Compile & Chill', 'Terminal Beats', 'Stack Overflow Vibes'],
  'late night': ['After Midnight', '3AM Sessions', 'Nocturnal Waves', 'Moonlight Drive'],
  romantic: ['Love Letters', 'Heartbeat Sync', 'Golden Hour', 'Us Against The World'],
  party: ['TURN UP CENTRAL', 'Club Bangers', 'Weekend Warriors', 'Lit AF'],
  rage: ['FURY MODE', 'Scorched Earth', 'Adrenaline Rush', 'War Drums'],
  chill: ['Sunset Vibes', 'Cloud Nine', 'Easy Breeze', 'Zen Garden'],
  sad: ['Blue Hour', 'Rain on the Window', 'Hollow Echoes', 'Fading Light'],
  happy: ['Good Vibes Only', 'Sunshine State', 'Pure Joy', 'Dancing in Light']
};

// ============================================
// Helper: Detect mood from text using keywords
// ============================================
function detectMood(text) {
  const lowerText = text.toLowerCase();
  let bestMood = 'chill';
  let bestScore = 0;

  // Count keyword matches for each mood
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMood = mood;
    }
  }

  return bestMood;
}

// ============================================
// Helper: Get random item from array
// ============================================
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================
// 1. MOOD ANALYZER
// User types how they feel → returns mood + suggestions
// ============================================
exports.analyzeMood = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Please describe how you feel' });
    }

    // Detect mood using keyword matching
    const detectedMood = detectMood(text);

    // Get mood info from database
    const [moodInfo] = await db.query(
      'SELECT * FROM moods WHERE mood_name = ?',
      [detectedMood.charAt(0).toUpperCase() + detectedMood.slice(1)]
    );

    // Get suggested songs for this mood from DB
    const [songs] = await db.query(
      `SELECT s.song_id, s.title, s.cover_image, a.name AS artist_name
       FROM songs s
       INNER JOIN song_mood sm ON s.song_id = sm.song_id
       INNER JOIN moods m ON sm.mood_id = m.mood_id
       INNER JOIN artists a ON s.artist_id = a.artist_id
       WHERE LOWER(m.mood_name) = ?
       ORDER BY RAND()
       LIMIT 5`,
      [detectedMood]
    );

    // Get a quote for this mood
    const quotes = moodQuotes[detectedMood] || moodQuotes.chill;
    const quote = randomItem(quotes);

    // Get a playlist name suggestion
    const names = playlistTemplates[detectedMood] || playlistTemplates.chill;
    const playlistName = randomItem(names);

    res.json({
      success: true,
      analysis: {
        inputText: text,
        detectedMood: detectedMood,
        moodInfo: moodInfo[0] || { mood_name: detectedMood, mood_color: '#1dd1a1' },
        suggestedPlaylist: playlistName,
        suggestedSongs: songs,
        quote: quote,
        vibeCategory: detectedMood.toUpperCase()
      }
    });
  } catch (error) {
    console.error('AnalyzeMood error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 2. PLAYLIST GENERATOR
// User enters mood + activity → generates playlist
// ============================================
exports.generatePlaylist = async (req, res) => {
  try {
    const { mood, activity, vibe } = req.body;

    if (!mood) {
      return res.status(400).json({ success: false, message: 'Mood is required' });
    }

    // Combine inputs to detect the best mood match
    const combinedText = `${mood} ${activity || ''} ${vibe || ''}`;
    const detectedMood = detectMood(combinedText);

    // Get playlist name
    const names = playlistTemplates[detectedMood] || playlistTemplates.chill;
    const playlistTitle = randomItem(names);

    // Get songs for this mood from DB
    const [songs] = await db.query(
      `SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count,
              a.name AS artist_name
       FROM songs s
       INNER JOIN song_mood sm ON s.song_id = sm.song_id
       INNER JOIN moods m ON sm.mood_id = m.mood_id
       INNER JOIN artists a ON s.artist_id = a.artist_id
       WHERE LOWER(m.mood_name) = ?
       ORDER BY RAND()
       LIMIT 8`,
      [detectedMood]
    );

    // Generate description
    const descriptions = {
      heartbreak: 'A collection of songs that understand your pain.',
      gym: 'Fuel for the beast within. Go harder.',
      lonely: 'Music for the moments when silence gets too loud.',
      study: 'Focus-enhancing tracks to power your brain.',
      coding: 'The perfect soundtrack for your next coding session.',
      'late night': 'Songs that sound better after midnight.',
      romantic: 'Tracks that make your heart skip a beat.',
      party: 'The ultimate party starter pack.',
      rage: 'Channel your fury into pure energy.',
      chill: 'Lay back and let the vibes wash over you.',
      sad: 'It\'s okay to feel. These songs understand.',
      happy: 'Pure joy in audio form. Smile and play.'
    };

    res.json({
      success: true,
      generatedPlaylist: {
        title: playlistTitle,
        description: descriptions[detectedMood] || 'A vibe-curated playlist just for you.',
        mood: detectedMood,
        songs: songs,
        totalDuration: songs.reduce((acc, s) => acc + s.duration, 0),
        songCount: songs.length
      }
    });
  } catch (error) {
    console.error('GeneratePlaylist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 3. VIBEBOT CHATBOT
// Users ask for recommendations, bot replies
// ============================================
exports.vibeBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Detect mood from user message
    const detectedMood = detectMood(message);

    // Get songs matching the mood
    const [songs] = await db.query(
      `SELECT s.title, a.name AS artist_name
       FROM songs s
       INNER JOIN song_mood sm ON s.song_id = sm.song_id
       INNER JOIN moods m ON sm.mood_id = m.mood_id
       INNER JOIN artists a ON s.artist_id = a.artist_id
       WHERE LOWER(m.mood_name) = ?
       ORDER BY RAND()
       LIMIT 4`,
      [detectedMood]
    );

    // Generate bot response
    const quote = randomItem(moodQuotes[detectedMood] || moodQuotes.chill);
    const songList = songs.map(s => `🎵 ${s.title} — ${s.artist_name}`).join('\n');

    const botResponses = [
      `I can feel your ${detectedMood} vibes! Here's what I'd recommend:\n\n${songList}\n\n✨ "${quote}"`,
      `Picking up ${detectedMood} energy from you! Try these:\n\n${songList}\n\n💫 "${quote}"`,
      `Your vibe says "${detectedMood}" — here's your perfect lineup:\n\n${songList}\n\n🎧 "${quote}"`
    ];

    res.json({
      success: true,
      reply: randomItem(botResponses),
      detectedMood,
      songs
    });
  } catch (error) {
    console.error('VibeBot error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 4. QUOTE GENERATOR
// Returns a random mood-based aesthetic quote
// ============================================
exports.getQuote = async (req, res) => {
  try {
    const { mood } = req.query;

    // If mood specified, get quote for that mood
    if (mood && moodQuotes[mood.toLowerCase()]) {
      return res.json({
        success: true,
        quote: randomItem(moodQuotes[mood.toLowerCase()]),
        mood: mood.toLowerCase()
      });
    }

    // Otherwise return a random quote from any mood
    const allMoods = Object.keys(moodQuotes);
    const randomMood = randomItem(allMoods);

    res.json({
      success: true,
      quote: randomItem(moodQuotes[randomMood]),
      mood: randomMood
    });
  } catch (error) {
    console.error('GetQuote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
