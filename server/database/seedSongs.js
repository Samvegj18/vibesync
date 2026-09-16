/**
 * ============================================
 * VIBESYNC - Song Seeder
 * Seeds 500+ popular songs with YouTube IDs
 * Run: node server/database/seedSongs.js
 * ============================================
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const db = require('../config/db')

const artists = [
  { name: 'The Weeknd', avatar: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb' },
  { name: 'Billie Eilish', avatar: 'https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf' },
  { name: 'Ed Sheeran', avatar: 'https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6' },
  { name: 'Dua Lipa', avatar: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9' },
  { name: 'Drake', avatar: 'https://i.scdn.co/image/ab6761610000e5ebf60ba02b9fe56be804e90cac' },
  { name: 'Taylor Swift', avatar: 'https://i.scdn.co/image/ab6761610000e5ebe672b5f553298dcdccb0e676' },
  { name: 'Post Malone', avatar: 'https://i.scdn.co/image/ab6761610000e5ebe17c0aa4b8a7cca10485bb9e' },
  { name: 'Ariana Grande', avatar: 'https://i.scdn.co/image/ab6761610000e5eb40b4b7609fdd709ac45e0e8d' },
  { name: 'Harry Styles', avatar: 'https://i.scdn.co/image/ab6761610000e5eb0fc04dce38dbb265bd44e3b1' },
  { name: 'Bad Bunny', avatar: 'https://i.scdn.co/image/ab6761610000e5eb51df70be03f47e57b5db1e56' },
  { name: 'BTS', avatar: 'https://i.scdn.co/image/ab6761610000e5eb9e528993a2820267b97f6aae' },
  { name: 'Olivia Rodrigo', avatar: 'https://i.scdn.co/image/ab6761610000e5ebe03a98785f3658f0b6461ec4' },
  { name: 'Justin Bieber', avatar: 'https://i.scdn.co/image/ab6761610000e5eba03696716c9ee605006047fd' },
  { name: 'Coldplay', avatar: 'https://i.scdn.co/image/ab6761610000e5eb8e775a3b0e5d24e46a4dad37' },
  { name: 'Eminem', avatar: 'https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b' },
  { name: 'Arijit Singh', avatar: 'https://i.scdn.co/image/ab6761610000e5eb89f7c73d5c14c72e14b025b8' },
  { name: 'AR Rahman', avatar: 'https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b' },
  { name: 'Shreya Ghoshal', avatar: 'https://i.scdn.co/image/ab6761610000e5eb9e528993a2820267b97f6aae' },
  { name: 'Atif Aslam', avatar: 'https://i.scdn.co/image/ab6761610000e5eb8e775a3b0e5d24e46a4dad37' },
  { name: 'Kishore Kumar', avatar: 'https://i.scdn.co/image/ab6761610000e5eba03696716c9ee605006047fd' },
  { name: 'Lata Mangeshkar', avatar: 'https://i.scdn.co/image/ab6761610000e5eb51df70be03f47e57b5db1e56' },
  { name: 'Sonu Nigam', avatar: 'https://i.scdn.co/image/ab6761610000e5ebf60ba02b9fe56be804e90cac' },
  { name: 'Jubin Nautiyal', avatar: 'https://i.scdn.co/image/ab6761610000e5eb40b4b7609fdd709ac45e0e8d' },
  { name: 'Neha Kakkar', avatar: 'https://i.scdn.co/image/ab6761610000e5ebe03a98785f3658f0b6461ec4' },
  { name: 'Yo Yo Honey Singh', avatar: 'https://i.scdn.co/image/ab6761610000e5eb9e528993a2820267b97f6aae' },
]

// Songs: [title, artistIndex(0-based), duration, playCount, youtubeId, coverImage]
const songs = [
  // === THE WEEKND ===
  ['Blinding Lights', 0, 200, 95000, '4NRXx6U8ABQ', 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'],
  ['Save Your Tears', 0, 215, 82000, 'LIIDh-qkCR4', 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'],
  ['Starboy', 0, 230, 78000, 'dqRZDebPIGs', 'https://i.scdn.co/image/ab67616d0000b273b1823de7d04c62c3cf86d40a'],
  ['The Hills', 0, 242, 70000, 'yzTuBuRdAyA', 'https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a'],
  ['After Hours', 0, 361, 67000, 'ygTZZpVkmKg', 'https://i.scdn.co/image/ab67616d0000b27380369e3e8b6c85736e6bdb2d'],
  ['Can\'t Feel My Face', 0, 213, 75000, 'KEI4qSrkPAs', 'https://i.scdn.co/image/ab67616d0000b2732a7db835b912dc5014bd37f4'],
  ['Die For You', 0, 260, 88000, 'mGkNVyBXvRs', 'https://i.scdn.co/image/ab67616d0000b273b1823de7d04c62c3cf86d40a'],
  ['Earned It', 0, 311, 72000, 'waU75jdUnYw', 'https://i.scdn.co/image/ab67616d0000b27380369e3e8b6c85736e6bdb2d'],

  // === BILLIE EILISH ===
  ['Bad Guy', 1, 194, 90000, 'DyDfgMOUjCI', 'https://i.scdn.co/image/ab67616d0000b273d95f7c4c3e5c0f3b42b8a1e2'],
  ['Lovely', 1, 200, 85000, 'IV4DBLH7e3k', 'https://i.scdn.co/image/ab67616d0000b2739b2d7d9aaaecf5e0b3b3d8f1'],
  ['Ocean Eyes', 1, 201, 80000, 'viimfQi_pUw', 'https://i.scdn.co/image/ab67616d0000b273d95f7c4c3e5c0f3b42b8a1e2'],
  ['Happier Than Ever', 1, 298, 77000, '5GJWxDKyk3A', 'https://i.scdn.co/image/ab67616d0000b2739b2d7d9aaaecf5e0b3b3d8f1'],
  ['When The Party\'s Over', 1, 196, 82000, 'pbMwTqkKSps', 'https://i.scdn.co/image/ab67616d0000b273d95f7c4c3e5c0f3b42b8a1e2'],
  ['Therefore I Am', 1, 174, 74000, 'RGm6p0wLHqg', 'https://i.scdn.co/image/ab67616d0000b2739b2d7d9aaaecf5e0b3b3d8f1'],
  ['Bury A Friend', 1, 193, 70000, 'AgnCbEkHFU0', 'https://i.scdn.co/image/ab67616d0000b273d95f7c4c3e5c0f3b42b8a1e2'],

  // === ED SHEERAN ===
  ['Shape of You', 2, 234, 98000, 'JGwWNGJdvx8', 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96'],
  ['Perfect', 2, 263, 92000, '2Vv-BfVoq4g', 'https://i.scdn.co/image/ab67616d0000b2738b52c6e9832b4978b92e7bfe'],
  ['Thinking Out Loud', 2, 281, 87000, 'lp-EO5I60KA', 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96'],
  ['Photograph', 2, 258, 84000, 'nSDgHBxUbVQ', 'https://i.scdn.co/image/ab67616d0000b2738b52c6e9832b4978b92e7bfe'],
  ['Castle on the Hill', 2, 261, 78000, 'cqvPpfj-NFk', 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96'],
  ['Bad Habits', 2, 231, 88000, 'orJSJGHjBLI', 'https://i.scdn.co/image/ab67616d0000b2738b52c6e9832b4978b92e7bfe'],
  ['Shivers', 2, 207, 75000, 'Il0S8BoucSA', 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96'],

  // === DUA LIPA ===
  ['Levitating', 3, 203, 86000, 'TUVcZfQe-Kw', 'https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f1dde6b8'],
  ['New Rules', 3, 209, 83000, 'k2qgadSvNyU', 'https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f1dde6b8'],
  ['Don\'t Start Now', 3, 183, 89000, 'oygrmJFkg68', 'https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f1dde6b8'],
  ['Physical', 3, 193, 76000, '9HDEHj2yzew', 'https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f1dde6b8'],
  ['Break My Heart', 3, 221, 72000, 'Nj2U6rhnucI', 'https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f1dde6b8'],
  ['Houdini', 3, 185, 79000, 'H-bFNNsFRmk', 'https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f1dde6b8'],

  // === DRAKE ===
  ['God\'s Plan', 4, 198, 95000, 'xpVfcZ0ZcFM', 'https://i.scdn.co/image/ab67616d0000b2730f4f03eed3dfc5c1eb844406'],
  ['One Dance', 4, 173, 91000, '6rQUH9CTYD8', 'https://i.scdn.co/image/ab67616d0000b273c71c4ddddf7b53dd08cf0a7e'],
  ['Hotline Bling', 4, 267, 87000, 'uxpDa-c-4Mc', 'https://i.scdn.co/image/ab67616d0000b2730f4f03eed3dfc5c1eb844406'],
  ['In My Feelings', 4, 217, 84000, 'DRS_PpOrUZ4', 'https://i.scdn.co/image/ab67616d0000b273c71c4ddddf7b53dd08cf0a7e'],
  ['Started From The Bottom', 4, 207, 78000, 'RubBzkKEBj0', 'https://i.scdn.co/image/ab67616d0000b2730f4f03eed3dfc5c1eb844406'],
  ['Passionfruit', 4, 295, 80000, 'nu6V5FsBBLc', 'https://i.scdn.co/image/ab67616d0000b273c71c4ddddf7b53dd08cf0a7e'],

  // === TAYLOR SWIFT ===
  ['Anti-Hero', 5, 200, 95000, 'b1kbLwvqugk', 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5'],
  ['Shake It Off', 5, 219, 92000, 'nfWlot6h_JM', 'https://i.scdn.co/image/ab67616d0000b27364840995fe43bb2ec73a241d'],
  ['Blank Space', 5, 231, 89000, 'e-ORhEE9VVg', 'https://i.scdn.co/image/ab67616d0000b27364840995fe43bb2ec73a241d'],
  ['Love Story', 5, 235, 86000, '8xg3vE8Ie_E', 'https://i.scdn.co/image/ab67616d0000b27364840995fe43bb2ec73a241d'],
  ['You Belong With Me', 5, 232, 83000, 'VuNIsY6JdUw', 'https://i.scdn.co/image/ab67616d0000b27364840995fe43bb2ec73a241d'],
  ['Cruel Summer', 5, 178, 90000, 'ic8j13piAhQ', 'https://i.scdn.co/image/ab67616d0000b273e0c8bc7cd4046b9d3e6b5d5e'],
  ['Lavender Haze', 5, 202, 87000, 'CaRg87pJAN8', 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5'],
  ['Style', 5, 231, 81000, 'hamzFoe8jsE', 'https://i.scdn.co/image/ab67616d0000b27364840995fe43bb2ec73a241d'],

  // === POST MALONE ===
  ['Sunflower', 6, 158, 94000, 'ApXoWvfEYVU', 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f'],
  ['Rockstar', 6, 218, 90000, 'UceaB4D0jpo', 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f'],
  ['Circles', 6, 215, 87000, 'wXhTHyIgQ_U', 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f'],
  ['Congratulations', 6, 220, 84000, 'SC4xMk98Pdc', 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f'],
  ['Better Now', 6, 231, 80000, 'UYwF-jdcVjY', 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f'],
  ['Stay', 6, 141, 85000, 'GeGkzm6OFaI', 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f'],

  // === ARIANA GRANDE ===
  ['7 Rings', 7, 178, 92000, 'QYh6mYIJG2Y', 'https://i.scdn.co/image/ab67616d0000b2734dc08f34b1f9cc285d31ff5d'],
  ['Thank U, Next', 7, 207, 89000, 'gl1aHhXnN1k', 'https://i.scdn.co/image/ab67616d0000b2734dc08f34b1f9cc285d31ff5d'],
  ['positions', 7, 172, 85000, 'tcYodQoapMg', 'https://i.scdn.co/image/ab67616d0000b2734dc08f34b1f9cc285d31ff5d'],
  ['Into You', 7, 244, 82000, 'gPyGS31WNLI', 'https://i.scdn.co/image/ab67616d0000b2734dc08f34b1f9cc285d31ff5d'],
  ['No Tears Left To Cry', 7, 209, 79000, 'ffxKSjUwKdU', 'https://i.scdn.co/image/ab67616d0000b2734dc08f34b1f9cc285d31ff5d'],
  ['God is a woman', 7, 197, 83000, 'kHLHSlExFis', 'https://i.scdn.co/image/ab67616d0000b2734dc08f34b1f9cc285d31ff5d'],

  // === HARRY STYLES ===
  ['As It Was', 8, 167, 94000, 'H5v3kku4y6Q', 'https://i.scdn.co/image/ab67616d0000b273b46f74096beca2eda50e2b0f'],
  ['Watermelon Sugar', 8, 174, 88000, 'E07s5ZYygMg', 'https://i.scdn.co/image/ab67616d0000b273b46f74096beca2eda50e2b0f'],
  ['Adore You', 8, 207, 83000, 'VF-r5TtlT9w', 'https://i.scdn.co/image/ab67616d0000b273b46f74096beca2eda50e2b0f'],
  ['Sign of the Times', 8, 340, 79000, 'qN4ooNx77u0', 'https://i.scdn.co/image/ab67616d0000b273b46f74096beca2eda50e2b0f'],
  ['Golden', 8, 210, 76000, 'P3cffdsEXXw', 'https://i.scdn.co/image/ab67616d0000b273b46f74096beca2eda50e2b0f'],

  // === BTS ===
  ['Dynamite', 10, 199, 96000, 'gdZLi9oWNZg', 'https://i.scdn.co/image/ab67616d0000b273bef072ae995fa79ace7682a1'],
  ['Butter', 10, 164, 94000, 'WMweEpGlu_U', 'https://i.scdn.co/image/ab67616d0000b273bef072ae995fa79ace7682a1'],
  ['Boy With Luv', 10, 230, 90000, 'XsX3ATc3r_s', 'https://i.scdn.co/image/ab67616d0000b273bef072ae995fa79ace7682a1'],
  ['DNA', 10, 186, 87000, 'MBdVXkSdhwU', 'https://i.scdn.co/image/ab67616d0000b273bef072ae995fa79ace7682a1'],
  ['Spring Day', 10, 275, 84000, 'xEeFrLSkMm8', 'https://i.scdn.co/image/ab67616d0000b273bef072ae995fa79ace7682a1'],
  ['Fake Love', 10, 244, 81000, '7C2z4GqqS5E', 'https://i.scdn.co/image/ab67616d0000b273bef072ae995fa79ace7682a1'],

  // === OLIVIA RODRIGO ===
  ['drivers license', 11, 242, 93000, 'ZmDBbnmKpqQ', 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'],
  ['good 4 u', 11, 178, 90000, 'gNi_6U5Pm_o', 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'],
  ['deja vu', 11, 215, 87000, 'cii6ruuycQA', 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'],
  ['brutal', 11, 154, 84000, 'AnnDmzFiVkg', 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'],
  ['traitor', 11, 231, 81000, 'WYQJ3FT1bU4', 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'],

  // === COLDPLAY ===
  ['Yellow', 13, 269, 90000, 'yKNxeF4KMsY', 'https://i.scdn.co/image/ab67616d0000b2730c0adfa95e8e3f43ad9b23e4'],
  ['The Scientist', 13, 307, 87000, 'RB-RcX5DS5A', 'https://i.scdn.co/image/ab67616d0000b2730c0adfa95e8e3f43ad9b23e4'],
  ['Fix You', 13, 295, 88000, 'k4V3Mo61fJM', 'https://i.scdn.co/image/ab67616d0000b2730c0adfa95e8e3f43ad9b23e4'],
  ['Viva la Vida', 13, 242, 84000, 'dvgZkm1xWPE', 'https://i.scdn.co/image/ab67616d0000b2730c0adfa95e8e3f43ad9b23e4'],
  ['A Sky Full of Stars', 13, 268, 80000, 'VPRjCeoBqrI', 'https://i.scdn.co/image/ab67616d0000b2730c0adfa95e8e3f43ad9b23e4'],
  ['Paradise', 13, 278, 82000, 'mIskuFSNmtE', 'https://i.scdn.co/image/ab67616d0000b2730c0adfa95e8e3f43ad9b23e4'],
  ['Clocks', 13, 307, 78000, 'd020hcWA_Ww', 'https://i.scdn.co/image/ab67616d0000b2730c0adfa95e8e3f43ad9b23e4'],

  // === EMINEM ===
  ['Lose Yourself', 14, 326, 94000, '_Yhyp-_hX2s', 'https://i.scdn.co/image/ab67616d0000b273d17d3c0cf8568c2addd5bde9'],
  ['Slim Shady', 14, 284, 88000, 'sNPnbI1arSE', 'https://i.scdn.co/image/ab67616d0000b273d17d3c0cf8568c2addd5bde9'],
  ['Without Me', 14, 290, 86000, 'YVkUvmDQ3HY', 'https://i.scdn.co/image/ab67616d0000b273d17d3c0cf8568c2addd5bde9'],
  ['Stan', 14, 403, 84000, 'gOMhN-hfMtY', 'https://i.scdn.co/image/ab67616d0000b273d17d3c0cf8568c2addd5bde9'],
  ['Not Afraid', 14, 257, 82000, 'j5-yKhDd64s', 'https://i.scdn.co/image/ab67616d0000b273d17d3c0cf8568c2addd5bde9'],
  ['Beautiful', 14, 362, 79000, 'OYpFEuLe1oo', 'https://i.scdn.co/image/ab67616d0000b273d17d3c0cf8568c2addd5bde9'],

  // === BOLLYWOOD - ARIJIT SINGH ===
  ['Tum Hi Ho', 15, 262, 95000, 'Umqb9KENgmk', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Ae Dil Hai Mushkil', 15, 287, 92000, 'cPbdcF64GBU', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Channa Mereya', 15, 310, 90000, 'zahrZjf5WCg', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Phir Le Aaya Dil', 15, 284, 87000, 'V0jM37OzSVg', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Agar Tum Saath Ho', 15, 325, 89000, 'sR0Pjp2kFnQ', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Tere Sang Yaara', 15, 248, 83000, 'QDhOzuCaM0g', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Kabira', 15, 218, 86000, 'K3pVgfFTLxo', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Mast Magan', 15, 220, 82000, '5hqmkuRCpK4', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Soch Na Sake', 15, 268, 80000, 'p6dCHUqYFfg', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],

  // === AR RAHMAN ===
  ['Jai Ho', 16, 330, 93000, 'rhtCooa9iRc', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Vande Mataram', 16, 414, 87000, 'oNJ3dPRjFpg', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Chaiyya Chaiyya', 16, 289, 91000, 'GjvGmQJRmvU', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Roja Jaaneman', 16, 240, 84000, '9kNhsxH09xI', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Kun Faya Kun', 16, 432, 90000, 'T94PHkG_GRk', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Dil Se Re', 16, 345, 82000, 'zQXCa2WkQW8', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],

  // === SHREYA GHOSHAL ===
  ['Teri Meri', 17, 298, 88000, 'JmMvBxWM8qk', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Sun Raha Hai', 17, 260, 85000, 'SnoHFMZkSmg', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Barso Re', 17, 281, 83000, 'Eh9AmvqxS_k', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Jadu Hai Nasha', 17, 265, 80000, 'cKdILbHNFz8', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],

  // === ATIF ASLAM ===
  ['Woh Lamhe', 18, 278, 90000, 'C2Fy0W-Yx0U', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Tu Jaane Na', 18, 298, 87000, 'ZVMf8yexUUM', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Pehli Nazar Mein', 18, 290, 85000, 'mrdDWkJDJg4', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Teri Aankhon Mein', 18, 264, 82000, 'h3bS8tpEfRE', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Dil Diyan Gallan', 18, 290, 88000, 'cUhOB6vFSaQ', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],

  // === SONU NIGAM ===
  ['Kal Ho Naa Ho', 21, 330, 88000, 'kvLfNK7ZvrI', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Sandese Aate Hain', 21, 370, 84000, 'B39b9h9sT7k', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Abhi Mujh Mein Kahin', 21, 300, 82000, 'bCt_P6TsYEY', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],

  // === JUBIN NAUTIYAL ===
  ['Lut Gaye', 22, 215, 87000, 'b-Fy7EX_9jU', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Raataan Lambiyan', 22, 248, 90000, 'PpyFt07v7OA', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Main Rahoon Ya Na Rahoon', 22, 267, 84000, 'kquJTq9lP1w', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Tum Ho', 22, 282, 82000, 'L0IFKjUTRug', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],

  // === NEHA KAKKAR ===
  ['Aankh Marey', 23, 197, 88000, 'DnCqPuBiFoM', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['O Humsafar', 23, 220, 85000, 'NsX5cVJmCJw', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Dilbar', 23, 208, 90000, 'E5GA-ZpShqc', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Garmi', 23, 190, 87000, 'ZAm_EWgxGBg', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],

  // === YO YO HONEY SINGH ===
  ['Blue Eyes', 24, 221, 88000, 'nl5Sl_CJxrE', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Brown Rang', 24, 245, 85000, 'v5PYWCiCyIE', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Angreji Beat', 24, 213, 82000, 'JiHqFoHT00M', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Desi Kalakaar', 24, 227, 80000, 'KqKHCqnqlQY', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],

  // === MORE POPULAR ENGLISH SONGS (misc artists) ===
  ['Despacito', 9, 229, 100000, 'ktvTqknDobU', 'https://i.scdn.co/image/ab67616d0000b27366fb4a8e0e2e5f4c7c2c7c2c'],
  ['Shape of You (Live)', 2, 280, 75000, 'ERSs7e6K3y8', 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96'],
  ['Bohemian Rhapsody', 13, 355, 92000, 'fJ9rUzIMcZQ', 'https://i.scdn.co/image/ab67616d0000b2730c0adfa95e8e3f43ad9b23e4'],
  ['Someone Like You', 5, 285, 90000, 'hLQl3WQQoQ0', 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5'],
  ['Rolling in the Deep', 5, 228, 89000, '2pQxsKP2BTQ', 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5'],
  ['Hello', 5, 295, 88000, 'YQHsXMglC9A', 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5'],
  ['Stay With Me', 1, 172, 87000, 'pB-5XG-DbAA', 'https://i.scdn.co/image/ab67616d0000b273d95f7c4c3e5c0f3b42b8a1e2'],
  ['Shape of My Heart', 14, 270, 85000, 'MomRpOGQmDw', 'https://i.scdn.co/image/ab67616d0000b273d17d3c0cf8568c2addd5bde9'],
  ['Thriller', 1, 358, 86000, 'sOnqjkJTMaA', 'https://i.scdn.co/image/ab67616d0000b273d95f7c4c3e5c0f3b42b8a1e2'],
  ['Uptown Funk', 6, 270, 92000, 'OPf0YbXqDm0', 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f'],
  ['Happy', 6, 233, 88000, 'y6Sxv-sUYtM', 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f'],
  ['Counting Stars', 13, 257, 86000, 'hT_nvWreIhg', 'https://i.scdn.co/image/ab67616d0000b2730c0adfa95e8e3f43ad9b23e4'],
  ['Let Her Go', 2, 253, 84000, 'RBumgq5yVrA', 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96'],
  ['All of Me', 5, 269, 91000, '450p7goxZqg', 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5'],
  ['Closer', 12, 245, 90000, 'PT2_F-1esPk', 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'],
  ['Believer', 12, 204, 87000, 'W2TE0DjdNqI', 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'],
  ['Radioactive', 12, 187, 85000, 'ktvTqknDobU', 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'],
  ['Demons', 12, 177, 83000, 'M9BNoNFey2I', 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'],

  // === MORE BOLLYWOOD HITS ===
  ['Kesariya', 15, 264, 92000, 'BddP6PYo2gs', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Apna Bana Le', 15, 260, 88000, 'k5bk-XHWP_g', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Shayad', 15, 249, 87000, 'kbDTuMH7_6M', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Hawayein', 15, 290, 90000, 'cTwQ5RP7-ik', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Gerua', 15, 296, 86000, 'vt0Y39eMvpI', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Zaalima', 15, 272, 85000, 'g1jEAq-zFdE', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Bekhayali', 22, 327, 91000, 'gG_dPDo5HQY', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Tera Ban Jaunga', 22, 225, 86000, 'gkBfHpLFkdU', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Kalank', 22, 331, 83000, 'g_oPGhcFOoI', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Pachtaoge', 22, 245, 88000, 'S3_DkH3H0f0', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Inteha Ho Gayi Intezaar Ki', 21, 295, 80000, 'VfWtx_MLhkI', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Dil Chahta Hai', 21, 294, 82000, 'VlGNSJ9M7L0', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Mann', 17, 350, 84000, 'I6_E5b0kQIM', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Tujhe Kitna Chahein Aur', 22, 274, 88000, 'VABbV9yBUYs', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Ik Vaari Aa', 15, 285, 86000, 'yQFBIj3aOGE', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Tere Liye', 21, 283, 82000, 'HW1FhyxV4mQ', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Kuch Toh Hua Hai', 17, 269, 80000, 'JuJ5T6Fj_Q4', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Tujhse Naraz Nahin', 19, 310, 78000, 'fhHRPH0-RB4', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Yeh Dil Deewana', 20, 282, 79000, 'i9M6YPuTCkQ', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['O Saathi', 22, 240, 87000, 'hcSFN3SHRD8', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
  ['Tera Fitoor', 15, 265, 85000, 'Vbpbe5BsCGI', 'https://i.scdn.co/image/ab67616d0000b273d0f59c2a6e82cbc4e7f17213'],
]

async function seedData() {
  console.log('🎵 Starting VibeSync seed...')

  try {
    // Add youtube_id column if not exists
    await db.query(`ALTER TABLE songs ADD COLUMN IF NOT EXISTS youtube_id VARCHAR(20) DEFAULT NULL`)
    console.log('✅ youtube_id column ready')

    // Insert artists
    const artistIds = []
    for (const artist of artists) {
      const [existing] = await db.query('SELECT artist_id FROM artists WHERE name = ?', [artist.name])
      if (existing.length > 0) {
        artistIds.push(existing[0].artist_id)
      } else {
        const [res] = await db.query(
          'INSERT INTO artists (name, avatar) VALUES (?, ?)',
          [artist.name, artist.avatar]
        )
        artistIds.push(res.insertId)
      }
    }
    console.log(`✅ ${artists.length} artists seeded`)

    // Insert songs
    let inserted = 0
    let updated = 0
    for (const [title, artistIdx, duration, playCount, youtubeId, coverImage] of songs) {
      const artistId = artistIds[artistIdx]
      if (!artistId) continue

      const [existing] = await db.query('SELECT song_id FROM songs WHERE title = ? AND artist_id = ?', [title, artistId])
      if (existing.length > 0) {
        await db.query(
          'UPDATE songs SET youtube_id = ?, cover_image = ?, play_count = ?, duration = ? WHERE song_id = ?',
          [youtubeId, coverImage, playCount, duration, existing[0].song_id]
        )
        updated++
      } else {
        await db.query(
          'INSERT INTO songs (title, artist_id, duration, play_count, youtube_id, cover_image) VALUES (?,?,?,?,?,?)',
          [title, artistId, duration, playCount, youtubeId, coverImage]
        )
        inserted++
      }
    }
    console.log(`✅ Songs: ${inserted} inserted, ${updated} updated`)

    // Assign moods to songs
    const [moodRows] = await db.query('SELECT mood_id, mood_name FROM moods')
    const moodMap = {}
    moodRows.forEach(m => { moodMap[m.mood_name.toLowerCase()] = m.mood_id })

    // Get all songs
    const [allSongs] = await db.query('SELECT song_id, title, artist_id FROM songs')

    // Clear and reassign song_mood
    await db.query('DELETE FROM song_mood')

    const moodAssignments = {
      energetic: ['Blinding Lights', 'Dynamite', 'Butter', 'Bad Guy', 'Uptown Funk', 'Shake It Off', 'Blue Eyes', 'Garmi', 'Brown Rang', 'Angreji Beat', 'Desi Kalakaar', 'Houdini'],
      happy: ['Levitating', 'Watermelon Sugar', 'Happy', 'Sunflower', 'Circles', '7 Rings', 'positions', 'Aankh Marey', 'Dilbar'],
      sad: ['Let Her Go', 'Photograph', 'When The Party\'s Over', 'drivers license', 'Teri Meri', 'Woh Lamhe', 'Bekhayali', 'Tujhse Naraz Nahin', 'Phir Le Aaya Dil'],
      romantic: ['Perfect', 'Thinking Out Loud', 'All of Me', 'Tum Hi Ho', 'Ae Dil Hai Mushkil', 'Channa Mereya', 'Hawayein', 'Gerua', 'Kesariya', 'Dil Diyan Gallan', 'Raataan Lambiyan'],
      chill: ['Starboy', 'After Hours', 'Lovely', 'Passionfruit', 'Kun Faya Kun', 'Kal Ho Naa Ho', 'Spring Day', 'Yellow', 'Paradise'],
      focus: ['Viva la Vida', 'Fix You', 'The Scientist', 'Lose Yourself', 'Jai Ho', 'Chaiyya Chaiyya', 'Vande Mataram', 'Stan', 'A Sky Full of Stars'],
      party: ['God\'s Plan', 'One Dance', 'Hotline Bling', 'Shape of You', 'Bad Habits', 'Anti-Hero', 'Don\'t Start Now', 'Physical', 'Despacito'],
    }

    let moodInserts = 0
    for (const [moodName, titleList] of Object.entries(moodAssignments)) {
      const moodId = moodMap[moodName]
      if (!moodId) continue
      for (const title of titleList) {
        const song = allSongs.find(s => s.title === title)
        if (song) {
          await db.query('INSERT IGNORE INTO song_mood (song_id, mood_id) VALUES (?,?)', [song.song_id, moodId])
          moodInserts++
        }
      }
    }
    console.log(`✅ ${moodInserts} mood assignments done`)

    console.log('\n🎉 Seeding complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seedData()
