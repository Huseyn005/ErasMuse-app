export type SampleDoc = {
  id: string;
  title: string;
  type: string;
  body: string;
  analysis: {
    simpleExplanation: string;
    keyDetails: { label: string; value: string }[];
    riskFlags: { title: string; detail: string }[];
    questionsToAsk: string[];
    bgSummary: string;
    enMessage: string;
    bgMessage: string;
  };
};

export const sampleDocuments: SampleDoc[] = [
  {
    id: "d1",
    title: "Rental contract — apartment near university",
    type: "Rental contract",
    body: "Договор за наем — Lessor agrees to let the apartment located at ul. Aleksandrovska 12, ap. 4, for monthly rent of 600 лв (≈ 307 EUR). Deposit 1200 лв due on signing. Duration: 12 months. Notice: 1 month. Utilities not included. Late fee 30 лв/day after 5 days...",
    analysis: {
      simpleExplanation: "This is a 12-month apartment rental contract. You pay 600 лв per month, a 1200 лв deposit, and you must give one month's notice before leaving. Utilities are extra.",
      keyDetails: [
        { label: "Monthly rent", value: "600 лв (≈ 307 EUR)" },
        { label: "Deposit", value: "1200 лв" },
        { label: "Duration", value: "12 months" },
        { label: "Notice period", value: "1 month" },
        { label: "Utilities", value: "Not included" },
        { label: "Late fee", value: "30 лв/day after 5 days late" },
        { label: "Contact person", value: "Landlord — phone provided in clause 4" },
      ],
      riskFlags: [
        { title: "High late fee", detail: "30 лв per day adds up quickly. Pay on time and keep proof." },
        { title: "Deposit recovery", detail: "Contract doesn't specify deposit return timing. Ask in writing." },
        { title: "Utilities not included", detail: "Estimate 80–150 лв/month extra in winter for heating." },
      ],
      questionsToAsk: [
        "When and how is the deposit returned?",
        "What counts as 'damage' beyond normal wear?",
        "Can I register my address here?",
        "Who do I call for repairs?",
      ],
      bgSummary: "Това е договор за наем за 12 месеца. Месечен наем: 600 лв. Депозит: 1200 лв. Предизвестие: 1 месец.",
      enMessage: "Hello, I have read the contract and I have a few quick questions about the deposit return and utilities. Could we discuss before I sign? Thank you.",
      bgMessage: "Здравейте, прочетох договора и имам няколко въпроса относно връщането на депозита и сметките. Може ли да ги обсъдим преди да подпиша? Благодаря.",
    },
  },
  {
    id: "d2",
    title: "University acceptance letter",
    type: "University letter",
    body: "Dear student, we confirm your acceptance to the Erasmus exchange at the University of Ruse for the semester...",
    analysis: {
      simpleExplanation: "This letter confirms your acceptance for the Erasmus semester. Bring it to immigration and to the university registration desk.",
      keyDetails: [
        { label: "Program", value: "Erasmus+ Exchange" },
        { label: "Semester", value: "Spring" },
        { label: "First steps", value: "Visit Erasmus Office in week 1" },
        { label: "Documents to bring", value: "Passport, this letter, photos" },
      ],
      riskFlags: [
        { title: "Strict deadlines", detail: "Confirm arrival in the first week or your status may be paused." },
      ],
      questionsToAsk: [
        "Where exactly is the Erasmus office?",
        "Is there a welcome event?",
        "How do I get my student card?",
      ],
      bgSummary: "Това е писмо за прием в Еразъм програмата. Носете го в първата седмица.",
      enMessage: "Hello, I received the acceptance letter and would like to confirm the steps for arrival.",
      bgMessage: "Здравейте, получих писмото за прием и бих искал да потвърдя стъпките за пристигане.",
    },
  },
  {
    id: "d3",
    title: "Medical instruction (medication)",
    type: "Medical instruction",
    body: "Take 1 tablet 3 times a day after meals for 7 days. Avoid alcohol...",
    analysis: {
      simpleExplanation: "Take 1 pill 3 times per day, after eating, for 7 days. Don't drink alcohol while you take it.",
      keyDetails: [
        { label: "Dose", value: "1 tablet" },
        { label: "Frequency", value: "3 times daily, after meals" },
        { label: "Duration", value: "7 days" },
        { label: "Avoid", value: "Alcohol" },
      ],
      riskFlags: [
        { title: "Not medical advice", detail: "ERASMuse is not a doctor. Always confirm with a pharmacist." },
      ],
      questionsToAsk: [
        "What if I miss a dose?",
        "Can I take this with my other medication?",
      ],
      bgSummary: "Едно хапче, 3 пъти на ден, след хранене, за 7 дни. Без алкохол.",
      enMessage: "Hello, can you confirm the safest time to take this medicine?",
      bgMessage: "Здравейте, може ли да потвърдите кога е най-безопасно да приема това лекарство?",
    },
  },
  {
    id: "d4",
    title: "Municipality form — registration",
    type: "Government form",
    body: "Заявление за регистрация на адрес...",
    analysis: {
      simpleExplanation: "This is a request form to register your address with the municipality.",
      keyDetails: [
        { label: "Required documents", value: "Passport, rental contract, university letter" },
        { label: "Where", value: "Municipality (Общината) — central building" },
        { label: "Cost", value: "Usually free" },
      ],
      riskFlags: [
        { title: "Bring originals", detail: "Some clerks ask for originals plus copies." },
      ],
      questionsToAsk: [
        "Which window do I go to?",
        "How long does it take?",
      ],
      bgSummary: "Формуляр за регистрация на адрес — носете паспорт и договор за наем.",
      enMessage: "Hello, I'd like to register my address as a foreign student.",
      bgMessage: "Здравейте, бих искал да регистрирам адреса си като чуждестранен студент.",
    },
  },
  {
    id: "d5",
    title: "Train ticket — Ruse to Sofia",
    type: "Travel document",
    body: "БДЖ — Ruse → Sofia, Date 12.05, Coach 3, Seat 14...",
    analysis: {
      simpleExplanation: "Train ticket from Ruse to Sofia. You have a reserved seat — coach 3, seat 14.",
      keyDetails: [
        { label: "From", value: "Ruse" },
        { label: "To", value: "Sofia" },
        { label: "Coach / Seat", value: "3 / 14" },
        { label: "Operator", value: "BDŽ (Bulgarian railways)" },
      ],
      riskFlags: [
        { title: "Arrive early", detail: "Be at the platform at least 15 minutes before departure." },
      ],
      questionsToAsk: ["Where is platform 'перон' for this train?"],
      bgSummary: "Билет за влака Русе → София. Вагон 3, място 14.",
      enMessage: "Hello, I have a ticket for the Ruse–Sofia train. Could you confirm the platform?",
      bgMessage: "Здравейте, имам билет за влака Русе–София. Може ли да потвърдите перона?",
    },
  },
];
