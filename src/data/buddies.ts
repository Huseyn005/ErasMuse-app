export type Buddy = {
  id: string;
  firstName: string;
  userType: string;
  languages: string[];
  interests: string[];
  matchScore: number;
  type: "event" | "travel";
  relatedEventId?: string;
  from?: string;
  to?: string;
  date?: string;
  meetingPoint?: string;
  lat?: number;
  lng?: number;
  note?: string;
};

export const buddies: Buddy[] = [
  { id: "b1", firstName: "Marta", userType: "Erasmus student", languages: ["English", "Spanish"], interests: ["Music", "Food"], matchScore: 92, type: "event", relatedEventId: "e1", note: "Looking for someone fun for the music night." },
  { id: "b2", firstName: "Kenan", userType: "Erasmus student", languages: ["English", "Turkish"], interests: ["Tech", "Food"], matchScore: 88, type: "event", relatedEventId: "e5" },
  { id: "b3", firstName: "Lara", userType: "Local student", languages: ["Bulgarian", "English"], interests: ["Culture", "Music"], matchScore: 85, type: "event", relatedEventId: "e1" },
  { id: "b4", firstName: "Pierre", userType: "Erasmus student", languages: ["French", "English"], interests: ["Travel", "Nature"], matchScore: 90, type: "travel", from: "Ruse", to: "Sofia", date: "Sat 09:00", meetingPoint: "Railway Station" },
  { id: "b5", firstName: "Sofia", userType: "International student", languages: ["English", "German"], interests: ["Travel"], matchScore: 84, type: "travel", from: "Ruse", to: "Bucharest Airport", date: "Sun 06:00", meetingPoint: "Bus Station" },
  { id: "b6", firstName: "Tom", userType: "Tourist", languages: ["English"], interests: ["Culture"], matchScore: 78, type: "travel", from: "Ruse", to: "Veliko Tarnovo", date: "Sat 10:00", meetingPoint: "Bus Station" },
  { id: "b7", firstName: "Ivana", userType: "Local citizen", languages: ["Bulgarian", "English"], interests: ["Food", "Culture"], matchScore: 80, type: "event", relatedEventId: "e7" },
  { id: "b8", firstName: "Ahmed", userType: "Erasmus student", languages: ["English", "Arabic"], interests: ["Sports", "Music"], matchScore: 87, type: "event", relatedEventId: "e6" },
  { id: "b9", firstName: "Elena", userType: "Local student", languages: ["Bulgarian", "English"], interests: ["Tech", "Study"], matchScore: 83, type: "event", relatedEventId: "e10" },
  { id: "b10", firstName: "Diego", userType: "Erasmus student", languages: ["Spanish", "English"], interests: ["Nightlife", "Travel"], matchScore: 86, type: "travel", from: "City Center", to: "Danube area", date: "Tonight 19:00", meetingPoint: "Liberty Square" },
];
