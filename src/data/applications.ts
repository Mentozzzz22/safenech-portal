export type Stage = "new" | "docs" | "review" | "offer" | "paid" | "work";
export type CheckStatus = "ok" | "warn" | "missing";

export interface DocCheck {
  doc: string;
  status: CheckStatus;
  note: string;
}

export interface Application {
  id: string;
  serviceSlug: string;
  company: string;
  contact: string;
  city: string;
  stage: Stage;
  createdAt: string;
  estimate: number;
  checks: DocCheck[];
  extracted: { label: string; value: string }[];
}

export const stages: { id: Stage; title: string }[] = [
  { id: "new", title: "Новые" },
  { id: "docs", title: "Сбор документов" },
  { id: "review", title: "AI-проверка готова" },
  { id: "offer", title: "КП отправлено" },
  { id: "paid", title: "Оплачено" },
  { id: "work", title: "В работе" },
];

export const applications: Application[] = [
  {
    id: "APP-1042",
    serviceSlug: "scrap-metal",
    company: "ТОО «Ferrum Trade»",
    contact: "Ержан С.",
    city: "Караганда",
    stage: "review",
    createdAt: "28.10.2026",
    estimate: 1_503_250,
    checks: [
      { doc: "Договор аренды базы", status: "ok", note: "Срок до 31.12.2028, арендатор совпадает с БИН заявителя" },
      { doc: "Акт на земельный участок", status: "ok", note: "Подъездные пути указаны" },
      { doc: "Сертификат поверки весов", status: "warn", note: "Поверка истекает 12.11.2026, нужно продлить до подачи" },
      { doc: "Сертификат поверки дозиметра", status: "ok", note: "Действителен до 03.2027" },
      { doc: "Договор дозиметрического контроля", status: "missing", note: "Клиент не прислал, отметил «есть»" },
      { doc: "Техпаспорт транспорта", status: "ok", note: "КамАЗ 65115, собственность" },
    ],
    extracted: [
      { label: "Адрес базы", value: "г. Караганда, ул. Складская, 14" },
      { label: "Координаты", value: "49.8028, 73.1021" },
      { label: "Площадь базы", value: "4 200 м²" },
      { label: "Арендодатель", value: "ИП «Абенов»" },
    ],
  },
  {
    id: "APP-1041",
    serviceSlug: "construction-3",
    company: "ТОО «Арна Строй»",
    contact: "Айгерим К.",
    city: "Астана",
    stage: "offer",
    createdAt: "27.10.2026",
    estimate: 873_250,
    checks: [
      { doc: "Аттестат ИТР", status: "ok", note: "Действителен до 2029" },
      { doc: "Договор аренды базы", status: "ok", note: "С 2024 года" },
    ],
    extracted: [{ label: "Адрес базы", value: "г. Астана, пр. Абая, 102" }],
  },
  {
    id: "APP-1040",
    serviceSlug: "scrap-metal",
    company: "ИП «Нурлан Металл»",
    contact: "Нурлан Б.",
    city: "Павлодар",
    stage: "docs",
    createdAt: "27.10.2026",
    estimate: 2_193_250,
    checks: [],
    extracted: [],
  },
  {
    id: "APP-1039",
    serviceSlug: "eco-permit-2",
    company: "ТОО «KazAgroPack»",
    contact: "Марат Т.",
    city: "Шымкент",
    stage: "new",
    createdAt: "28.10.2026",
    estimate: 0,
    checks: [],
    extracted: [],
  },
  {
    id: "APP-1038",
    serviceSlug: "hazardous-tech",
    company: "АО «Темир Комбинат»",
    contact: "Сергей П.",
    city: "Темиртау",
    stage: "paid",
    createdAt: "24.10.2026",
    estimate: 650_000,
    checks: [{ doc: "Экспертное заключение ПБ", status: "ok", note: "Выдано 02.10.2026" }],
    extracted: [],
  },
  {
    id: "APP-1037",
    serviceSlug: "construction-3",
    company: "ТОО «Батыс Монтаж»",
    contact: "Дана Ж.",
    city: "Атырау",
    stage: "work",
    createdAt: "20.10.2026",
    estimate: 1_123_250,
    checks: [],
    extracted: [],
  },
  {
    id: "APP-1036",
    serviceSlug: "scrap-metal",
    company: "ТОО «Алтын Лом»",
    contact: "Асхат Р.",
    city: "Усть-Каменогорск",
    stage: "new",
    createdAt: "28.10.2026",
    estimate: 1_843_250,
    checks: [],
    extracted: [],
  },
];

export const getApplication = (id: string) => applications.find((a) => a.id === id);
