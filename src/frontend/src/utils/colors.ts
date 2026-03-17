export const CLASS_COLORS = [
  {
    bg: "bg-sky-500",
    text: "text-white",
    light: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    bg: "bg-orange-400",
    text: "text-white",
    light: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    bg: "bg-green-500",
    text: "text-white",
    light: "bg-green-50",
    border: "border-green-200",
  },
  {
    bg: "bg-amber-400",
    text: "text-white",
    light: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    bg: "bg-purple-500",
    text: "text-white",
    light: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    bg: "bg-rose-500",
    text: "text-white",
    light: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    bg: "bg-teal-500",
    text: "text-white",
    light: "bg-teal-50",
    border: "border-teal-200",
  },
  {
    bg: "bg-indigo-500",
    text: "text-white",
    light: "bg-indigo-50",
    border: "border-indigo-200",
  },
];

export function getClassColor(index: number) {
  return CLASS_COLORS[index % CLASS_COLORS.length];
}

export const SUBJECT_COLOR_MAP: Record<
  string,
  { bg: string; text: string; emoji: string }
> = {
  math: { bg: "bg-sky-500", text: "text-white", emoji: "📐" },
  mathematics: { bg: "bg-sky-500", text: "text-white", emoji: "📐" },
  science: { bg: "bg-green-500", text: "text-white", emoji: "🔬" },
  english: { bg: "bg-orange-400", text: "text-white", emoji: "📚" },
  "social studies": { bg: "bg-amber-400", text: "text-white", emoji: "🌍" },
  history: { bg: "bg-amber-500", text: "text-white", emoji: "🏛️" },
  geography: { bg: "bg-teal-500", text: "text-white", emoji: "🗺️" },
  hindi: { bg: "bg-purple-500", text: "text-white", emoji: "🔤" },
  computer: { bg: "bg-indigo-500", text: "text-white", emoji: "💻" },
  "computer science": { bg: "bg-indigo-500", text: "text-white", emoji: "💻" },
  art: { bg: "bg-pink-500", text: "text-white", emoji: "🎨" },
  music: { bg: "bg-violet-500", text: "text-white", emoji: "🎵" },
  physical: { bg: "bg-rose-500", text: "text-white", emoji: "⚽" },
  physics: { bg: "bg-blue-600", text: "text-white", emoji: "⚛️" },
  chemistry: { bg: "bg-emerald-500", text: "text-white", emoji: "🧪" },
  biology: { bg: "bg-lime-500", text: "text-white", emoji: "🌿" },
  economics: { bg: "bg-yellow-500", text: "text-white", emoji: "📊" },
  default: { bg: "bg-slate-500", text: "text-white", emoji: "📖" },
};

export function getSubjectStyle(name: string) {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(SUBJECT_COLOR_MAP)) {
    if (key.includes(k)) return v;
  }
  return SUBJECT_COLOR_MAP.default;
}
