export type Facility = {
  id: string;
  name: string;
  description: string;
  location: string;
  lat: number; lng: number;
  usefulFor: string[];
  tips: string;
};

export const campus: Facility[] = [
  { id: "c1", name: "Erasmus Office", description: "Your first stop for paperwork, learning agreement, and exchange info.", location: "Building 1, Floor 2", lat: 43.8489, lng: 25.9658, usefulFor: ["Erasmus", "Paperwork"], tips: "Visit in the first week to confirm your arrival." },
  { id: "c2", name: "Library", description: "Quiet study spaces and printing services.", location: "Library Building", lat: 43.8492, lng: 25.9665, usefulFor: ["Study", "Printing"], tips: "Free Wi-Fi. Brings your student card." },
  { id: "c3", name: "Main Building", description: "Lectures, admin, and the dean's office.", location: "Main Campus", lat: 43.8489, lng: 25.966, usefulFor: ["Classes"], tips: "Check the bulletin board for schedule updates." },
  { id: "c4", name: "Student Dorms", description: "International student accommodation.", location: "Campus East", lat: 43.85, lng: 25.97, usefulFor: ["Living"], tips: "Bring your passport when checking in." },
  { id: "c5", name: "Cafeteria", description: "Affordable meals — most dishes 4–7 лв.", location: "Building 2", lat: 43.8487, lng: 25.9662, usefulFor: ["Food"], tips: "Open 11:30–14:30 weekdays." },
  { id: "c6", name: "Sports Facilities", description: "Gym, courts, and student clubs.", location: "Sports Hall", lat: 43.8482, lng: 25.967, usefulFor: ["Sports"], tips: "Sign up at the sports office." },
  { id: "c7", name: "Computer Labs", description: "Open lab access with your student account.", location: "Building 3", lat: 43.8491, lng: 25.9655, usefulFor: ["Tech", "Study"], tips: "Reserve a slot during exam periods." },
  { id: "c8", name: "Student Services", description: "ID cards, transcripts, scholarships.", location: "Main Building, Floor 1", lat: 43.8489, lng: 25.966, usefulFor: ["Admin"], tips: "Bring photo ID." },
  { id: "c9", name: "International Office", description: "Visas, residence, support for foreign students.", location: "Building 1, Floor 3", lat: 43.8489, lng: 25.9658, usefulFor: ["Visa", "Erasmus"], tips: "Walk-in hours weekday mornings." },
];
