export function getLevelName(level: number): string {
  const levels: Record<number, string> = {
    1: "Beginner",
    2: "Explorer",
    3: "Builder",
    4: "Strategist",
    5: "Business Challenger",
  };
  return levels[level] ?? "Business Challenger";
}

export function getNextLevelPoints(level: number): number {
  const thresholds: Record<number, number> = {
    1: 100,
    2: 300,
    3: 600,
    4: 1000,
    5: 2000,
  };
  return thresholds[level] ?? 2000;
}

export function calcLevel(points: number): number {
  if (points < 100) return 1;
  if (points < 300) return 2;
  if (points < 600) return 3;
  if (points < 1000) return 4;
  return 5;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export const SKILL_CATEGORIES = [
  "マーケティング",
  "起業家精神",
  "会計・財務",
  "経営戦略",
  "広告",
  "営業",
  "リーダーシップ",
];
