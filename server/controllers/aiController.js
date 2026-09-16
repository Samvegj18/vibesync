/**
 * ============================================
 * AI CONTROLLER — Enhanced Smart Version
 * ============================================
 * Features:
 * - Advanced keyword + phrase scoring (weighted)
 * - Language detection (Hindi/Bollywood vs English)
 * - Artist preference detection
 * - Playlist scoring: mood match + popularity + diversity
 * - Context-aware song ranking
 * - Save generated playlist to DB
 * ============================================
 */

const db = require('../config/db');

// ============================================
// MOOD KEYWORDS MAP — Weighted keywords
// Each array: [keyword, weight]  (higher = stronger signal)
// ============================================
const moodKeywords = {
  heartbreak: [
    ['heartbreak',4],['breakup',4],['broke up',4],['ex',3],['crying',3],
    ['miss you',3],['hurt',2],['pain',2],['broken heart',4],['cheated',3],
    ['goodbye',2],['left me',3],['she left',3],['he left',3],['dumped',3],
    ['tears',2],['alone without',2],['can\'t stop crying',4],['moved on',2],
    ['used to love',2],['used to be',2],['memories',2],['never coming back',3]
  ],
  gym: [
    ['gym',4],['workout',4],['exercise',3],['lifting',3],['pump',3],
    ['gains',3],['fitness',3],['strong',2],['muscle',3],['training',3],
    ['running',3],['beast mode',4],['grind',3],['hustle',2],['push',2],
    ['no pain no gain',4],['cardio',3],['deadlift',4],['bench',3],['squat',3]
  ],
  lonely: [
    ['lonely',4],['alone',3],['nobody',3],['isolation',3],['empty',3],
    ['lost',2],['abandoned',3],['no friends',4],['solitude',3],['no one',3],
    ['missing people',3],['socially',2],['invisible',3],['excluded',3]
  ],
  study: [
    ['study',4],['exam',4],['homework',3],['focus',3],['reading',3],
    ['library',3],['concentration',4],['assignment',4],['college',3],
    ['revision',4],['test',3],['learn',2],['notes',3],['marks',3],['quiz',3]
  ],
  coding: [
    ['coding',4],['programming',4],['developer',3],['debug',4],['code',3],
    ['software',3],['hackathon',4],['terminal',3],['computer',3],['dev',3],
    ['github',3],['deploy',3],['javascript',4],['python',4],['react',3]
  ],
  'late night': [
    ['night',3],['midnight',4],['insomnia',4],['3am',5],['2am',5],['1am',4],
    ['late',2],['sleepless',4],['awake',2],['can\'t sleep',4],['dark',2],
    ['overthinking',4],['night shift',3],['moon',2],['stars',2]
  ],
  romantic: [
    ['love',3],['romance',3],['crush',4],['date',3],['kiss',3],['together',2],
    ['valentine',3],['relationship',3],['girlfriend',3],['boyfriend',3],
    ['proposal',4],['anniversary',4],['in love',4],['falling for',4],
    ['couple',3],['soulmate',4],['i love you',5],['feelings for',3]
  ],
  party: [
    ['party',4],['dance',3],['club',4],['celebration',3],['fun',2],['hype',3],
    ['lit',3],['weekend',3],['friday night',4],['saturday night',4],['drinks',3],
    ['festival',4],['banger',4],['turn up',4],['dj',3],['rave',4],['disco',3]
  ],
  rage: [
    ['angry',4],['rage',4],['furious',4],['mad',3],['frustrated',3],
    ['hate',3],['aggressive',4],['pissed',4],['war',3],['fight',3],
    ['revenge',4],['destroy',3],['intense',3],['dark energy',4]
  ],
  chill: [
    ['chill',4],['relax',4],['calm',3],['peace',3],['zen',4],['vibing',3],
    ['lazy',3],['cozy',3],['comfortable',2],['easy',2],['mellow',3],
    ['sunday',3],['afternoon',2],['sipping',3],['lofi',4],['slow',2]
  ],
  sad: [
    ['sad',4],['depressed',5],['down',3],['unhappy',3],['tears',3],
    ['grief',4],['sorrow',4],['melancholy',4],['blue',2],['gloomy',3],
    ['crying',3],['hopeless',4],['empty inside',5],['numb',4],['low',2],
    ['no motivation',4],['struggling',3],['not okay',4]
  ],
  happy: [
    ['happy',4],['joy',4],['excited',3],['great',2],['amazing',2],
    ['wonderful',2],['blessed',3],['fantastic',3],['cheerful',3],['smile',2],
    ['on top of the world',5],['best day',4],['celebrating',3],['good mood',4],
    ['feeling good',4],['positive',2],['sunshine',3],['flying',3]
  ]
};

// Mood → DB mood_name mapping
const moodToDBName = {
  heartbreak: 'Sad', gym: 'Energetic', lonely: 'Sad', study: 'Focus',
  coding: 'Focus', 'late night': 'Chill', romantic: 'Romantic',
  party: 'Party', rage: 'Energetic', chill: 'Chill', sad: 'Sad', happy: 'Happy'
};

// Secondary/fallback moods for better coverage
const moodFallbacks = {
  heartbreak: ['Sad', 'Chill'],
  gym: ['Energetic', 'Party'],
  lonely: ['Sad', 'Chill'],
  study: ['Focus', 'Chill'],
  coding: ['Focus', 'Chill'],
  'late night': ['Chill', 'Sad'],
  romantic: ['Romantic', 'Happy'],
  party: ['Party', 'Energetic', 'Happy'],
  rage: ['Energetic', 'Party'],
  chill: ['Chill', 'Happy'],
  sad: ['Sad', 'Chill'],
  happy: ['Happy', 'Energetic', 'Party']
};

// ============================================
// LANGUAGE DETECTION
// ============================================
const hindiKeywords = [
  'hindi', 'bollywood', 'indian', 'desi', 'punjabi', 'filmi', 'bhojpuri',
  'arijit', 'atif', 'shreya', 'sonu nigam', 'neha kakkar', 'jubin',
  'ar rahman', 'yo yo', 'honey singh', 'lata', 'kishore', 'rafi',
  'hindi songs', 'bollywood songs', 'desi songs', 'indian songs'
];
const englishKeywords = [
  'english', 'western', 'pop', 'rap', 'hip hop', 'edm', 'rock',
  'taylor', 'weeknd', 'drake', 'billie', 'ed sheeran', 'coldplay',
  'english songs', 'western songs', 'pop songs'
];

function detectLanguage(text) {
  const lower = text.toLowerCase();
  let hindiScore = hindiKeywords.filter(k => lower.includes(k)).length;
  let englishScore = englishKeywords.filter(k => lower.includes(k)).length;
  if (hindiScore > englishScore) return 'hindi';
  if (englishScore > hindiScore) return 'english';
  return 'both';
}

// ============================================
// SMART MOOD DETECTION — weighted scoring
// ============================================
function detectMood(text) {
  const lower = text.toLowerCase();
  let bestMood = 'chill';
  let bestScore = 0;

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    let score = 0;
    for (const [keyword, weight] of keywords) {
      if (lower.includes(keyword)) {
        score += weight;
        // Bonus for exact phrase match
        if (lower === keyword) score += 2;
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
// PLAYLIST FETCH — smart ranked query
// ============================================
async function fetchPlaylistSongs(detectedMood, language = 'both', limit = 12) {
  const primaryDBMood = moodToDBName[detectedMood] || 'Chill';
  const fallbackMoods = moodFallbacks[detectedMood] || [primaryDBMood];

  // Build language filter
  let langFilter = '';
  const hindiArtists = ['Arijit Singh', 'AR Rahman', 'Shreya Ghoshal', 'Atif Aslam',
    'Sonu Nigam', 'Jubin Nautiyal', 'Neha Kakkar', 'Yo Yo Honey Singh',
    'Kishore Kumar', 'Lata Mangeshkar'];
  const hindiNames = hindiArtists.map(n => `'${n}'`).join(',');

  if (language === 'hindi') {
    langFilter = `AND a.name IN (${hindiNames})`;
  } else if (language === 'english') {
    langFilter = `AND a.name NOT IN (${hindiNames})`;
  }

  // Try primary mood first
  const [primary] = await db.query(
    `SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count, s.youtube_id,
            a.name AS artist_name
     FROM songs s
     INNER JOIN song_mood sm ON s.song_id = sm.song_id
     INNER JOIN moods m ON sm.mood_id = m.mood_id
     INNER JOIN artists a ON s.artist_id = a.artist_id
     WHERE m.mood_name = ? ${langFilter}
     ORDER BY s.play_count DESC, RAND()
     LIMIT ?`,
    [primaryDBMood, limit]
  );

  if (primary.length >= limit) return primary;

  // Fill remaining from fallback moods
  const remaining = limit - primary.length;
  const primaryIds = primary.map(s => s.song_id);
  const placeholders = primaryIds.length > 0 ? `AND s.song_id NOT IN (${primaryIds.join(',')})` : '';
  const fallbackMoodList = fallbackMoods.map(m => `'${m}'`).join(',');

  const [fallback] = await db.query(
    `SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count, s.youtube_id,
            a.name AS artist_name
     FROM songs s
     INNER JOIN song_mood sm ON s.song_id = sm.song_id
     INNER JOIN moods m ON sm.mood_id = m.mood_id
     INNER JOIN artists a ON s.artist_id = a.artist_id
     WHERE m.mood_name IN (${fallbackMoodList}) ${langFilter} ${placeholders}
     ORDER BY s.play_count DESC, RAND()
     LIMIT ?`,
    [remaining]
  );

  // If still not enough, grab trending songs
  const combined = [...primary, ...fallback];
  if (combined.length < 6) {
    const existingIds = combined.map(s => s.song_id);
    const excl = existingIds.length > 0 ? `WHERE s.song_id NOT IN (${existingIds.join(',')}) ${langFilter ? 'AND ' + langFilter.replace('AND ', '') : ''}` : (langFilter ? `WHERE ${langFilter.replace('AND ', '')}` : '');
    const [trending] = await db.query(
      `SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count, s.youtube_id,
              a.name AS artist_name
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.artist_id
       ${excl}
       ORDER BY s.play_count DESC
       LIMIT ?`,
      [limit - combined.length]
    );
    return [...combined, ...trending];
  }

  return combined;
}

// ============================================
// MOOD QUOTES
// ============================================
const moodQuotes = {
  heartbreak: [
    "Some nights heal you slowly.",
    "Your heart knows how to mend itself — give it time.",
    "Every heartbreak is a melody waiting to be understood.",
    "The cracks in your heart let the music in.",
    "Healing isn't linear, but every song brings you closer."
  ],
  gym: [
    "Pain is temporary. Glory is forever.",
    "The iron never lies. You always get what you earn.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Beast mode isn't a switch — it's a lifestyle.",
    "Sweat now. Shine later."
  ],
  lonely: [
    "Solitude is where the soul goes to find itself.",
    "In the silence, you find your truest rhythm.",
    "Being alone doesn't mean being lost.",
    "Some of the best music was born in lonely rooms.",
    "The right song makes you feel less alone."
  ],
  study: [
    "Knowledge is the ultimate playlist — it never gets old.",
    "Focus is your superpower. Use it.",
    "The grind today becomes tomorrow's greatness.",
    "Let the music carry your concentration.",
    "One page at a time. One song at a time."
  ],
  coding: [
    "In code we trust. In music we find clarity.",
    "Debugging at 3am hits different with the right playlist.",
    "Every great program started with a great soundtrack.",
    "Syntax errors fade, but good code is forever.",
    "Ship it. The music will help."
  ],
  'late night': [
    "The night understands what the day refuses to hear.",
    "3am thoughts deserve 3am playlists.",
    "Some stories are only told after midnight.",
    "The moon has its own playlist. You're listening to it.",
    "At 3am, the music knows exactly what to say."
  ],
  romantic: [
    "Every love story has a soundtrack.",
    "You are the melody I can't get out of my head.",
    "Love is just music the heart writes.",
    "Some songs remind you of someone. This is that song.",
    "When words fail, the right song says everything."
  ],
  party: [
    "Life's a party — dress up and show up.",
    "Turn the music up until you forget everything else.",
    "The night is young and so are we.",
    "Good vibes only. Everything else can wait.",
    "Tonight we dance like nobody's watching."
  ],
  rage: [
    "Channel the chaos into power.",
    "Anger is energy. Use it wisely.",
    "Sometimes you need destruction to rebuild.",
    "Let the bass drop like your inhibitions.",
    "Controlled fury is your greatest weapon."
  ],
  chill: [
    "Your playlist understands your silence.",
    "Breathe in the melody, exhale the chaos.",
    "Peace is not found — it's created.",
    "Let the waves of sound carry you home.",
    "Sometimes doing nothing is everything."
  ],
  sad: [
    "It's okay to not be okay. The music understands.",
    "Rain has its own rhythm. So do tears.",
    "Some songs arrive exactly when your heart needs them.",
    "Sadness is just the echo of something beautiful you once felt.",
    "Feel it. Then heal it. Music helps with both."
  ],
  happy: [
    "Happiness sounds like your favorite song on repeat.",
    "Smile — the universe just queued your favorite track.",
    "Joy is a frequency. Tune in.",
    "Today's vibe: unstoppable.",
    "This energy? Protect it at all costs."
  ]
};

const playlistTemplates = {
  heartbreak: ['Midnight Tears', 'Echo of Us', 'Unread Messages', 'When Love Left', 'Unsent Letters'],
  gym: ['LOCKED IN MODE', 'Beast Unleashed', 'Iron Will', 'No Mercy', 'GRIND MODE'],
  lonely: ['Empty Room Sessions', 'Solo Frequency', 'Midnight Monologue', 'Quiet Storm'],
  study: ['Deep Focus Flow', 'Brain Fuel', 'The Study Zone', 'Concentration Station', 'Final Season'],
  coding: ['Debug Mode', 'Compile & Chill', 'Terminal Beats', 'Stack Overflow Vibes', 'Zero Bugs'],
  'late night': ['After Midnight', '3AM Sessions', 'Nocturnal Waves', 'Moonlight Drive', 'Insomnia Playlist'],
  romantic: ['Love Letters', 'Heartbeat Sync', 'Golden Hour', 'Us Against The World', 'Soft Feelings'],
  party: ['TURN UP CENTRAL', 'Club Bangers', 'Weekend Warriors', 'Lit AF', 'Main Character Energy'],
  rage: ['FURY MODE', 'Scorched Earth', 'Adrenaline Rush', 'War Drums', 'Dark Energy'],
  chill: ['Sunset Vibes', 'Cloud Nine', 'Easy Breeze', 'Zen Garden', 'Sunday Afternoon'],
  sad: ['Blue Hour', 'Rain on the Window', 'Hollow Echoes', 'Fading Light', 'Feeling All of It'],
  happy: ['Good Vibes Only', 'Sunshine State', 'Pure Joy', 'Dancing in Light', 'Main Character Day']
};

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================
// 1. MOOD ANALYZER
// ============================================
exports.analyzeMood = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Please describe how you feel' });

    const detectedMood = detectMood(text);
    const language = detectLanguage(text);

    const [moodInfo] = await db.query(
      'SELECT * FROM moods WHERE LOWER(mood_name) = ?',
      [moodToDBName[detectedMood]?.toLowerCase() || detectedMood]
    );

    const songs = await fetchPlaylistSongs(detectedMood, language, 5);
    const quote = randomItem(moodQuotes[detectedMood] || moodQuotes.chill);
    const playlistName = randomItem(playlistTemplates[detectedMood] || playlistTemplates.chill);

    res.json({
      success: true,
      analysis: {
        inputText: text,
        detectedMood,
        language,
        moodInfo: moodInfo[0] || { mood_name: detectedMood, mood_color: '#1dd1a1' },
        suggestedPlaylist: playlistName,
        suggestedSongs: songs,
        quote,
        vibeCategory: detectedMood.toUpperCase()
      }
    });
  } catch (error) {
    console.error('AnalyzeMood error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 2. PLAYLIST GENERATOR — Smart & Accurate
// ============================================
exports.generatePlaylist = async (req, res) => {
  try {
    const { mood, activity, vibe, language: langPref, count } = req.body;

    if (!mood) return res.status(400).json({ success: false, message: 'Mood is required' });

    const combinedText = `${mood} ${activity || ''} ${vibe || ''}`;
    const detectedMood = detectMood(combinedText);
    const language = langPref || detectLanguage(combinedText);
    const songCount = Math.min(parseInt(count) || 12, 20);

    const playlistTitle = randomItem(playlistTemplates[detectedMood] || playlistTemplates.chill);
    const songs = await fetchPlaylistSongs(detectedMood, language, songCount);

    const descriptions = {
      heartbreak: 'A collection of songs that understand your pain. Let it out.',
      gym: 'Fuel for the beast within. Go harder than yesterday.',
      lonely: 'Music for the moments when silence gets too loud.',
      study: 'Focus-enhancing tracks to power your brain session.',
      coding: 'The perfect soundtrack for your next coding session.',
      'late night': 'Songs that sound better after midnight. Just you and the music.',
      romantic: 'Tracks that make your heart skip a beat.',
      party: 'The ultimate party starter pack. Turn it up.',
      rage: 'Channel your fury into pure energy. Let it drive you.',
      chill: 'Lay back and let the vibes wash over you.',
      sad: "It's okay to feel. These songs understand.",
      happy: 'Pure joy in audio form. Smile and play.'
    };

    const langLabel = language === 'hindi' ? 'Bollywood' : language === 'english' ? 'English' : 'Mixed';

    res.json({
      success: true,
      generatedPlaylist: {
        title: playlistTitle,
        description: descriptions[detectedMood] || 'A vibe-curated playlist just for you.',
        mood: detectedMood,
        language: langLabel,
        songs,
        totalDuration: songs.reduce((acc, s) => acc + (s.duration || 0), 0),
        songCount: songs.length
      }
    });
  } catch (error) {
    console.error('GeneratePlaylist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 3. VIBEBOT CHATBOT — Enhanced
// ============================================
exports.vibeBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const detectedMood = detectMood(message);
    const language = detectLanguage(message);
    const songs = await fetchPlaylistSongs(detectedMood, language, 4);
    const quote = randomItem(moodQuotes[detectedMood] || moodQuotes.chill);

    const langNote = language === 'hindi' ? ' (Bollywood picks)' : language === 'english' ? ' (English picks)' : '';
    const songList = songs.map(s => `🎵 ${s.title} — ${s.artist_name}`).join('\n');

    const botResponses = [
      `I can feel your **${detectedMood}** vibes${langNote}! Here's what I'd recommend:\n\n${songList}\n\n✨ "${quote}"`,
      `Picking up **${detectedMood}** energy from you${langNote}! Try these:\n\n${songList}\n\n💫 "${quote}"`,
      `Your vibe says "**${detectedMood}**"${langNote} — here's your perfect lineup:\n\n${songList}\n\n🎧 "${quote}"`
    ];

    res.json({ success: true, reply: randomItem(botResponses), detectedMood, language, songs });
  } catch (error) {
    console.error('VibeBot error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 4. QUOTE GENERATOR
// ============================================
exports.getQuote = async (req, res) => {
  try {
    const { mood } = req.query;
    if (mood && moodQuotes[mood.toLowerCase()]) {
      return res.json({ success: true, quote: randomItem(moodQuotes[mood.toLowerCase()]), mood: mood.toLowerCase() });
    }
    const allMoods = Object.keys(moodQuotes);
    const randomMood = randomItem(allMoods);
    res.json({ success: true, quote: randomItem(moodQuotes[randomMood]), mood: randomMood });
  } catch (error) {
    console.error('GetQuote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
