// Lorem Ipsum Generator

const LOREM_WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip',
  'ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate',
  'velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat',
  'non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum',
];

export interface LoremOptions {
  count: number;
  unit: 'paragraphs' | 'sentences' | 'words';
  startWithLorem: boolean;
}

export function generateLorem(options: LoremOptions): string {
  const { count, unit, startWithLorem } = options;
  if (count <= 0) return '';

  switch (unit) {
    case 'words':
      return generateWords(count, startWithLorem);
    case 'sentences':
      return Array.from({ length: count }, (_, i) => generateSentence(startWithLorem && i === 0)).join(' ');
    case 'paragraphs':
      return Array.from({ length: count }, (_, i) => generateParagraph(startWithLorem && i === 0)).join('\n\n');
  }
}

function generateWords(count: number, startWithLorem: boolean): string {
  if (startWithLorem && count >= 2) {
    return ['lorem', 'ipsum', ...pickRandom(count - 2)].join(' ');
  }
  return pickRandom(count).join(' ');
}

function pickRandom(count: number): string[] {
  return Array.from({ length: count }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
}

function generateSentence(startWithLorem: boolean): string {
  const length = 8 + Math.floor(Math.random() * 12); // 8-19 words
  const words: string[] = [];
  if (startWithLorem) {
    words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    while (words.length < length) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
  } else {
    for (let i = 0; i < length; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
  }
  const first = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return first + ' ' + words.slice(1).join(' ') + '.';
}

function generateParagraph(startWithLorem: boolean): string {
  const sentences = 4 + Math.floor(Math.random() * 4); // 4-7 sentences
  return Array.from({ length: sentences }, (_, i) => generateSentence(startWithLorem && i === 0)).join(' ');
}
