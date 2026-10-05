/**
 * Thai Buddhist Era (พ.ศ.) Date Utilities for New RMS 2026
 */

export const THAI_DAYS = [
  "วันอาทิตย์",
  "วันจันทร์",
  "วันอังคาร",
  "วันพุธ",
  "วันพฤหัสบดี",
  "วันศุกร์",
  "วันเสาร์",
];

export const THAI_MONTHS_FULL = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export const THAI_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export interface FormatThaiDateOptions {
  showDayOfWeek?: boolean;
  format?: "full" | "short";
  includePrefix?: boolean; // เช่น "วันที่ 5"
}

export function formatThaiDate(
  dateInput: string | Date | number | undefined | null,
  options?: FormatThaiDateOptions
): string {
  if (!dateInput) return "";

  let d: Date;
  if (typeof dateInput === "string") {
    // If format is YYYY-MM-DD
    const parts = dateInput.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      d = new Date(year, month, day);
    } else {
      d = new Date(dateInput);
    }
  } else {
    d = new Date(dateInput);
  }

  if (isNaN(d.getTime())) return String(dateInput);

  const dayOfWeek = THAI_DAYS[d.getDay()];
  const day = d.getDate();
  const month =
    options?.format === "short"
      ? THAI_MONTHS_SHORT[d.getMonth()]
      : THAI_MONTHS_FULL[d.getMonth()];
  const thaiYear = d.getFullYear() + 543;

  if (options?.showDayOfWeek) {
    return `${dayOfWeek}ที่ ${day} ${month} พ.ศ. ${thaiYear}`;
  }

  if (options?.includePrefix) {
    return `วันที่ ${day} ${month} ${thaiYear}`;
  }

  return `${day} ${month} ${thaiYear}`;
}

/**
 * Returns current date in Thai format
 * e.g. "วันจันทร์ที่ 5 ตุลาคม 2569"
 */
export function getCurrentThaiDate(): string {
  return formatThaiDate(new Date(), { showDayOfWeek: true });
}
