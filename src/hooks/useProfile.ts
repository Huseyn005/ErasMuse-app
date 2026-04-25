import { useLocalStorage } from "./useLocalStorage";

export type UserType =
  | "Erasmus / International student"
  | "Tourist / Visitor"
  | "Local student"
  | "Local citizen"
  | "Other";

export type Language = "English" | "Bulgarian" | "Spanish" | "Turkish" | "French" | "German";

export type Profile = {
  userType: UserType | null;
  language: Language;
  interests: string[];
  budget: "Free" | "Low" | "Medium" | "Flexible";
  social: string;
  buddyPref: string;
  startPoint: string;
  transportConfidence: "Beginner" | "Getting there" | "Comfortable";
  onboarded: boolean;
};

export const defaultProfile: Profile = {
  userType: null,
  language: "English",
  interests: [],
  budget: "Low",
  social: "I want to meet people",
  buddyPref: "I am open to event buddies",
  startPoint: "University of Ruse",
  transportConfidence: "Getting there",
  onboarded: false,
};

export function useProfile() {
  return useLocalStorage<Profile>("erasmuse:profile", defaultProfile);
}
