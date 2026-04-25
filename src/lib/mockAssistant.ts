export type AssistantAnswer = {
  title: string;
  summary: string;
  steps: string[];
  phrases: { bg: string; en: string }[];
  warnings: string[];
  nextActions: string[];
};

const responses: { keys: string[]; answer: AssistantAnswer }[] = [
  {
    keys: ["train", "sofia", "ticket"],
    answer: {
      title: "Buying a train ticket from Ruse to Sofia",
      summary: "Trains leave from Ruse Central Railway Station several times a day. Tickets are sold at the BDŽ counter or sometimes online. Bring cash and your student card.",
      steps: [
        "Go to Ruse railway station ('Централна гара').",
        "Find the BDŽ ticket counter ('каса').",
        "Ask for your ticket. Mention 'отиване и връщане' if you want a return.",
        "Show your student card if you have one — discounts up to 50%.",
        "Check the platform ('перон') on the screen.",
      ],
      phrases: [
        { bg: "Един билет до София, моля.", en: "One ticket to Sofia, please." },
        { bg: "Има ли студентска отстъпка?", en: "Is there a student discount?" },
        { bg: "От кой перон тръгва влакът?", en: "Which platform does the train leave from?" },
      ],
      warnings: ["Bring cash — card payments not always accepted at small stations."],
      nextActions: ["Show me the route", "Find a buddy", "Add this to my plan", "Translate this"],
    },
  },
  {
    keys: ["rental", "contract"],
    answer: {
      title: "Understanding your rental contract",
      summary: "Most Ruse rental contracts include monthly rent in лв, deposit, duration, notice period, and rules on utilities. Read carefully and ask before signing.",
      steps: [
        "Find the monthly rent and deposit amount.",
        "Check duration and the required notice period.",
        "Note who pays utilities.",
        "Look for late fees.",
      ],
      phrases: [
        { bg: "Може ли да обясните този член?", en: "Could you explain this clause?" },
      ],
      warnings: [
        "ERASMuse is not a lawyer — it flags issues but cannot give legal judgment.",
      ],
      nextActions: ["Open Document Decoder", "Generate message to landlord", "Add to plan"],
    },
  },
  {
    keys: ["tonight", "ruse", "danube"],
    answer: {
      title: "Tonight in Ruse",
      summary: "A few solid options: a chill walk along the Danube, the Student Music Night downtown, or board games at a student café.",
      steps: [
        "Pick a vibe: chill, social, music.",
        "Check distance from your location.",
        "Find a buddy if you'd rather not go alone.",
      ],
      phrases: [{ bg: "Колко струва входа?", en: "How much is the entry?" }],
      warnings: [],
      nextActions: ["Open Explore", "Find a buddy", "Show on map"],
    },
  },
  {
    keys: ["university", "railway", "station"],
    answer: {
      title: "From University of Ruse to the Railway Station",
      summary: "Take bus 6 or trolley 27 from the main university gate to 'Централна гара'. About 20 minutes door-to-door.",
      steps: [
        "Walk to the bus stop in front of the university.",
        "Take bus 6 or trolley 27 toward the city center.",
        "Get off at 'Централна гара'.",
        "The railway station is right across the small square.",
      ],
      phrases: [
        { bg: "Това ли е спирката за гарата?", en: "Is this the stop for the railway station?" },
      ],
      warnings: [],
      nextActions: ["Add to plan", "Find a travel buddy"],
    },
  },
  {
    keys: ["erasmus", "office"],
    answer: {
      title: "Where is the Erasmus office?",
      summary: "The Erasmus office is in Building 1, second floor, on the main university campus.",
      steps: [
        "Enter the main university gate.",
        "Go to Building 1.",
        "Take the stairs to the second floor.",
        "Look for 'Erasmus / International office'.",
      ],
      phrases: [{ bg: "Къде е Еразъм офисът?", en: "Where is the Erasmus office?" }],
      warnings: [],
      nextActions: ["Show on map", "Add to plan"],
    },
  },
  {
    keys: ["doctor", "sick"],
    answer: {
      title: "Need to see a doctor?",
      summary: "For non-urgent care, go to a local clinic. For emergencies in Bulgaria, call 112.",
      steps: [
        "If urgent: call 112.",
        "Otherwise: visit a clinic or general practitioner.",
        "Bring your insurance card and ID.",
      ],
      phrases: [{ bg: "Имам нужда от лекар.", en: "I need a doctor." }],
      warnings: [
        "ERASMuse is not a doctor. For emergencies in Bulgaria, call 112.",
      ],
      nextActions: ["Open Life Admin", "Show emergency phrases"],
    },
  },
  {
    keys: ["buddy", "travel"],
    answer: {
      title: "Find a travel buddy",
      summary: "Several students are heading the same way this weekend. Open Buddy Finder to see matches.",
      steps: [
        "Choose your destination and date.",
        "Pick a buddy with a high match score.",
        "Send a safe invite — meet in a public place.",
      ],
      phrases: [],
      warnings: ["Always meet in public places. Don't share personal info too early."],
      nextActions: ["Open Buddy Finder", "Add to plan"],
    },
  },
];

const fallback: AssistantAnswer = {
  title: "Here's how I can help",
  summary: "I can help with transport, documents, university, events, health, and life admin in Ruse. Try one of the suggested questions, or ask me anything.",
  steps: [
    "Pick a topic from the suggestions above.",
    "Or type your question in English, Bulgarian, Spanish, Turkish, French, or German.",
  ],
  phrases: [{ bg: "Не говоря български.", en: "I don't speak Bulgarian." }],
  warnings: ["For emergencies in Bulgaria, call 112."],
  nextActions: ["Open Explore", "Open Documents", "Open Move"],
};

export function getMockAnswer(message: string): AssistantAnswer {
  const m = message.toLowerCase();
  const best = responses.find(r => r.keys.every(k => m.includes(k))) ||
               responses.find(r => r.keys.some(k => m.includes(k)));
  return best ? best.answer : fallback;
}

export const evening15LevaPlan: AssistantAnswer = {
  title: "Your Ruse evening plan",
  summary: "You're free after 18:00, you like music, you have 15 лв, and you don't want to go alone. Here's a plan that fits.",
  steps: [
    "19:30 — Sunset walk along the Danube (free).",
    "21:00 — Student Music Night in the city center (5 лв entry).",
    "Meet your buddy at the venue entrance.",
  ],
  phrases: [
    { bg: "Един билет, моля.", en: "One ticket, please." },
    { bg: "Колко струва бирата?", en: "How much is the beer?" },
  ],
  warnings: [],
  nextActions: ["Find a buddy", "Show on map", "Add to plan"],
};
