import type { CalculatorConfig } from "./pricing";

export type ChatMessage =
  | { from: "agent"; kind: "text"; text: string }
  | { from: "client"; kind: "text"; text: string }
  | { from: "client"; kind: "file"; name: string; size: string }
  | { from: "client"; kind: "location"; label: string; coords: string }
  | { from: "agent"; kind: "report"; items: { doc: string; ok: boolean; note: string }[] };

interface ScriptInput {
  serviceTitle: string;
  config?: CalculatorConfig;
  presentIds: string[];
  fallbackDocs: string[];
  clientName?: string;
}

const fileName = (doc: string, i: number) => `${doc.split(" ").slice(0, 3).join("_").replace(/[«»,]/g, "")}_${i + 1}.pdf`;

/** Builds the scripted WhatsApp dialogue used by the demo. */
export function buildAgentScript({ serviceTitle, config, presentIds, fallbackDocs, clientName }: ScriptInput): ChatMessage[] {
  const greeting = clientName ? `Здравствуйте, ${clientName}!` : "Здравствуйте!";
  const docs = config ? config.questions.filter((q) => presentIds.includes(q.id)).flatMap((q) => q.docs) : fallbackDocs;

  const messages: ChatMessage[] = [
    {
      from: "agent",
      kind: "text",
      text: `${greeting} Я AI-ассистент SafeNechExpert. Получил вашу заявку: «${serviceTitle}».`,
    },
  ];

  if (docs.length === 0) {
    messages.push(
      {
        from: "agent",
        kind: "text",
        text: "Вы отметили, что документов пока нет. Это нормально: всё оформим за вас. Подскажите, где планируете разместить базу?",
      },
      { from: "client", kind: "location", label: "Планируемая база", coords: "51.1282, 71.4304" },
    );
  } else {
    messages.push(
      {
        from: "agent",
        kind: "text",
        text: `Чтобы менеджер назвал точную цену, пришлите, пожалуйста:\n${docs.map((d) => `• ${d}`).join("\n")}`,
      },
      { from: "client", kind: "text", text: "Сейчас скину" },
      ...docs.map((doc, i): ChatMessage => ({
        from: "client",
        kind: "file",
        name: fileName(doc, i),
        size: `${(0.4 + i * 0.3).toFixed(1)} МБ`,
      })),
      { from: "agent", kind: "text", text: "Спасибо! И отправьте геолокацию базы, чтобы сверить адрес с договором." },
      { from: "client", kind: "location", label: "База", coords: "49.8028, 73.1021" },
      {
        from: "agent",
        kind: "report",
        items: docs.map((doc, i) => ({
          doc,
          ok: i !== 1,
          note: i === 1 ? "Срок истекает через 15 дней, продлим до подачи" : "Проверено",
        })),
      },
    );
  }

  messages.push({
    from: "agent",
    kind: "text",
    text: "Передал заявку менеджеру. Он свяжется с вами сегодня и назовёт итоговую цену и срок.",
  });
  return messages;
}
