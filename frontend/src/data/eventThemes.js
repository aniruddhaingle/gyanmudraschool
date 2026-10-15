// Festival and event themes for the gallery album viewer.
// `detectEventTheme` picks one offline from what the admin types (English or Hindi) — no API keys needed.

const theme = (key, label, tag, keywords, look, words) => ({ key, label, tag, keywords, ...look, ...words });

const look = (palette, symbol, decor) => ({ palette, symbol, decor });

const palette = (bg, bg2, deep, glow1, glow2, accent, shadow, pop, text) => ({ bg, bg2, deep, glow1, glow2, accent, shadow, pop, text });

export const eventThemes = [
  theme("janmashtami", "Janmashtami", "FESTIVAL CELEBRATION",
    ["janmashtami", "janmastami", "krishna", "krishn", "gokulashtami", "dahi handi", "kanha", "radha krishna", "जन्माष्टमी", "कृष्ण", "कान्हा"],
    look(palette("#071f5b", "#142d75", "#071a4d", "rgba(34,139,170,.42)", "rgba(222,150,24,.3)", "#f6c84c", "#a34525", "#15a6b6", "#fff6d4"), "ॐ", ["✦", "❋", "✦", "🦚"]),
    { blessing: "॥ श्री कृष्णाय नमः ॥", heroLabel: "OUR LITTLE KRISHNAS & RADHAS",
      story: "With peacock feathers, flutes, flowers, and joyful hearts, our students celebrated the timeless spirit of Shri Krishna—through colour, costume, music, and togetherness.",
      note: "A joyful Janmashtami celebration filled with colourful costumes, Krishna-inspired performances, and beautiful student moments." }),

  theme("ganesh", "Ganesh Chaturthi", "FESTIVAL CELEBRATION",
    ["ganesh chaturthi", "ganesh", "ganesha", "ganpati", "ganapati", "vinayak", "vinayaka", "गणेश", "गणपति", "विनायक"],
    look(palette("#7a1f0e", "#a8321a", "#5a1608", "rgba(255,170,40,.35)", "rgba(255,90,60,.3)", "#ffc93c", "#3d0d05", "#2fbf71", "#fff3dc"), "ॐ", ["🌺", "✦", "🌼", "🪷"]),
    { blessing: "॥ गणपति बप्पा मोरया ॥", heroLabel: "BAPPA'S LITTLE DEVOTEES",
      story: "With modaks, marigolds, and heartfelt aartis, our school welcomed Ganpati Bappa—praying for wisdom, new beginnings, and a year free of obstacles.",
      note: "Our Ganesh Chaturthi celebration brought students together for aarti, decorations, devotional songs, and joyful festive moments." }),

  theme("diwali", "Diwali", "FESTIVAL CELEBRATION",
    ["diwali", "deepawali", "deepavali", "dipawali", "divali", "diya", "diyas", "festival of lights", "rangoli", "दीपावली", "दिवाली", "दीप"],
    look(palette("#1a0b2e", "#34124f", "#12071f", "rgba(255,170,0,.4)", "rgba(255,80,120,.25)", "#ffb703", "#9d0208", "#ff5d8f", "#fff4d6"), "दीप", ["🪔", "✨", "🪔", "🎆"]),
    { blessing: "॥ शुभ दीपावली ॥", heroLabel: "FESTIVAL OF LIGHTS",
      story: "Glowing diyas, bright rangolis, and smiling faces filled our campus as students celebrated the victory of light over darkness and kindness over everything.",
      note: "A bright Diwali celebration with diyas, rangoli, festive dress, and students sharing the joy of the festival of lights." }),

  theme("holi", "Holi", "FESTIVAL CELEBRATION",
    ["holi", "rangotsav", "festival of colours", "festival of colors", "gulal", "rang panchami", "होली", "रंग"],
    look(palette("#4b0f6b", "#c2185b", "#320848", "rgba(0,200,180,.45)", "rgba(255,210,0,.4)", "#ffe14d", "#00a6a6", "#ff6fb5", "#fff8fd"), "रंग", ["🎨", "✺", "💧", "🌈"]),
    { blessing: "॥ होली है! ॥", heroLabel: "A SPLASH OF COLOUR",
      story: "Pink, green, yellow, and a lot of laughter—our students celebrated Holi with safe colours, music, and the happiest kind of mess.",
      note: "A colourful Holi celebration full of gulal, laughter, music, and students enjoying the festival of colours together." }),

  theme("navratri", "Navratri", "FESTIVAL CELEBRATION",
    ["navratri", "navaratri", "navratra", "garba", "dandiya", "durga puja", "durga", "नवरात्रि", "गरबा", "डांडिया", "दुर्गा"],
    look(palette("#6d0f2c", "#a3164a", "#4a081d", "rgba(255,140,0,.4)", "rgba(255,215,0,.25)", "#ffcc33", "#2d0310", "#1fc8a9", "#fff1e6"), "शक्ति", ["🪔", "✦", "❋", "💃"]),
    { blessing: "॥ जय माता दी ॥", heroLabel: "GARBA NIGHTS",
      story: "Swirling chaniya cholis, clicking dandiya sticks, and devotion to Maa Durga—Navratri on campus was full of rhythm, colour, and togetherness.",
      note: "Navratri celebrations with garba, dandiya, traditional dress, and students dancing together in festive spirit." }),

  theme("dussehra", "Dussehra", "FESTIVAL CELEBRATION",
    ["dussehra", "dusshera", "dasara", "dussera", "dashehra", "vijayadashami", "vijaya dashami", "ravan dahan", "ravan", "ram leela", "ramleela", "दशहरा", "विजयादशमी", "रावण"],
    look(palette("#5c1a00", "#8f2d00", "#3d1100", "rgba(255,120,0,.45)", "rgba(255,200,60,.3)", "#ffd166", "#2b0a00", "#ef476f", "#fff3e0"), "विजय", ["🏹", "✦", "🔥", "❋"]),
    { blessing: "॥ विजयादशमी की शुभकामनाएँ ॥", heroLabel: "GOOD OVER EVIL",
      story: "Through Ram Leela scenes, stories, and celebration, our students marked Dussehra and the timeless victory of truth and courage.",
      note: "Our Dussehra celebration with Ram Leela performances, stories of courage, and students celebrating the victory of good over evil." }),

  theme("raksha-bandhan", "Raksha Bandhan", "FESTIVAL CELEBRATION",
    ["raksha bandhan", "rakshabandhan", "rakhi", "rakhee", "रक्षाबंधन", "रक्षा बंधन", "राखी"],
    look(palette("#5b1847", "#8e2a6b", "#3e0f30", "rgba(255,180,200,.35)", "rgba(255,200,80,.3)", "#ffd27a", "#2c0820", "#ff8fab", "#fff1f6"), "राखी", ["🎀", "✦", "💛", "❋"]),
    { blessing: "॥ रक्षाबंधन की शुभकामनाएँ ॥", heroLabel: "THREADS OF LOVE",
      story: "Handmade rakhis, sweet promises, and lots of smiles—our students celebrated the special bond of care and protection between brothers and sisters.",
      note: "A warm Raksha Bandhan celebration with handmade rakhis, sweets, and students celebrating the bond between siblings." }),

  theme("independence-day", "Independence Day", "NATIONAL CELEBRATION",
    ["independence day", "independence", "15 august", "15th august", "august 15", "swatantrata diwas", "azadi", "स्वतंत्रता दिवस", "स्वतंत्रता", "आज़ादी", "आजादी"],
    look(palette("#0b2a5b", "#123d7a", "#071c3f", "rgba(255,153,51,.4)", "rgba(19,136,8,.38)", "#ff9933", "#138808", "#ffffff", "#ffffff"), "☸", ["🇮🇳", "✦", "🕊️", "🪁"]),
    { blessing: "जय हिन्द · JAI HIND", heroLabel: "PROUD TO BE INDIAN",
      story: "Flag hoisting, the national anthem, patriotic songs, and proud young voices—our school celebrated the freedom earned by those who came before us.",
      note: "Independence Day celebration with flag hoisting, the national anthem, patriotic performances, and proud students in tricolour spirit." }),

  theme("republic-day", "Republic Day", "NATIONAL CELEBRATION",
    ["republic day", "26 january", "26th january", "january 26", "gantantra diwas", "गणतंत्र दिवस", "गणतंत्र"],
    look(palette("#08254d", "#0f3b73", "#051a38", "rgba(255,153,51,.38)", "rgba(19,136,8,.38)", "#ff9933", "#138808", "#ffffff", "#ffffff"), "☸", ["🇮🇳", "✦", "🎖️", "🕊️"]),
    { blessing: "जय हिन्द · 26 JANUARY", heroLabel: "OUR CONSTITUTION, OUR PRIDE",
      story: "With the tricolour flying high, our students honoured the Constitution through parade, speeches, and performances full of pride.",
      note: "Republic Day celebration with flag hoisting, parade, speeches on our Constitution, and patriotic performances by students." }),

  theme("sankranti", "Makar Sankranti", "FESTIVAL CELEBRATION",
    ["makar sankranti", "sankranti", "sankrant", "uttarayan", "uttarayana", "kite", "kites", "pongal", "lohri", "मकर संक्रांति", "संक्रांति", "पतंग"],
    look(palette("#0a4d8c", "#1976d2", "#063a6b", "rgba(255,230,0,.4)", "rgba(255,100,100,.3)", "#ffeb3b", "#e65100", "#ff4081", "#f3fbff"), "☀", ["🪁", "☀️", "🪁", "✦"]),
    { blessing: "॥ मकर संक्रांति की शुभकामनाएँ ॥", heroLabel: "SKY FULL OF KITES",
      story: "Bright kites, til-gud sweets, and a sky full of colour—our students welcomed the harvest season and the sun's new journey with joy.",
      note: "Makar Sankranti celebration with kite flying, til-gud sweets, and students enjoying the festival of the harvest sun." }),

  theme("christmas", "Christmas", "FESTIVAL CELEBRATION",
    ["christmas", "xmas", "x-mas", "santa", "carol", "carols", "क्रिसमस"],
    look(palette("#0f3d2e", "#14523d", "#0a2b20", "rgba(255,255,255,.15)", "rgba(220,40,40,.35)", "#ffd54f", "#b71c1c", "#ef5350", "#fbfff8"), "❄", ["🎄", "❄️", "⭐", "🎁"]),
    { blessing: "MERRY CHRISTMAS", heroLabel: "JOY TO THE WORLD",
      story: "Carols, stars, a decorated tree, and a surprise visit from Santa—our campus was filled with the warmth of sharing and giving.",
      note: "A cheerful Christmas celebration with carols, decorations, Santa, and students sharing the spirit of giving." }),

  theme("eid", "Eid", "FESTIVAL CELEBRATION",
    ["eid", "eid ul fitr", "eid-ul-fitr", "eid ul adha", "bakrid", "bakri eid", "ramzan", "ramadan", "ईद", "रमज़ान", "रमजान"],
    look(palette("#0b3d3a", "#0f5753", "#072b29", "rgba(255,215,120,.3)", "rgba(80,200,180,.3)", "#f4d58d", "#6b4e16", "#7ee0c3", "#f8fff9"), "☪", ["🌙", "✦", "⭐", "🏮"]),
    { blessing: "ईद मुबारक · EID MUBARAK", heroLabel: "SHARING JOY",
      story: "Under the crescent moon's glow, our students celebrated Eid with greetings, sweets, and the beautiful spirit of kindness and togetherness.",
      note: "Eid celebration with warm greetings, sweets, festive dress, and students sharing the joy of togetherness." }),

  theme("teachers-day", "Teachers' Day", "SCHOOL CELEBRATION",
    ["teachers day", "teacher's day", "teachers' day", "shikshak diwas", "guru purnima", "gurupurnima", "शिक्षक दिवस", "गुरु पूर्णिमा", "शिक्षक"],
    look(palette("#2b2d6e", "#3f43a3", "#1d1f4f", "rgba(255,200,90,.35)", "rgba(120,200,255,.3)", "#ffd166", "#ef476f", "#06d6a0", "#f7f7ff"), "गुरु", ["📚", "✏️", "🍎", "✦"]),
    { blessing: "THANK YOU, TEACHERS", heroLabel: "OUR GUIDING LIGHTS",
      story: "Cards, speeches, performances, and a whole lot of gratitude—our students honoured the teachers who guide them every single day.",
      note: "Teachers' Day celebration where students honoured their teachers with cards, speeches, performances, and heartfelt thanks." }),

  theme("childrens-day", "Children's Day", "SCHOOL CELEBRATION",
    ["children's day", "childrens day", "children day", "bal diwas", "14 november", "बाल दिवस"],
    look(palette("#0d6e6e", "#1597a5", "#08504f", "rgba(255,224,102,.4)", "rgba(255,92,138,.3)", "#ffe066", "#ff5c8a", "#b388ff", "#ffffff"), "बाल", ["🎈", "🌹", "🎈", "✦"]),
    { blessing: "HAPPY CHILDREN'S DAY", heroLabel: "LITTLE STARS",
      story: "Games, surprises, and teachers performing just for them—our students had a day that was all about their curiosity, joy, and imagination.",
      note: "A fun Children's Day full of games, surprises, and performances celebrating every child in our school." }),

  theme("yoga-day", "Yoga Day", "WELLNESS",
    ["yoga day", "international yoga day", "yoga", "21 june", "योग दिवस", "योग"],
    look(palette("#1b4332", "#2d6a4f", "#10291f", "rgba(255,183,3,.3)", "rgba(149,213,178,.3)", "#ffd166", "#081c15", "#95d5b2", "#f1faee"), "ॐ", ["🧘", "☀️", "🍃", "✦"]),
    { blessing: "॥ योग: कर्मसु कौशलम् ॥", heroLabel: "MIND, BODY, BALANCE",
      story: "Calm breaths, steady poses, and a peaceful morning—our students practised yoga together for a healthier body and a happier mind.",
      note: "International Yoga Day session where students practised asanas and breathing together for health and calm." }),

  theme("sports-day", "Sports Day", "SPORTS",
    ["sports day", "sports meet", "sports", "annual sports", "athletics", "race", "relay", "tournament", "match", "cricket", "football", "kabaddi", "kho kho", "kho-kho", "khel", "खेल दिवस", "खेल", "क्रीड़ा"],
    look(palette("#0d1b4c", "#1e3a8a", "#08123a", "rgba(0,229,255,.35)", "rgba(255,61,0,.3)", "#ffea00", "#ff3d00", "#00e5ff", "#ffffff"), "★", ["🏆", "⚽", "🏅", "🏃"]),
    { blessing: "ON YOUR MARKS · GET SET · GO!", heroLabel: "CHAMPIONS IN THE MAKING",
      story: "Races, relays, cheering houses, and proud podium moments—our students showed teamwork, grit, and true sportsmanship.",
      note: "Sports Day with races, relays, team games, and students cheering each other on with great sportsmanship." }),

  theme("annual-day", "Annual Day", "SCHOOL EVENT",
    ["annual day", "annual function", "annual fest", "annual celebration", "cultural program", "cultural programme", "cultural", "talent show", "dance", "drama", "वार्षिकोत्सव", "वार्षिक उत्सव", "सांस्कृतिक"],
    look(palette("#3a0ca3", "#560bad", "#240046", "rgba(247,37,133,.4)", "rgba(76,201,240,.35)", "#ffd60a", "#f72585", "#4cc9f0", "#ffffff"), "✦", ["🎭", "🎤", "✨", "🎶"]),
    { blessing: "LIGHTS · CAMERA · APPLAUSE", heroLabel: "STARS ON STAGE",
      story: "Dances, dramas, songs, and nervous-but-brave smiles—our students lit up the stage and made their families proud.",
      note: "Our Annual Day with dance, drama, music, and award moments as students showcased their talents on stage." }),

  theme("science", "Science Exhibition", "LEARNING",
    ["science exhibition", "science fair", "science day", "science", "exhibition", "project", "projects", "model", "models", "experiment", "stem", "robotics", "विज्ञान प्रदर्शनी", "विज्ञान", "प्रदर्शनी"],
    look(palette("#0b2545", "#13315c", "#071a33", "rgba(0,255,200,.3)", "rgba(140,100,255,.35)", "#64ffda", "#7c4dff", "#ffd166", "#eef6ff"), "⚛", ["🔬", "🧪", "⚛️", "💡"]),
    { blessing: "CURIOUS MINDS AT WORK", heroLabel: "LITTLE SCIENTISTS",
      story: "Working models, bubbling experiments, and confident explanations—our students turned questions into discoveries.",
      note: "Science exhibition where students presented working models, experiments, and projects with curiosity and confidence." }),

  theme("trip", "School Trip", "OUTING",
    ["trip", "excursion", "picnic", "tour", "field trip", "field visit", "educational visit", "visit", "outing", "पिकनिक", "भ्रमण", "यात्रा"],
    look(palette("#014f86", "#2a6f97", "#01395f", "rgba(255,214,10,.35)", "rgba(128,237,153,.3)", "#ffd60a", "#013a63", "#80ed99", "#f0fbff"), "✈", ["🚌", "🌳", "📸", "🗺️"]),
    { blessing: "LEARNING BEYOND THE CLASSROOM", heroLabel: "ADVENTURE DAY",
      story: "New places, new questions, and memories made together—our students explored the world beyond the classroom walls.",
      note: "A school trip where students explored, learned, and made happy memories together outside the classroom." }),

  theme("farewell", "Farewell", "SCHOOL EVENT",
    ["farewell", "graduation", "convocation", "send off", "send-off", "विदाई"],
    look(palette("#3c1642", "#5c2a68", "#2a0e2f", "rgba(255,209,102,.35)", "rgba(255,143,171,.3)", "#ffd166", "#1b0820", "#ff8fab", "#fff7fb"), "✦", ["🎓", "✨", "💐", "🎉"]),
    { blessing: "ALL THE BEST FOR WHAT'S NEXT", heroLabel: "FOREVER GYAN MUDRA",
      story: "Speeches, hugs, and a few happy tears—we said goodbye to our seniors and wished them the brightest future.",
      note: "Farewell celebration for our seniors with speeches, performances, and heartfelt wishes for their future." }),

  theme("general", "School Moment", "SCHOOL MOMENT",
    [],
    look(palette("#18203a", "#2b3566", "#111729", "rgba(91,53,213,.45)", "rgba(0,201,183,.3)", "#ffcf3f", "#ff5c8a", "#00c9b7", "#fffdf6"), "✦", ["✦", "❋", "✦", "📸"]),
    { blessing: "GYAN MUDRA ACADEMY", heroLabel: "SCHOOL MEMORIES",
      story: "Every day at Gyan Mudra holds a little story—of learning, friendship, and moments worth remembering.",
      note: "A special day at Gyan Mudra Academy full of learning, friendship, and happy student moments." })
];

const themesByKey = new Map(eventThemes.map((item) => [item.key, item]));
export const fallbackTheme = themesByKey.get("general");

export function getEventTheme(key) {
  return themesByKey.get(key) || fallbackTheme;
}

// Saved theme if the admin picked one, otherwise detect it from the event text.
export function resolveTheme(event) {
  return event.theme ? getEventTheme(event.theme) : detectEventTheme(event);
}

const isLatin = (word) => /^[\x20-\x7e]+$/.test(word);
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Whole-word matching for English so "holiday" does not count as "holi"; Hindi words match as written.
const matchers = eventThemes.map((item) => ({
  item,
  keywords: item.keywords.map((word) => ({
    weight: word.split(" ").length + word.length / 20,
    test: isLatin(word) ? new RegExp(`(^|[^a-z0-9])${escapeRegExp(word)}(?=$|[^a-z0-9])`) : { test: (text) => text.includes(word) }
  }))
}));

const normalise = (text = "") => String(text).toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, " ");

// The event name counts most, then the category, then the story.
export function detectEventTheme({ title = "", tag = "", note = "" } = {}) {
  const fields = [[normalise(title), 3], [normalise(tag), 1.5], [normalise(note), 1]];
  let best = { item: fallbackTheme, score: 0 };

  for (const { item, keywords } of matchers) {
    let score = 0;
    for (const [text, fieldWeight] of fields) {
      if (!text) continue;
      for (const keyword of keywords) {
        if (keyword.test.test(text)) score += keyword.weight * fieldWeight;
      }
    }
    if (score > best.score) best = { item, score };
  }

  return best.item;
}

export function themeStyle(item) {
  const { palette: p } = item;
  return {
    "--fx-bg": p.bg, "--fx-bg2": p.bg2, "--fx-deep": p.deep, "--fx-glow1": p.glow1, "--fx-glow2": p.glow2,
    "--fx-accent": p.accent, "--fx-shadow": p.shadow, "--fx-pop": p.pop, "--fx-text": p.text,
    "--fx-symbol": JSON.stringify(item.symbol)
  };
}
