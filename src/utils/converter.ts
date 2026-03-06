
// ==========================================
// COMPREHENSIVE SINGLISH & LEGACY CONVERTER
// ==========================================

// ------------------------------------------
// 1. SINGLISH TO UNICODE (PHONETIC)
// ------------------------------------------

const vowels: Record<string, string> = {
  'aa': 'ආ', 'a': 'අ', 'A': 'අ', 'AA': 'ආ',
  'ae': 'ඇ', 'aae': 'ෑ', 'AE': 'ඇ', 'AAE': 'ෑ',
  'ii': 'ඊ', 'i': 'ඉ', 'I': 'ඉ', 'II': 'ඊ',
  'uu': 'ඌ', 'u': 'උ', 'U': 'උ', 'UU': 'ඌ',
  'ee': 'ී', 'e': 'එ', 'E': 'එ', 'EE': 'ී', // ee -> ී (Long i)
  'ea': 'ඒ', 'EA': 'ඒ', // ea -> ඒ
  'oo': 'ඕ', 'o': 'ඔ', 'O': 'ඔ', 'OO': 'ඕ', // oo -> ඕ (Long o)
  'oe': 'ඕ', 'OE': 'ඕ', // oe -> ඕ
  'au': 'ඖ', 'ai': 'ඓ', 'AU': 'ඖ', 'AI': 'ඓ',
  'ru': 'ඍ', 'ruu': 'ඎ'
};

const vowelModifiers: Record<string, string> = {
  'aa': 'ා', 'a': '', 
  'ae': 'ැ', 'aae': 'ෑ',
  'ii': 'ී', 'i': 'ි',
  'uu': 'ූ', 'u': 'ු',
  'ee': 'ී', 'e': 'ෙ', // ee -> ී
  'ea': 'ේ', // ea -> ේ
  'oo': 'ෝ', 'o': 'ො', // oo -> ෝ
  'oe': 'ෝ', // oe -> ෝ
  'au': 'ෞ', 'ai': 'ෛ',
  'ru': 'ෘ', 'ruu': 'ෲ'
};

const consonants: Record<string, string> = {
  'nnd': 'ඳ', 'nng': 'ඥ', 'nngg': 'ඟ',
  'ksh': 'ක්ෂ', 'Ksh': 'ක්ෂ', 'KSH': 'ක්ෂ', // Special cluster
  'ch': 'ච', 'chh': 'ඡ', 'Ch': 'ච', 'CH': 'ච',
  'gn': 'ඥ', 'kn': 'ඤ', 'ny': 'ඤ', 'Gn': 'ඥ', 'Kn': 'ඤ',
  'th': 'ත', 'dh': 'ධ', 'Th': 'ත', 'Dh': 'ධ', 'TH': 'ඨ', 'DH': 'ඪ', // Capitalized Th/Dh = Dental. ALL CAPS = Retroflex.
  'sh': 'ශ', 'Sh': 'ශ', 'SH': 'ෂ', // Sh -> ශ, SH -> ෂ
  'ph': 'ඵ', 'bh': 'භ', 'Ph': 'ඵ', 'Bh': 'භ',
  'kh': 'ඛ', 'gh': 'ඝ', 'Kh': 'ඛ', 'Gh': 'ඝ',
  'wh': 'ව', 
  
  // Single chars
  'ck': 'ක', 'c': 'ක', 'C': 'ක',
  'q': 'ක', 'Q': 'ක',
  'z': 'ස', 'Z': 'ස',
  'k': 'ක', 'g': 'ග', 'K': 'ක', 'G': 'ග',
  't': 'ට', 'd': 'ද', 'T': 'ට', 'D': 'ඩ', // t=ට (Retroflex), d=ද (Dental) - Common Singlish pattern
  'n': 'න', 'N': 'ණ', // N is ණ
  'p': 'ප', 'b': 'බ', 'm': 'ම', 'P': 'ප', 'B': 'බ', 'M': 'ම',
  'y': 'ය', 'r': 'ර', 'l': 'ල', 'Y': 'ය', 'R': 'ර', 'L': 'ල', // L -> ල (Capital L was ළ, but changed for sentence start)
  'v': 'ව', 'w': 'ව', 'V': 'ව', 'W': 'ව',
  's': 'ස', 'h': 'හ', 'S': 'ස', 'H': 'හ',
  'f': 'ෆ', 'F': 'ෆ',
  'j': 'ජ', 'J': 'ජ',
  'x': 'ං', 'X': 'ං',
  'LL': 'ළ' // Double L for ළ?
};

// Helper to detect if a character is a vowel
const isVowel = (char: string) => {
  return ['a', 'e', 'i', 'o', 'u'].includes(char?.toLowerCase());
};

export const singlishToUnicode = (text: string): string => {
  let res = '';
  let i = 0;

  while (i < text.length) {
    let match = false;

    // 1. Check for Consonants (Longest first)
    const sortedConsonants = Object.keys(consonants).sort((a, b) => b.length - a.length);
    
    for (const con of sortedConsonants) {
      if (text.substr(i).startsWith(con)) {
        // Found a consonant!
        const unicodeConsonant = consonants[con];
        let consumed = con.length;
        
        // --- Rakaaransaya & Yansaya Logic ---
        let isRakara = false;
        let isYansaya = false;
        
        // Check Rakaaransaya (consonant + r + vowel)
        if (text.substr(i + consumed).startsWith('r')) {
           const afterR = text.substr(i + consumed + 1, 1);
           if (isVowel(afterR)) {
             // It is likely Rakaaransaya OR 'ru' (kru -> කෘ)
             if (afterR === 'u') {
               // kru -> කෘ (handled by vowel modifier 'ru' below?)
             } else {
               isRakara = true;
               consumed++; // consume 'r'
             }
           }
        }
        
        // Check Yansaya (consonant + y + vowel)
        else if (text.substr(i + consumed).startsWith('y')) {
           const afterY = text.substr(i + consumed + 1, 1);
           if (isVowel(afterY)) {
             isYansaya = true;
             consumed++; // consume 'y'
           }
        }

        // --- Vowel Modifiers ---
        const sortedModifiers = Object.keys(vowelModifiers).sort((a, b) => b.length - a.length);
        let vowelFound = false;
        let modifier = '';

        for (const vow of sortedModifiers) {
          if (text.substr(i + consumed).startsWith(vow)) {
            modifier = vowelModifiers[vow];
            consumed += vow.length;
            vowelFound = true;
            break;
          }
        }

        // Construct the character
        res += unicodeConsonant;
        
        if (isRakara) {
          res += '්‍ර'; // Rakaaransaya
        } else if (isYansaya) {
          res += '්‍ය'; // Yansaya
        }

        if (vowelFound) {
          res += modifier;
        } else {
          // No vowel found -> Hal Kireema
          res += '්';
        }

        i += consumed;
        match = true;
        break;
      }
    }

    if (match) continue;

    // 2. Check for Standalone Vowels
    const sortedVowels = Object.keys(vowels).sort((a, b) => b.length - a.length);
    for (const vow of sortedVowels) {
      if (text.substr(i).startsWith(vow)) {
        res += vowels[vow];
        i += vow.length;
        match = true;
        break;
      }
    }

    if (match) continue;

    // 3. Special Punctuation / Fallback
    if (text[i] === '.') {
      res += '.';
    } else {
      res += text[i];
    }
    i++;
  }

  return res;
};


// ------------------------------------------
// 2. UNICODE TO LEGACY (FM ABHAYA)
// ------------------------------------------

const legacyMap: Record<string, string> = {
  // Consonants
  'ක': 'l', 'ඛ': 'L', 'ග': '.','ඝ': '>', 'ඟ': '.', 'ඥ': 'Z',
  'ච': 'p', 'ඡ': 'P', 'ජ': 'c', 'ඣ': 'C', 'ඤ': 'Z',
  'ට': 'g', 'ඨ': 'G', 'ඩ': 'v', 'ඪ': 'V', 'ණ': 'K', 'ඬ': 'V',
  'ත': ';','ථ': ':', 'ද': 'o', 'ධ': 'O', 'න': 'k', 'ඳ': 'o',
  'ප': 'm', 'ඵ': 'M', 'බ': 'n', 'භ': 'N', 'ම': 'u', 'ඹ': 'U',
  'ය': 'h', 'ර': 'r', 'ල': ',', 'ළ': 'e', 'ව': 'j',
  'ශ': 'Y', 'ෂ': 'I', 'ස': 'i', 'හ': 'y', 'ෆ': 'f', 'ළ': 'e', 'ළු': '¿',
  'අ': 'w', 'ආ': 'wd', 'ඇ': 'WE', 'ඈ': 'WEE', 'ඉ': 'b', 'ඊ': 'B', 'උ': 'W', 'ඌ': 'Wc',
  'එ': 't', 'ඒ': 'ta', 'ඔ': 'T', 'ඕ': 'Ta', 'ඖ': 'Wew', 'ඓ': 'ff',
  'ං': 'x', 'ඃ': 'H', '්': 'a'
};

const matraLegacy: Record<string, string> = {
  'ා': 'd',
  'ැ': 'E',
  'ෑ': 'EE',
  'ි': 'b',
  'ී': 'B',
  'ු': 'q',
  'ූ': 'Q',
  'ෘ': 'D',
  'ෲ': 'DD',
  // Kombuwa parts are handled via logic
};

export const unicodeToLegacy = (text: string): string => {
  let res = '';
  const chars = text.split('');

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const next = chars[i+1];
    const next2 = chars[i+2];

    // 1. Handle Rephaya (ර් + Consonant) -> (Consonant + Rephaya Glyph)
    // In Unicode: ර් + ක (r + hal + ka) -> r + a + l (in legacy keys)
    // But usually Rephaya is a modifier.
    // Let's implement basic Rephaya: If 'ර්' is followed by a consonant.
    if (char === 'ර' && next === '්' && next2 && legacyMap[next2]) {
       // Found Rephaya!
       // In FM Abhaya, Rephaya is usually typed AFTER the consonant? Or BEFORE?
       // Actually, standard Wijesekara is Option+r (Rephaya) THEN Consonant.
       // But in legacy fonts, the glyph is positioned above.
       // Let's map it to 'Z' + Consonant? (Z is usually ඤ).
       // Rephaya key is usually 'r' + 'a' (hal) in Unicode.
       // In Legacy, it's a specific key. Let's assume it's 'S' (Shift+S is sometimes Rephaya).
       // Or let's just output 'r' + 'a' + consonant for now if we are unsure of the exact key code for Rephaya in FM Abhaya.
       // Actually, let's skip Rephaya special handling to avoid breaking 'r' + 'hal'.
    }

    // 2. Handle Kombuwa (ෙ) Pre-positioning
    // Unicode: ක + ෙ (ke)
    // Legacy: ෙ + ක (f + l)
    
    // We need to detect if the NEXT char is a Kombuwa-based vowel
    const kombuwa = ['ෙ', 'ේ', 'ො', 'ෝ', 'ෞ', 'ෛ'];
    
    if (next && kombuwa.includes(next)) {
      // It is a kombuwa!
      // Output the kombuwa part FIRST.
      
      const consChar = legacyMap[char] || char;
      
      if (next === 'ෙ') {
        res += 'f' + consChar;
      } else if (next === 'ේ') {
        res += 'f' + consChar + 'a'; // f + cons + a (hal)
      } else if (next === 'ො') {
        res += 'f' + consChar + 'd'; // f + cons + d (alapilla)
      } else if (next === 'ෝ') {
        res += 'f' + consChar + 'da'; // f + cons + da
      } else if (next === 'ෞ') {
        res += 'f' + consChar + 'ow'; // f + cons + ow
      } else if (next === 'ෛ') {
        res += 'ff' + consChar; // ff + cons
      }
      
      i++; // Skip the modifier
      continue;
    }

    // 3. Handle Rakaaransaya (්‍ර)
    // Unicode: ක + ්‍ර
    // Legacy: ක + ්‍ර (glyph). 
    // In FM Abhaya, Rakaaransaya is usually a separate key (Shift+R?).
    // Let's assume 'S' or similar.
    if (next === '්‍ර') {
       res += (legacyMap[char] || char) + 'S'; // 'S' is a placeholder for Rakaaransaya glyph
       i++;
       continue;
    }
    
    // 4. Handle Yansaya (්‍ය)
    // Unicode: ක + ්‍ය
    // Legacy: ක + ්‍ය (glyph). Usually Shift+H?
    if (next === '්‍ය') {
       res += (legacyMap[char] || char) + 'w'; // 'w' or similar?
       i++;
       continue;
    }

    // 5. Normal Mapping
    // Check if it's a modifier
    if (matraLegacy[char]) {
      res += matraLegacy[char];
    } else {
      res += legacyMap[char] || char;
    }
  }

  return res;
};
