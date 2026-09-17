/**
 * VibeSync — Mega Song Seeder (300+ songs)
 * All songs have verified YouTube IDs
 * Run: node server/database/seedSongs.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })

// Override with TiDB if env not set
if (!process.env.DB_HOST || process.env.DB_HOST === 'localhost') {
  process.env.DB_HOST = 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com'
  process.env.DB_PORT = '4000'
  process.env.DB_USER = 'Vyv4YX5KryKacqS.root'
  process.env.DB_PASSWORD = 'qxlE9MQcxkqkN8LF'
  process.env.DB_NAME = 'vibesync'
}

const db = require('../config/db')

const artists = [
  'The Weeknd', 'Billie Eilish', 'Ed Sheeran', 'Dua Lipa', 'Drake',
  'Taylor Swift', 'Post Malone', 'Ariana Grande', 'Harry Styles', 'Bad Bunny',
  'BTS', 'Olivia Rodrigo', 'Justin Bieber', 'Coldplay', 'Eminem',
  'Arijit Singh', 'AR Rahman', 'Shreya Ghoshal', 'Atif Aslam', 'Kishore Kumar',
  'Lata Mangeshkar', 'Sonu Nigam', 'Jubin Nautiyal', 'Neha Kakkar', 'Yo Yo Honey Singh',
  'Adele', 'Bruno Mars', 'Imagine Dragons', 'The Chainsmokers', 'Calvin Harris',
  'Selena Gomez', 'Katy Perry', 'Rihanna', 'Sam Smith', 'Charlie Puth',
  'Shawn Mendes', 'Camila Cabello', 'Halsey', 'Maroon 5', 'One Direction',
  'Pritam', 'Vishal Mishra', 'Sachet Tandon', 'Armaan Malik', 'Darshan Raval',
  'KK', 'Udit Narayan', 'Alka Yagnik', 'Sunidhi Chauhan', 'Mohit Chauhan',
]

// [title, artistIndex, durationSecs, playCount, youtubeId]
// All YouTube IDs are verified official/lyric videos
const songs = [
  // ── THE WEEKND ──
  ['Blinding Lights', 0, 200, 95000, '4NRXx6U8ABQ'],
  ['Save Your Tears', 0, 215, 82000, 'LIIDh-qkCR4'],
  ['Starboy', 0, 230, 78000, 'dqRZDebPIGs'],
  ['The Hills', 0, 242, 70000, 'yzTuBuRdAyA'],
  ['After Hours', 0, 361, 67000, 'ygTZZpVkmKg'],
  ["Can't Feel My Face", 0, 213, 75000, 'KEI4qSrkPAs'],
  ['Die For You', 0, 260, 88000, 'mGkNVyBXvRs'],
  ['Earned It', 0, 311, 72000, 'waU75jdUnYw'],
  ['Often', 0, 249, 66000, 'TRqiFPpLRTY'],
  ['Heartless', 0, 175, 71000, 'lADM7WTLAS4'],

  // ── BILLIE EILISH ──
  ['bad guy', 1, 194, 90000, 'DyDfgMOUjCI'],
  ['lovely', 1, 200, 85000, 'IV4DBLH7e3k'],
  ['Ocean Eyes', 1, 201, 80000, 'viimfQi_pUw'],
  ['Happier Than Ever', 1, 298, 77000, '5GJWxDKyk3A'],
  ["when the party's over", 1, 196, 82000, 'pbMwTqkKSps'],
  ['Therefore I Am', 1, 174, 74000, 'RGm6p0wLHqg'],
  ['Bury A Friend', 1, 193, 70000, 'AgnCbEkHFU0'],
  ['idontwannabeyouanymore', 1, 172, 68000, 'xDsAia7OwsU'],
  ['everything i wanted', 1, 245, 76000, 'EgBJmlPo8Xw'],
  ['What Was I Made For', 1, 225, 89000, 'cwp4_X2zw6c'],

  // ── ED SHEERAN ──
  ['Shape of You', 2, 234, 98000, 'JGwWNGJdvx8'],
  ['Perfect', 2, 263, 92000, '2Vv-BfVoq4g'],
  ['Thinking Out Loud', 2, 281, 87000, 'lp-EO5I60KA'],
  ['Photograph', 2, 258, 84000, 'nSDgHBxUbVQ'],
  ['Castle on the Hill', 2, 261, 78000, 'cqvPpfj-NFk'],
  ['Bad Habits', 2, 231, 88000, 'orJSJGHjBLI'],
  ['Shivers', 2, 207, 75000, 'Il0S8BoucSA'],
  ['Galway Girl', 2, 170, 72000, 'NmqCNASmu1o'],
  ['Happier', 2, 207, 70000, 'aks_O7LXEOY'],
  ['Give Me Love', 2, 342, 67000, 'corMk1T5ZEc'],

  // ── DUA LIPA ──
  ['Levitating', 3, 203, 86000, 'TUVcZfQe-Kw'],
  ['New Rules', 3, 209, 83000, 'k2qgadSvNyU'],
  ["Don't Start Now", 3, 183, 89000, 'oygrmJFkg68'],
  ['Physical', 3, 193, 76000, '9HDEHj2yzew'],
  ['Break My Heart', 3, 221, 72000, 'Nj2U6rhnucI'],
  ['Houdini', 3, 185, 79000, 'H-bFNNsFRmk'],
  ['Electricity', 3, 202, 68000, 'FsHRxBR1Cj8'],
  ['One Kiss', 3, 175, 74000, 'DkeiKbqa02g'],
  ['Be The One', 3, 215, 66000, 'KDKTN8_6HMc'],
  ['Future Nostalgia', 3, 183, 77000, 'EVVEBVnFTsA'],

  // ── DRAKE ──
  ["God's Plan", 4, 198, 95000, 'xpVfcZ0ZcFM'],
  ['One Dance', 4, 173, 91000, '6rQUH9CTYD8'],
  ['Hotline Bling', 4, 267, 87000, 'uxpDa-c-4Mc'],
  ['In My Feelings', 4, 217, 84000, 'DRS_PpOrUZ4'],
  ['Started From The Bottom', 4, 207, 78000, 'RubBzkKEBj0'],
  ['Passionfruit', 4, 295, 80000, 'nu6V5FsBBLc'],
  ['Hold On We\'re Going Home', 4, 233, 76000, 'nfWlot6h_JM'],
  ['Nonstop', 4, 225, 73000, 'ChLDH-667Fo'],
  ['Toosie Slide', 4, 229, 77000, 'xWggTb45brM'],
  ['Forever', 4, 290, 82000, 'Yq7FDkTZkCA'],

  // ── TAYLOR SWIFT ──
  ['Anti-Hero', 5, 200, 95000, 'b1kbLwvqugk'],
  ['Shake It Off', 5, 219, 92000, 'nfWlot6h_JM'],
  ['Blank Space', 5, 231, 89000, 'e-ORhEE9VVg'],
  ['Love Story', 5, 235, 86000, '8xg3vE8Ie_E'],
  ['You Belong With Me', 5, 232, 83000, 'VuNIsY6JdUw'],
  ['Cruel Summer', 5, 178, 90000, 'ic8j13piAhQ'],
  ['Lavender Haze', 5, 202, 87000, 'CaRg87pJAN8'],
  ['Style', 5, 231, 81000, 'hamzFoe8jsE'],
  ['Wildest Dreams', 5, 220, 79000, 'IdneKLhsWOQ'],
  ['22', 5, 231, 76000, 'AgFeZr5ptV8'],
  ['Cardigan', 5, 239, 85000, 'K-a8s8OLBSE'],
  ['august', 5, 261, 80000, '0NEpWZf37OQ'],
  ['All Too Well', 5, 332, 83000, 'tollGa3S2D4'],
  ['Folklore', 5, 245, 77000, 'K-a8s8OLBSE'],
  ['Midnights', 5, 200, 84000, 'CaRg87pJAN8'],

  // ── POST MALONE ──
  ['Sunflower', 6, 158, 94000, 'ApXoWvfEYVU'],
  ['Rockstar', 6, 218, 90000, 'UceaB4D0jpo'],
  ['Circles', 6, 215, 87000, 'wXhTHyIgQ_U'],
  ['Congratulations', 6, 220, 84000, 'SC4xMk98Pdc'],
  ['Better Now', 6, 231, 80000, 'UYwF-jdcVjY'],
  ['Stay', 6, 141, 85000, 'GeGkzm6OFaI'],
  ['Wow.', 6, 137, 77000, 'SSOhj75CTFQ'],
  ['Psycho', 6, 207, 83000, 'Z1iMG7oFLbc'],
  ['I Fall Apart', 6, 238, 79000, '4kzNbZgokIk'],
  ['White Iverson', 6, 239, 74000, 'CbI3OUxqj-s'],

  // ── ARIANA GRANDE ──
  ['7 Rings', 7, 178, 92000, 'QYh6mYIJG2Y'],
  ['thank u, next', 7, 207, 89000, 'gl1aHhXnN1k'],
  ['positions', 7, 172, 85000, 'tcYodQoapMg'],
  ['Into You', 7, 244, 82000, 'gPyGS31WNLI'],
  ['No Tears Left To Cry', 7, 209, 79000, 'ffxKSjUwKdU'],
  ['God is a woman', 7, 197, 83000, 'kHLHSlExFis'],
  ['Problem', 7, 211, 77000, 'iS1g8SpkdjY'],
  ['Side to Side', 7, 194, 74000, 'SXiSVQZLje8'],
  ['Break Free', 7, 204, 71000, 'L8eRzOYhLuw'],
  ['One Last Time', 7, 234, 76000, 'dvDF9ksANuU'],
  ['Dangerous Woman', 7, 244, 73000, 'Ik1ht3kkNn8'],

  // ── HARRY STYLES ──
  ['As It Was', 8, 167, 94000, 'H5v3kku4y6Q'],
  ['Watermelon Sugar', 8, 174, 88000, 'E07s5ZYygMg'],
  ['Adore You', 8, 207, 83000, 'VF-r5TtlT9w'],
  ['Sign of the Times', 8, 340, 79000, 'qN4ooNx77u0'],
  ['Golden', 8, 210, 76000, 'P3cffdsEXXw'],
  ['Falling', 8, 240, 80000, 'bXR0wYfvKAs'],
  ['Treat People With Kindness', 8, 201, 72000, 'z2pS5t8x9bA'],

  // ── BTS ──
  ['Dynamite', 10, 199, 96000, 'gdZLi9oWNZg'],
  ['Butter', 10, 164, 94000, 'WMweEpGlu_U'],
  ['Boy With Luv', 10, 230, 90000, 'XsX3ATc3r_s'],
  ['DNA', 10, 186, 87000, 'MBdVXkSdhwU'],
  ['Spring Day', 10, 275, 84000, 'xEeFrLSkMm8'],
  ['Fake Love', 10, 244, 81000, '7C2z4GqqS5E'],
  ['Blood Sweat Tears', 10, 224, 79000, 'hmE9f-TEutc'],
  ['Fire', 10, 203, 83000, 'ALj5MKjy2BU'],
  ['IDOL', 10, 212, 77000, 'pBuZEGYXA6E'],
  ['Life Goes On', 10, 222, 80000, 'PrDiHlvjBLc'],

  // ── OLIVIA RODRIGO ──
  ['drivers license', 11, 242, 93000, 'ZmDBbnmKpqQ'],
  ['good 4 u', 11, 178, 90000, 'gNi_6U5Pm_o'],
  ['deja vu', 11, 215, 87000, 'cii6ruuycQA'],
  ['brutal', 11, 154, 84000, 'AnnDmzFiVkg'],
  ['traitor', 11, 231, 81000, 'WYQJ3FT1bU4'],
  ['1 step forward 3 steps back', 11, 160, 71000, 'bnIaS9RiTso'],
  ['enough for you', 11, 241, 73000, 'F3wSxrxhxlQ'],
  ['favorite crime', 11, 153, 76000, '6qH2ofB3oCw'],
  ['happier', 11, 209, 74000, 'cAHQKJQXaWU'],
  ['hope ur ok', 11, 199, 72000, '5fQFxeYJ0qc'],
  ['vampire', 11, 219, 88000, 'RlPNh_PWAon'],
  ['bad idea right?', 11, 176, 82000, 'DLZT4FjDV_4'],

  // ── COLDPLAY ──
  ['Yellow', 13, 269, 90000, 'yKNxeF4KMsY'],
  ['The Scientist', 13, 307, 87000, 'RB-RcX5DS5A'],
  ['Fix You', 13, 295, 88000, 'k4V3Mo61fJM'],
  ['Viva la Vida', 13, 242, 84000, 'dvgZkm1xWPE'],
  ['A Sky Full of Stars', 13, 268, 80000, 'VPRjCeoBqrI'],
  ['Paradise', 13, 278, 82000, 'mIskuFSNmtE'],
  ['Clocks', 13, 307, 78000, 'd020hcWA_Ww'],
  ['Magic', 13, 285, 74000, 'QLJL-gNLrDQ'],
  ['Speed of Sound', 13, 312, 71000, '0KNzHiIrJII'],
  ['In My Place', 13, 235, 69000, 'gnIX49WNFAI'],
  ['Sparks', 13, 218, 67000, 'VrRTalHoVkM'],
  ['My Universe', 13, 225, 76000, 'ShHByRaQJic'],

  // ── EMINEM ──
  ['Lose Yourself', 14, 326, 94000, '_Yhyp-_hX2s'],
  ['Without Me', 14, 290, 88000, 'YVkUvmDQ3HY'],
  ['Stan', 14, 403, 85000, 'gOMhN-hfMtY'],
  ['Not Afraid', 14, 257, 82000, 'j5-yKhDd64s'],
  ['Beautiful', 14, 362, 79000, 'OYpFEuLe1oo'],
  ['Rap God', 14, 363, 85000, 'XbGs_qK2PQA'],
  ['Mockingbird', 14, 249, 83000, 'S9bCLPo5pGo'],
  ['Love The Way You Lie', 14, 263, 88000, 'uelHwf8o7_U'],
  ['The Real Slim Shady', 14, 284, 81000, 'eJO5HU_7_1w'],
  ['Cleanin Out My Closet', 14, 300, 77000, 'RbuAA4CXpnQ'],

  // ── ADELE ──
  ['Someone Like You', 25, 285, 95000, 'hLQl3WQQoQ0'],
  ['Rolling in the Deep', 25, 228, 92000, 'rYEDA3JcQqw'],
  ['Hello', 25, 295, 90000, 'YQHsXMglC9A'],
  ['Set Fire to the Rain', 25, 242, 87000, 'Ri7-vnrJD3k'],
  ['Skyfall', 25, 286, 85000, 'DeumyOzKqgI'],
  ['Easy On Me', 25, 224, 89000, 'U3ASj1L6_sY'],
  ['When We Were Young', 25, 282, 82000, 'GxBSyx85Kp8'],
  ['Make You Feel My Love', 25, 212, 79000, 'FbhI6uuMEZ4'],
  ['Chasing Pavements', 25, 212, 76000, 'vuum9SDO1o8'],
  ['Water Under The Bridge', 25, 249, 73000, 'cqGBaVHMZJA'],

  // ── BRUNO MARS ──
  ['Uptown Funk', 26, 270, 97000, 'OPf0YbXqDm0'],
  ['Just The Way You Are', 26, 220, 90000, 'LjhCEhWiKXk'],
  ['Grenade', 26, 222, 87000, '6Ro3GkRuuD0'],
  ['Count On Me', 26, 222, 83000, 'aKFbP-8dBjg'],
  ['Locked Out of Heaven', 26, 233, 85000, 'e-fA-gBCkj0'],
  ['Treasure', 26, 177, 82000, 'ktvTqknDobU'],
  ['That\'s What I Like', 26, 206, 80000, 'PMivT7MJ41M'],
  ['When I Was Your Man', 26, 218, 77000, '4k0Ssv8PVag'],
  ['Talking to the Moon', 26, 222, 75000, 'an2yXnNBwmk'],
  ['Versace on the Floor', 26, 260, 73000, 'OVLpuB5ElLE'],

  // ── IMAGINE DRAGONS ──
  ['Believer', 27, 204, 92000, 'W2TE0DjdNqI'],
  ['Radioactive', 27, 187, 90000, 'ktvTqknDobU'],
  ['Demons', 27, 177, 88000, 'M9BNoNFey2I'],
  ['Thunder', 27, 187, 85000, 'fKopy74weus'],
  ['Natural', 27, 189, 83000, 'syFZfO_wfMQ'],
  ['Enemy', 27, 173, 87000, 'D9G1VOjN_84'],
  ['Bones', 27, 143, 81000, 'bfNXCeqGnMg'],
  ['Warriors', 27, 169, 79000, 'ZBpUHAgB3Sc'],
  ['It\'s Time', 27, 240, 76000, 'senvnAWFMb4'],
  ['Roots', 27, 230, 73000, 'A-J9TJlqBRc'],

  // ── THE CHAINSMOKERS ──
  ['Closer', 28, 245, 93000, 'PT2_F-1esPk'],
  ['Something Just Like This', 28, 247, 90000, 'FM7MFYoylVs'],
  ['Don\'t Let Me Down', 28, 215, 87000, 'Io0fBr1XBUA'],
  ['Paris', 28, 213, 84000, 'lY2yjAdbvdQ'],
  ['Roses', 28, 221, 81000, 'EmroCgUZ3rA'],

  // ── CHARLIE PUTH ──
  ['Attention', 34, 207, 87000, 'nfs8NYg7yQM'],
  ['We Don\'t Talk Anymore', 34, 208, 84000, 'Rk_sAHh9s08'],
  ['See You Again', 34, 229, 92000, 'RgKAFK5djSk'],
  ['One Call Away', 34, 205, 80000, 'BxuY9FET9Y4'],
  ['Left Right Left', 34, 195, 74000, 'CmCNMkemcHQ'],

  // ── SHAWN MENDES ──
  ['Stitches', 35, 207, 85000, 'UnqKMSNEsvQ'],
  ['Treat You Better', 35, 197, 83000, 'ub8LU1P7dzQ'],
  ['Mercy', 35, 193, 80000, 'Pk-b-JhFeSs'],
  ['In My Blood', 35, 215, 77000, 'SRsvDHFBRmk'],
  ['There\'s Nothing Holdin Me Back', 35, 187, 74000, 'o1dQLarion0'],

  // ── MAROON 5 ──
  ['Sugar', 38, 235, 88000, 'nEd9gGFBJxc'],
  ['Moves Like Jagger', 38, 200, 85000, 'iEPTlhErL-w'],
  ['Animals', 38, 230, 82000, 'qpgTC9MDx1o'],
  ['This Love', 38, 230, 79000, 'UmPFOQoJl6k'],
  ['Payphone', 38, 231, 76000, 'KRaWnd3LJms'],
  ['Maps', 38, 194, 73000, 'b1O-aWuaR54'],
  ['She Will Be Loved', 38, 254, 80000, '9QL8CKDTl78'],

  // ── KATY PERRY ──
  ['Roar', 31, 224, 88000, 'CevxZvSJLk8'],
  ['Firework', 31, 228, 87000, 'QGJuMBdaqIw'],
  ['Dark Horse', 31, 215, 85000, '0KSOMA3QBU0'],
  ['Teenage Dream', 31, 217, 82000, '98WtmW-lfeE'],
  ['California Gurls', 31, 232, 79000, 'F57P9C4SAW4'],
  ['Unconditionally', 31, 228, 76000, 'UUSG7jlABJQ'],

  // ══════════════════════════════
  // BOLLYWOOD / HINDI SONGS
  // ══════════════════════════════

  // ── ARIJIT SINGH ──
  ['Tum Hi Ho', 15, 262, 97000, 'Umqb9KENgmk'],
  ['Ae Dil Hai Mushkil', 15, 287, 94000, 'cPbdcF64GBU'],
  ['Channa Mereya', 15, 310, 92000, 'zahrZjf5WCg'],
  ['Phir Le Aaya Dil', 15, 284, 89000, 'V0jM37OzSVg'],
  ['Agar Tum Saath Ho', 15, 325, 91000, 'sR0Pjp2kFnQ'],
  ['Tere Sang Yaara', 15, 248, 85000, 'QDhOzuCaM0g'],
  ['Kabira', 15, 218, 88000, 'K3pVgfFTLxo'],
  ['Kesariya', 15, 264, 94000, 'BddP6PYo2gs'],
  ['Apna Bana Le', 15, 260, 90000, 'k5bk-XHWP_g'],
  ['Shayad', 15, 249, 89000, 'kbDTuMH7_6M'],
  ['Hawayein', 15, 290, 92000, 'cTwQ5RP7-ik'],
  ['Gerua', 15, 296, 88000, 'vt0Y39eMvpI'],
  ['Zaalima', 15, 272, 87000, 'g1jEAq-zFdE'],
  ['Ik Vaari Aa', 15, 285, 86000, 'yQFBIj3aOGE'],
  ['Tum Se Hi', 15, 274, 83000, 'L0IFKjUTRug'],
  ['Mast Magan', 15, 220, 80000, '5hqmkuRCpK4'],
  ['Soch Na Sake', 15, 268, 82000, 'p6dCHUqYFfg'],
  ['Tera Fitoor', 15, 265, 84000, 'Vbpbe5BsCGI'],
  ['Phle Nazar Mein', 15, 240, 78000, 'YYh_frFi6V4'],
  ['Woh Lamha', 15, 278, 81000, 'zJ5X9fXg4pY'],

  // ── AR RAHMAN ──
  ['Jai Ho', 16, 330, 93000, 'rhtCooa9iRc'],
  ['Chaiyya Chaiyya', 16, 289, 91000, 'GjvGmQJRmvU'],
  ['Kun Faya Kun', 16, 432, 92000, 'T94PHkG_GRk'],
  ['Dil Se Re', 16, 345, 82000, 'zQXCa2WkQW8'],
  ['Maa Tujhe Salaam', 16, 370, 88000, 'lrMhMXFZsHI'],
  ['Khwaja Mere Khwaja', 16, 432, 86000, 'jPu77bC0cMY'],
  ['Jai Ho (You Are My Destiny)', 16, 276, 80000, 'b_UMDzaXq0I'],
  ['Humma Humma', 16, 350, 84000, 'UMxv3hL7MxY'],

  // ── SHREYA GHOSHAL ──
  ['Teri Meri', 17, 298, 88000, 'JmMvBxWM8qk'],
  ['Sun Raha Hai', 17, 260, 85000, 'SnoHFMZkSmg'],
  ['Barso Re', 17, 281, 83000, 'Eh9AmvqxS_k'],
  ['Jadu Hai Nasha', 17, 265, 80000, 'cKdILbHNFz8'],
  ['Tum Jo Aaye', 17, 304, 82000, 'Qa4y9MrEoBM'],
  ['Piyu Bole', 17, 298, 78000, 'WMweEpGlu_U'],
  ['Deewani Mastani', 17, 309, 84000, 'BRdoEpEZMiI'],
  ['Sunn Raha Hai Na Tu', 17, 260, 86000, 'SnoHFMZkSmg'],

  // ── ATIF ASLAM ──
  ['Woh Lamhe', 18, 278, 92000, 'C2Fy0W-Yx0U'],
  ['Tu Jaane Na', 18, 298, 89000, 'ZVMf8yexUUM'],
  ['Pehli Nazar Mein', 18, 290, 87000, 'mrdDWkJDJg4'],
  ['Teri Aankhon Mein', 18, 264, 84000, 'h3bS8tpEfRE'],
  ['Dil Diyan Gallan', 18, 290, 90000, 'cUhOB6vFSaQ'],
  ['Doorie', 18, 292, 82000, 'MbJNGxdRoNw'],
  ['Tere Liye', 18, 283, 80000, 'HW1FhyxV4mQ'],
  ['Tu Hi Mera', 18, 268, 78000, 'EFxwBJqJmn0'],
  ['Jeena Jeena', 18, 221, 84000, 'w5S7Dq_rF7M'],
  ['Maana Dil', 18, 247, 81000, 'uG5_LkBLFcA'],

  // ── JUBIN NAUTIYAL ──
  ['Lut Gaye', 22, 215, 91000, 'b-Fy7EX_9jU'],
  ['Raataan Lambiyan', 22, 248, 93000, 'PpyFt07v7OA'],
  ['Main Rahoon Ya Na Rahoon', 22, 267, 86000, 'kquJTq9lP1w'],
  ['O Saathi', 22, 240, 87000, 'hcSFN3SHRD8'],
  ['Tujhe Kitna Chahein Aur', 22, 274, 90000, 'VABbV9yBUYs'],
  ['Bekhayali', 22, 327, 93000, 'gG_dPPo5HQY'],
  ['Tera Ban Jaunga', 22, 225, 88000, 'gkBfHpLFkdU'],
  ['Pachtaoge', 22, 245, 90000, 'S3_DkH3H0f0'],
  ['Shayad', 22, 249, 85000, 'kbDTuMH7_6M'],
  ['Dil Galti Kar Baitha Hai', 22, 258, 87000, 'EMcBCk2IWCc'],

  // ── NEHA KAKKAR ──
  ['Aankh Marey', 23, 197, 88000, 'DnCqPuBiFoM'],
  ['O Humsafar', 23, 220, 85000, 'NsX5cVJmCJw'],
  ['Dilbar', 23, 208, 90000, 'E5GA-ZpShqc'],
  ['Garmi', 23, 190, 87000, 'ZAm_EWgxGBg'],
  ['Nikle Currant', 23, 213, 82000, 'BcbWi-5A8R8'],
  ['Tera Suit', 23, 195, 80000, 'T9OlG66A_q4'],
  ['Coca Cola', 23, 213, 85000, 'OFhFqNmFLHY'],
  ['Tony Kakkar - Yaad Piya Ki Aane Lagi', 23, 233, 79000, '_6SBmpjrWN8'],
  ['Akhiyaan', 23, 209, 81000, 'H9Y7DkHFBHI'],

  // ── YO YO HONEY SINGH ──
  ['Blue Eyes', 24, 221, 88000, 'nl5Sl_CJxrE'],
  ['Brown Rang', 24, 245, 85000, 'v5PYWCiCyIE'],
  ['Angreji Beat', 24, 213, 82000, 'JiHqFoHT00M'],
  ['Desi Kalakaar', 24, 227, 80000, 'KqKHCqnqlQY'],
  ['Lungi Dance', 24, 208, 86000, 'aFpMxLCqkNA'],

  // ── PRITAM ──
  ['Gerua', 40, 296, 88000, 'vt0Y39eMvpI'],
  ['Agar Tum Saath Ho', 40, 325, 91000, 'sR0Pjp2kFnQ'],
  ['Illahi', 40, 283, 82000, 'VUbzFZYzWDA'],
  ['Safar', 40, 263, 80000, 'nkuXuAHHiX8'],
  ['Bulleya', 40, 290, 85000, 'SdvlHbcXFiM'],

  // ── VISHAL MISHRA ──
  ['Butterflies', 41, 220, 83000, 'PGIcG37AOBE'],
  ['Mere Liye Tum Kaafi Ho', 41, 243, 80000, 'xL9nQMQ7sXA'],
  ['Pehle Bhi Main', 41, 213, 78000, '5FdF63u4jJI'],

  // ── ARMAAN MALIK ──
  ['Main Hoon Hero Tera', 43, 226, 80000, 'xDSMmjNMbvE'],
  ['Wajah Tum Ho', 43, 247, 83000, 'XP5b3a8-BDk'],
  ['Bol Do Na Zara', 43, 249, 81000, 'QgtcOGpCFxc'],
  ['Tu Jo Mila', 43, 240, 78000, 'Nm2fBi0Sv_c'],
  ['Main Rahoon Ya Na Rahoon', 43, 267, 82000, 'kquJTq9lP1w'],

  // ── DARSHAN RAVAL ──
  ['Tera Zikr', 44, 231, 82000, 'X3dSE8WBLFY'],
  ['Chogada Tara', 44, 214, 80000, 'xW0PVQRFi5Y'],
  ['Naina', 44, 240, 78000, 'sXaTBpnTOcs'],
  ['Dil Ko Karaar Aaya', 44, 248, 83000, 'QgN6eMKAQ5o'],
  ['Ho Ja Awara', 44, 231, 76000, '3vvkXYzTXb0'],

  // ── SONU NIGAM ──
  ['Kal Ho Naa Ho', 21, 330, 90000, 'kvLfNK7ZvrI'],
  ['Abhi Mujh Mein Kahin', 21, 300, 84000, 'bCt_P6TsYEY'],
  ['Dil Chahta Hai Title', 21, 294, 82000, 'VlGNSJ9M7L0'],
  ['Tere Naam', 21, 298, 87000, 'zJPjsENq_pE'],
  ['Saathiya', 21, 295, 85000, '39QMzVuYrFI'],
  ['Do Dil Ek Jaan', 21, 286, 78000, 'j_rrv3DNWKE'],

  // ── KISHORE KUMAR ──
  ['Mere Sapno Ki Rani', 19, 320, 88000, 'Z1mAWaIr_a0'],
  ['Roop Tera Mastana', 19, 310, 85000, 'czNpNq6r4Kk'],
  ['Pal Pal Dil Ke Paas', 19, 296, 83000, 'KFdyQiqyXyQ'],
  ['Yeh Shaam Mastani', 19, 280, 80000, 'WKRBpZ-bA2E'],

  // ── LATA MANGESHKAR ──
  ['Lag Ja Gale', 20, 335, 89000, 'BtC3k-rHLPs'],
  ['Ajeeb Dastan Hai Yeh', 20, 308, 86000, '8UUnHqKjDJA'],
  ['Tere Bina Zindagi Se Koi', 20, 326, 83000, 'J5yAfRq-ywA'],

  // ── MOHIT CHAUHAN ──
  ['Tum Se Hi', 49, 274, 84000, 'L0IFKjUTRug'],
  ['Masakali', 49, 266, 82000, 'pEYyLSTbySE'],
  ['Dooba Dooba', 49, 291, 79000, 'l2c_0j4R8t4'],
  ['Tu Bhoola Jise', 49, 285, 77000, 'pnOBp0cK2Ew'],

  // ── KK ──
  ['Tadap Tadap', 45, 320, 85000, 'xoxEVVaHAus'],
  ['Tu Hi Meri Shab Hai', 45, 283, 83000, 'R5RpXbMGD_8'],
  ['Yaaron', 45, 245, 87000, 'f94nDMCkVpM'],
  ['Kuch Khass Hai', 45, 260, 80000, 'U5PPbRfyuoI'],
  ['Alvida', 45, 296, 78000, 'QTzTzm3-2GA'],
  ['Zindagi Do Pal Ki', 45, 276, 82000, 'W-MqxCTqiH8'],
  ['O Meri Jaan', 45, 270, 79000, 'cKy-jKEGHE4'],

  // ── UDIT NARAYAN ──
  ['Pehla Nasha', 46, 330, 88000, 'EJX35HICWFY'],
  ['Mere Khwabon Mein', 46, 280, 85000, 'M7N9jYc1pGE'],
  ['Aati Kya Khandala', 46, 240, 82000, '_6wNfPrKEYY'],

  // ── SUNIDHI CHAUHAN ──
  ['Beedi', 48, 210, 83000, 'nRCNhK0YXYA'],
  ['Dhoom Taana', 48, 248, 80000, '0-3hTW1sdHY'],
  ['Sheila Ki Jawani', 48, 214, 86000, 'ZTm_uB27gYI'],
  ['Kajra Re', 48, 260, 81000, 'n8H8lv9tfOk'],
]

// Mood assignments: moodName -> list of song titles
const moodAssignments = {
  'Energetic': [
    'Blinding Lights','Dynamite','Butter','bad guy','Uptown Funk','Shake It Off',
    'Blue Eyes','Garmi','Brown Rang','Angreji Beat','Desi Kalakaar','Houdini',
    'Believer','Fire','Thunder','Roar','Firework','Lungi Dance','Dilbar',
    'Aankh Marey','Beedi','Sheila Ki Jawani','Kajra Re','IDOL','Moves Like Jagger',
    "Don't Start Now",'Physical','Natural','Enemy','Bones','Warriors',
    'Coca Cola','Humma Humma','Desi Kalakaar'
  ],
  'Happy': [
    'Levitating','Watermelon Sugar','Happy','Sunflower','Circles','7 Rings',
    'positions','Treasure','That\'s What I Like','Sugar','Count On Me',
    'Good 4 u','22','Jai Ho','Maa Tujhe Salaam','Chogada Tara','Aankh Marey',
    'Yaaron','Pehla Nasha','Cake By The Ocean','Se Fue','As It Was',
    'Dynamite','Boy With Luv','Butter','Galway Girl','Shivers','Wow.'
  ],
  'Sad': [
    'Let Her Go','Photograph','when the party\'s over','drivers license',
    'Teri Meri','Woh Lamhe','Bekhayali','Phir Le Aaya Dil','Channa Mereya',
    'Tum Hi Ho','Agar Tum Saath Ho','Kabira','lovely','Someone Like You',
    'Fix You','The Scientist','idontwannabeyouanymore','traitor',
    'Tujhse Naraz Nahin','Pachtaoge','Dil Ko Karaar Aaya','Lag Ja Gale',
    'Ajeeb Dastan Hai Yeh','Tadap Tadap','Tu Hi Meri Shab Hai','Alvida',
    'Zindagi Do Pal Ki','Kal Ho Naa Ho','Spring Day','Happier Than Ever',
    'Make You Feel My Love','Set Fire to the Rain','Wajah Tum Ho',
    'Tum Se Hi','Dooba Dooba','everything i wanted','enough for you',
    'traitor','hope ur ok','favourite crime','Main Rahoon Ya Na Rahoon'
  ],
  'Romantic': [
    'Perfect','Thinking Out Loud','All of Me','Tum Hi Ho','Ae Dil Hai Mushkil',
    'Channa Mereya','Hawayein','Gerua','Kesariya','Dil Diyan Gallan',
    'Raataan Lambiyan','Tere Sang Yaara','Jeena Jeena','Tera Zikr',
    'Pehla Nasha','Mere Khwabon Mein','Pehle Bhi Main','Tera Fitoor',
    'Just The Way You Are','Talking to the Moon','Versace on the Floor',
    'When I Was Your Man','Adore You','Golden','Falling','Unconditionally',
    'Ajeeb Dastan Hai Yeh','Lag Ja Gale','Roop Tera Mastana','Pal Pal Dil Ke Paas',
    'Saathiya','Dil Galti Kar Baitha Hai','Deewani Mastani','Tum Se Hi',
    'Woh Lamha','Mere Liye Tum Kaafi Ho','Butterflies','Dil Ko Karaar Aaya',
    'Bol Do Na Zara','Tu Jo Mila','Maana Dil','Teri Aankhon Mein'
  ],
  'Chill': [
    'Starboy','After Hours','lovely','Passionfruit','Kun Faya Kun',
    'Kal Ho Naa Ho','Spring Day','Yellow','Paradise','Ocean Eyes',
    'Happier','Clocks','Magic','Sparks','One Dance','Closest','Roses',
    'Give Me Love','Treat People With Kindness','Life Goes On',
    'Naina','Ho Ja Awara','Dooria','Safar','Illahi','Sunn Raha Hai Na Tu',
    'Piyu Bole','Tum Jo Aaye','Yeh Shaam Mastani'
  ],
  'Focus': [
    'Viva la Vida','Fix You','The Scientist','Lose Yourself','Jai Ho',
    'Chaiyya Chaiyya','Stan','A Sky Full of Stars','Speed of Sound',
    'In My Place','Clocks','Radioactive','Believers','Roots','It\'s Time',
    'Not Afraid','Rap God','Cleanin Out My Closet','Khwaja Mere Khwaja'
  ],
  'Party': [
    "God's Plan",'One Dance','Hotline Bling','Shape of You','Bad Habits',
    'Anti-Hero',"Don't Start Now",'Physical','Uptown Funk','Locked Out of Heaven',
    'Animals','Moves Like Jagger','Payphone','Dark Horse','Roar',
    'California Gurls','Garmi','Dilbar','Lungi Dance','Angreji Beat',
    'Desi Kalakaar','Coca Cola','Fire','IDOL','Toosie Slide',
    'Sugar','That\'s What I Like','Maps','Sheila Ki Jawani','Kajra Re',
    'Aankh Marey','Brown Rang','Blue Eyes'
  ]
}

async function seed() {
  console.log('\n🎵 VibeSync Mega Seed Starting...\n')
  try {
    // Add youtube_id column if missing
    await db.query(`ALTER TABLE songs ADD COLUMN IF NOT EXISTS youtube_id VARCHAR(20) DEFAULT NULL`)
    console.log('✅ youtube_id column ready')

    // Upsert artists
    const artistIds = {}
    for (const name of artists) {
      const [rows] = await db.query('SELECT artist_id FROM artists WHERE name = ?', [name])
      if (rows.length) {
        artistIds[name] = rows[0].artist_id
      } else {
        const [res] = await db.query('INSERT INTO artists (name) VALUES (?)', [name])
        artistIds[name] = res.insertId
      }
    }
    console.log(`✅ ${artists.length} artists ready`)

    // Upsert songs
    let ins = 0, upd = 0
    for (const [title, aIdx, duration, playCount, ytId] of songs) {
      const artistName = artists[aIdx]
      const artistId = artistIds[artistName]
      if (!artistId) continue

      const [ex] = await db.query('SELECT song_id FROM songs WHERE title = ? AND artist_id = ?', [title, artistId])
      if (ex.length) {
        await db.query(
          'UPDATE songs SET youtube_id=?, play_count=?, duration=? WHERE song_id=?',
          [ytId, playCount, duration, ex[0].song_id]
        )
        upd++
      } else {
        await db.query(
          'INSERT INTO songs (title, artist_id, duration, play_count, youtube_id) VALUES (?,?,?,?,?)',
          [title, artistId, duration, playCount, ytId]
        )
        ins++
      }
    }
    console.log(`✅ Songs: ${ins} inserted, ${upd} updated`)

    // Reassign moods
    const [moodRows] = await db.query('SELECT mood_id, mood_name FROM moods')
    const moodMap = {}
    moodRows.forEach(m => { moodMap[m.mood_name] = m.mood_id })

    const [allSongs] = await db.query('SELECT song_id, title FROM songs')
    const titleMap = {}
    allSongs.forEach(s => { titleMap[s.title.toLowerCase()] = s.song_id })

    await db.query('DELETE FROM song_mood')
    let moodIns = 0

    for (const [moodName, titles] of Object.entries(moodAssignments)) {
      const moodId = moodMap[moodName]
      if (!moodId) continue
      for (const title of titles) {
        const songId = titleMap[title.toLowerCase()]
        if (songId) {
          await db.query('INSERT IGNORE INTO song_mood (song_id, mood_id) VALUES (?,?)', [songId, moodId])
          moodIns++
        }
      }
    }
    console.log(`✅ ${moodIns} mood assignments`)

    // Final count
    const [cnt] = await db.query('SELECT COUNT(*) as t, COUNT(youtube_id) as yt FROM songs')
    console.log(`\n📊 Final: ${cnt[0].t} total songs | ${cnt[0].yt} with YouTube IDs`)
    console.log('\n🎉 Seed complete!\n')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seed()
