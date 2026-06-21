// Mock data + option lists used across the auth flows.
// Replace with Supabase-backed sources when the API layer is wired up.

export const SCHOOLS: string[] = [
  "University of Lagos (UNILAG)",
  "University of Ibadan (UI)",
  "Obafemi Awolowo University (OAU)",
  "University of Nigeria, Nsukka (UNN)",
  "Covenant University",
  "Babcock University",
  "Lagos State University (LASU)",
  "Federal University of Technology, Akure (FUTA)",
];

export const HOSTELS: string[] = [
  "Moremi Hall",
  "Mariere Hall",
  "Queen Amina Hall",
  "Kofo Ademola Hall",
  "Eni Njoku Hall",
  "Jaja Hall",
  "Off-campus / Private Lodge",
];

export const FOOD_CATEGORIES: string[] = [
  "Rice",
  "Fast Food",
  "Drinks",
  "Snacks",
  "Swallow",
  "Breakfast",
];

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Empty" | "Weak" | "Fair" | "Good" | "Strong";
  color: string;
}

// Lightweight client-side strength heuristic for the strength indicator.
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "Empty", color: "#E5E7EB" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map: Record<number, PasswordStrength> = {
    0: { score: 1, label: "Weak", color: "#DC2626" },
    1: { score: 1, label: "Weak", color: "#DC2626" },
    2: { score: 2, label: "Fair", color: "#D97706" },
    3: { score: 3, label: "Good", color: "#016644" },
    4: { score: 4, label: "Strong", color: "#00452E" },
  };

  return map[score];
}
