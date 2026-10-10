// Each category gets its own glow so the grid reads like a shelf of different lines.
export const CATEGORY_COLORS = {
  Original: '#a3ff12',
  'Zero Sugar': '#e9edf2',
  Juice: '#ff8a1f',
  Tea: '#ffd23f',
  Coffee: '#c8885a',
  Sport: '#2fc8ff',
  Reserve: '#ff4f7b',
  Punch: '#ff3df2',
  'Special Edition': '#9b6bff',
  Nitro: '#7df9ff',
  'Blind Lemon': '#fff36b',
};

export const categoryColor = (cat) => CATEGORY_COLORS[cat] ?? '#a3ff12';

export const COUNTRY_FLAGS = { USA: '🇺🇸', UK: '🇬🇧', Italy: '🇮🇹', Japan: '🇯🇵' };

export const COLLECTION_START = new Date('2018-04-01T00:00:00');

export function scoreLabel(score) {
  if (score == null) return 'Nessun voto';
  if (score >= 9) return 'Leggendaria';
  if (score >= 8) return 'Top';
  if (score >= 7) return 'Buonissima';
  if (score >= 6) return 'Promossa';
  if (score >= 5) return 'Così così';
  if (score >= 3) return 'Bocciata';
  return 'Imbevibile';
}
