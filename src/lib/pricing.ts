export interface CalcQuestion {
  id: string;
  text: string;
  hint: string;
  /** Documents the AI agent requests when the client answers "yes". */
  docs: string[];
  /** What the company does for the client when the answer is "no". */
  fix: string;
  surcharge: number;
  extraDays: number;
}

export interface CalculatorConfig {
  serviceSlug: string;
  serviceFee: number;
  govFee: number;
  prepDays: number;
  govDays: number;
  questions: CalcQuestion[];
}

export type Answers = Partial<Record<string, boolean>>;

export interface Quote {
  min: number;
  max: number;
  minDays: number;
  maxDays: number;
  present: CalcQuestion[];
  missing: CalcQuestion[];
  pending: CalcQuestion[];
  isComplete: boolean;
}

const sumBy = (items: CalcQuestion[], pick: (q: CalcQuestion) => number) => items.reduce((acc, q) => acc + pick(q), 0);

/**
 * Deterministic preliminary quote. Unanswered questions widen the range:
 * the lower bound assumes the client has the item, the upper bound assumes not.
 */
export function calculateQuote(config: CalculatorConfig, answers: Answers): Quote {
  const present = config.questions.filter((q) => answers[q.id] === true);
  const missing = config.questions.filter((q) => answers[q.id] === false);
  const pending = config.questions.filter((q) => answers[q.id] === undefined);

  const min = config.serviceFee + config.govFee + sumBy(missing, (q) => q.surcharge);
  const minDays = config.prepDays + config.govDays + sumBy(missing, (q) => q.extraDays);

  return {
    min,
    max: min + sumBy(pending, (q) => q.surcharge),
    minDays,
    maxDays: minDays + sumBy(pending, (q) => q.extraDays),
    present,
    missing,
    pending,
    isComplete: pending.length === 0,
  };
}
