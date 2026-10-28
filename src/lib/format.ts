const kzt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

export const formatKzt = (value: number) => `${kzt.format(value)} ₸`;

export function pluralRu(n: number, forms: [one: string, few: string, many: string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export const formatWorkDays = (n: number) => `${n} ${pluralRu(n, ["рабочий день", "рабочих дня", "рабочих дней"])}`;
