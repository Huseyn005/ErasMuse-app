export type Route = {
  id: string;
  from: string;
  to: string;
  fromLat: number; fromLng: number;
  toLat: number; toLng: number;
  estimatedTime: string;
  steps: string[];
  difficulty: "Easy" | "Medium" | "Long";
  phrases: { bg: string; en: string }[];
  notes: string;
  travelBuddyAvailable: boolean;
};

export const routes: Route[] = [
  {
    id: "r1",
    from: "University of Ruse",
    to: "Railway Station",
    fromLat: 43.8489, fromLng: 25.9658,
    toLat: 43.852, toLng: 25.949,
    estimatedTime: "20 min",
    difficulty: "Easy",
    steps: [
      "Walk to the bus stop in front of the main university gate.",
      "Take bus 6 or trolley 27 toward the city center.",
      "Get off at 'Tsentralna Garra' (Central Station).",
      "The railway station is across the small square.",
    ],
    phrases: [
      { bg: "Един билет за гарата, моля.", en: "One ticket to the railway station, please." },
      { bg: "Това ли е спирката за гарата?", en: "Is this the stop for the railway station?" },
    ],
    notes: "Tickets are usually 1.50 лв on the bus. Have small change ready.",
    travelBuddyAvailable: true,
  },
  {
    id: "r2",
    from: "Ruse",
    to: "Sofia",
    fromLat: 43.852, fromLng: 25.949,
    toLat: 42.6977, toLng: 23.3219,
    estimatedTime: "5–6 h",
    difficulty: "Long",
    steps: [
      "Buy a train ticket at the BDŽ counter at Ruse railway station.",
      "Ask for 'отиване и връщане' if you want a return ticket.",
      "Trains leave a few times daily — confirm departure on the screen.",
      "Travel time is around 5–6 hours; bring water and snacks.",
    ],
    phrases: [
      { bg: "Един билет до София, моля.", en: "One ticket to Sofia, please." },
      { bg: "Има ли студентска отстъпка?", en: "Is there a student discount?" },
    ],
    notes: "Bring your student card for a discount of up to 50%.",
    travelBuddyAvailable: true,
  },
  {
    id: "r3",
    from: "Ruse",
    to: "Bucharest Airport",
    fromLat: 43.852, fromLng: 25.949,
    toLat: 44.5722, toLng: 26.1022,
    estimatedTime: "1.5–2 h",
    difficulty: "Medium",
    steps: [
      "Cross the Danube Bridge by minibus or shared taxi from the bus station.",
      "Once in Giurgiu (Romania), continue by bus or transfer to Bucharest.",
      "Total time depends on border check.",
    ],
    phrases: [
      { bg: "Кога тръгва автобусът за Гюргево?", en: "When does the bus to Giurgiu leave?" },
    ],
    notes: "Bring your passport. Border crossing is usually quick.",
    travelBuddyAvailable: true,
  },
  {
    id: "r4",
    from: "Student Dorms",
    to: "University of Ruse",
    fromLat: 43.85, fromLng: 25.97,
    toLat: 43.8489, toLng: 25.9658,
    estimatedTime: "10 min",
    difficulty: "Easy",
    steps: [
      "Walk from the dorms to the main university entrance.",
      "Most students take the inner campus path through the gardens.",
    ],
    phrases: [{ bg: "Къде е учебна сграда 1?", en: "Where is building 1?" }],
    notes: "Quickest by foot.",
    travelBuddyAvailable: false,
  },
  {
    id: "r5",
    from: "City Center",
    to: "Danube area",
    fromLat: 43.846, fromLng: 25.957,
    toLat: 43.832, toLng: 25.955,
    estimatedTime: "15 min walk",
    difficulty: "Easy",
    steps: [
      "Walk down Aleksandrovska street toward the river.",
      "Cross the small park; the Danube quay is just below.",
    ],
    phrases: [{ bg: "Как да стигна до Дунав?", en: "How do I get to the Danube?" }],
    notes: "Beautiful at sunset.",
    travelBuddyAvailable: true,
  },
  {
    id: "r6",
    from: "Ruse",
    to: "Veliko Tarnovo",
    fromLat: 43.852, fromLng: 25.949,
    toLat: 43.0757, toLng: 25.6172,
    estimatedTime: "2 h",
    difficulty: "Medium",
    steps: [
      "Take a bus from Ruse Bus Station — they leave several times daily.",
      "Buy your ticket at the desk; cash works best.",
    ],
    phrases: [{ bg: "Има ли автобус за Велико Търново днес?", en: "Is there a bus to Veliko Tarnovo today?" }],
    notes: "Day trip friendly. Beautiful old capital.",
    travelBuddyAvailable: true,
  },
];
