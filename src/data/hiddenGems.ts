export type HiddenGem = {
  id: string;
  name: string;
  category: string;
  description: string;
  whySpecial: string;
  lat: number;
  lng: number;
  goodFor: string[];
  distance: string;
  hiddenScore: number;
  tags: string[];
  localTip: string;
  bestTime: string;
  budget: number; // лв
};

export const hiddenGems: HiddenGem[] = [
  {
    id: "g1",
    name: "Quay 22 Sunset Spot",
    category: "Viewpoint",
    description: "A small ledge overlooking the Danube where locals gather at golden hour.",
    whySpecial: "Almost no tourists. Bring headphones and stay 30 minutes.",
    lat: 43.8341, lng: 25.9542,
    goodFor: ["Chill", "Photos", "Solo"],
    distance: "1.4 km from center",
    hiddenScore: 9,
    tags: ["Hidden gem", "Free", "Nearby"],
    localTip: "Go near sunset and bring a jacket if you're walking near the Danube.",
    bestTime: "30 min before sunset",
    budget: 0,
  },
  {
    id: "g2",
    name: "Mehana Pri Komaite",
    category: "Food",
    description: "Family-run mehana with the best banitsa in the area.",
    whySpecial: "Mostly local crowd, handwritten menu, very affordable.",
    lat: 43.8432, lng: 25.9598,
    goodFor: ["Food", "Cultural"],
    distance: "650 m from center",
    hiddenScore: 8,
    tags: ["Hidden gem", "Low budget", "Student-friendly"],
    localTip: "Ask for the daily soup — it changes and it's always great.",
    bestTime: "Lunch",
    budget: 10,
  },
  {
    id: "g3",
    name: "Zahari Stoyanov Park nook",
    category: "Park",
    description: "A quiet bench area with old chestnut trees, perfect for reading.",
    whySpecial: "5 minutes from the busy center but feels like a small village.",
    lat: 43.8475, lng: 25.9601,
    goodFor: ["Study", "Solo"],
    distance: "900 m",
    hiddenScore: 7,
    tags: ["Hidden gem", "Free", "Chill"],
    localTip: "Mornings are very quiet, perfect for journaling.",
    bestTime: "Morning",
    budget: 0,
  },
  {
    id: "g4",
    name: "Kafe Bulgaria",
    category: "Café",
    description: "Old-school café with strong Bulgarian coffee and slow internet.",
    whySpecial: "It's where locals come to chat for hours.",
    lat: 43.8451, lng: 25.9569,
    goodFor: ["Social", "Cultural"],
    distance: "500 m",
    hiddenScore: 7,
    tags: ["Hidden gem", "Low budget"],
    localTip: "Try the Turkish coffee with lokum.",
    bestTime: "Afternoon",
    budget: 4,
  },
  {
    id: "g5",
    name: "Riverside Bike Path",
    category: "Outdoor",
    description: "Smooth path along the Danube perfect for sunset rides.",
    whySpecial: "Almost empty in the evenings.",
    lat: 43.8311, lng: 25.948,
    goodFor: ["Active", "Solo"],
    distance: "2 km",
    hiddenScore: 6,
    tags: ["Free", "Hidden gem"],
    localTip: "Rentals near the city center start from 8 лв/hour.",
    bestTime: "Sunset",
    budget: 8,
  },
  {
    id: "g6",
    name: "Old Bookshop on Aleksandrovska",
    category: "Shop",
    description: "Tiny bookshop with second-hand Bulgarian and English books.",
    whySpecial: "Owner gives the best café recommendations.",
    lat: 43.846, lng: 25.957,
    goodFor: ["Solo", "Cultural"],
    distance: "300 m",
    hiddenScore: 8,
    tags: ["Hidden gem"],
    localTip: "Ask for poetry in translation — they're hidden behind the desk.",
    bestTime: "Afternoon",
    budget: 5,
  },
  {
    id: "g7",
    name: "Rooftop at the Old Hotel",
    category: "Viewpoint",
    description: "Public-access rooftop with panoramic views of the river and city.",
    whySpecial: "Most people don't realise it's open.",
    lat: 43.8442, lng: 25.9558,
    goodFor: ["Photos", "Social"],
    distance: "400 m",
    hiddenScore: 9,
    tags: ["Hidden gem", "Free"],
    localTip: "Best at blue hour, just after sunset.",
    bestTime: "Blue hour",
    budget: 0,
  },
  {
    id: "g8",
    name: "Hidden Sweet Shop",
    category: "Food",
    description: "Tiny shop selling homemade halva and traditional sweets.",
    whySpecial: "No sign outside. Look for the orange door.",
    lat: 43.8448, lng: 25.9612,
    goodFor: ["Food", "Cultural"],
    distance: "500 m",
    hiddenScore: 9,
    tags: ["Hidden gem", "Low budget"],
    localTip: "Try the rose-flavoured lokum.",
    bestTime: "Anytime",
    budget: 3,
  },
];
