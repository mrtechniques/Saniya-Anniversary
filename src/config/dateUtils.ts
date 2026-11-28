const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface ParsedDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

/**
 * Parses an ISO date string (YYYY-MM-DD) without timezone shifting.
 */
export function parseISODate(iso: string): ParsedDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return null;
  const maxDay = daysInMonth(year, month);
  if (day < 1 || day > maxDay) return null;
  return { year, month, day };
}

export function formatReadableDate(iso: string): string {
  const parsed = parseISODate(iso);
  if (!parsed) return iso;
  return `${parsed.day} ${MONTH_NAMES[parsed.month - 1]} ${parsed.year}`;
}

export function formatShortDate(iso: string): string {
  const parsed = parseISODate(iso);
  if (!parsed) return iso;
  const dd = String(parsed.day).padStart(2, '0');
  const mm = String(parsed.month).padStart(2, '0');
  return `${dd}.${mm}.${parsed.year}`;
}

/**
 * Computes the anniversary date for a given anniversary number (e.g. 1 = 1st anniversary),
 * clamping Feb 29 to Feb 28 in non-leap years.
 */
export function getAnniversaryDateISO(weddingDateISO: string, anniversaryNumber: number): string {
  const parsed = parseISODate(weddingDateISO);
  if (!parsed) return weddingDateISO;
  const targetYear = parsed.year + Math.max(1, Math.floor(anniversaryNumber));
  const maxDay = daysInMonth(targetYear, parsed.month);
  const clampedDay = Math.min(parsed.day, maxDay);
  const mm = String(parsed.month).padStart(2, '0');
  const dd = String(clampedDay).padStart(2, '0');
  return `${targetYear}-${mm}-${dd}`;
}

/**
 * Calculates the current/upcoming anniversary number from the wedding date relative to a reference date.
 * Returns at least 1 for the 1st anniversary milestone.
 */
export function calculateAnniversaryNumber(
  weddingDateISO: string,
  referenceDate: Date = new Date(),
): number {
  const parsed = parseISODate(weddingDateISO);
  if (!parsed) return 1;

  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth() + 1;
  const refDay = referenceDate.getDate();

  let yearsElapsed = refYear - parsed.year;
  const maxDayInRefYear = daysInMonth(refYear, parsed.month);
  const effectiveWeddingDay = Math.min(parsed.day, maxDayInRefYear);

  if (refMonth < parsed.month || (refMonth === parsed.month && refDay < effectiveWeddingDay)) {
    yearsElapsed -= 1;
  }

  return Math.max(1, yearsElapsed);
}

export function formatOrdinal(n: number): string {
  const abs = Math.abs(Math.floor(n));
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${abs}th`;
  switch (abs % 10) {
    case 1:
      return `${abs}st`;
    case 2:
      return `${abs}nd`;
    case 3:
      return `${abs}rd`;
    default:
      return `${abs}th`;
  }
}

export function formatOrdinalWord(n: number): string {
  const words: Record<number, string> = {
    1: 'First',
    2: 'Second',
    3: 'Third',
    4: 'Fourth',
    5: 'Fifth',
    6: 'Sixth',
    7: 'Seventh',
    8: 'Eighth',
    9: 'Ninth',
    10: 'Tenth',
  };
  return words[n] ?? formatOrdinal(n);
}
