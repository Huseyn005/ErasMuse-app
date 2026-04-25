export type Scenario = {
  id: string;
  title: string;
  category: "emergency" | "medical" | "government" | "translation";
  steps: string[];
  warning?: string;
  phrases: { bg: string; en: string }[];
};

export const lifeAdmin: Scenario[] = [
  {
    id: "la1", title: "Lost ID or passport", category: "government",
    steps: [
      "Stay calm.",
      "Check where you last used it (cafés, transport, ATMs).",
      "If passport: contact your embassy or consulate.",
      "Go to the nearest local police station to report it.",
      "Inform your university international office.",
      "Prepare any ID copies you still have.",
    ],
    warning: "Make a police report within 24 hours when possible.",
    phrases: [
      { bg: "Загубих си документа.", en: "I lost my document." },
      { bg: "Трябва да подам жалба.", en: "I need to file a report." },
    ],
  },
  {
    id: "la2", title: "Need a doctor (not urgent)", category: "medical",
    steps: [
      "Visit a general practitioner (GP) or local clinic.",
      "Bring your EHIC / insurance card.",
      "Tell them your symptoms; ask for a written prescription if needed.",
      "Pharmacies (Аптека) sell most medicine without appointment.",
    ],
    warning: "ERASMuse is not a doctor. For severe symptoms call 112.",
    phrases: [
      { bg: "Имам нужда от лекар.", en: "I need a doctor." },
      { bg: "Не се чувствам добре.", en: "I don't feel well." },
    ],
  },
  {
    id: "la3", title: "Pharmacy / Аптека", category: "medical",
    steps: [
      "Look for the green cross sign — that's a pharmacy (Аптека).",
      "Tell them your symptom in simple words.",
      "Ask for instructions in English if you need.",
    ],
    warning: "Read the leaflet inside the box.",
    phrases: [
      { bg: "Имате ли нещо за главоболие?", en: "Do you have something for a headache?" },
      { bg: "Може ли инструкциите на английски?", en: "Can I have the instructions in English?" },
    ],
  },
  {
    id: "la4", title: "Residence registration", category: "government",
    steps: [
      "Visit the municipality (Общината) within the required period.",
      "Bring passport, university enrolment, and accommodation proof.",
      "Get a resident slip — keep a copy.",
    ],
    phrases: [
      { bg: "Бих искал да се регистрирам като студент.", en: "I would like to register as a student." },
    ],
  },
  {
    id: "la5", title: "Police (non-emergency)", category: "government",
    steps: [
      "Visit the local police station.",
      "Bring ID and any documents related to the issue.",
      "If language is hard, ask the international office for help.",
    ],
    phrases: [{ bg: "Имам нужда от помощ.", en: "I need help." }],
  },
  {
    id: "la6", title: "Translate official document", category: "translation",
    steps: [
      "Use ERASMuse Document Decoder for a simple summary.",
      "For legal use, ask a sworn translator.",
      "Keep both originals and translations.",
    ],
    warning: "ERASMuse is not a lawyer. It does not replace official advice.",
    phrases: [{ bg: "Може ли да ми преведете това?", en: "Can you translate this for me?" }],
  },
  {
    id: "la7", title: "Rental address issue", category: "government",
    steps: [
      "Talk first with your landlord — keep records of messages.",
      "Use Document Decoder to identify your contract terms.",
      "If needed, contact the international office for support.",
    ],
    phrases: [{ bg: "Имам проблем с наема.", en: "I have a problem with the rent." }],
  },
  {
    id: "la8", title: "Municipality form", category: "government",
    steps: [
      "Take a photo of the form.",
      "Use Document Decoder to translate sections.",
      "Ask the municipality desk if unsure.",
    ],
    phrases: [{ bg: "Какво трябва да попълня?", en: "What do I need to fill in?" }],
  },
];
