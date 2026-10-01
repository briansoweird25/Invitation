export interface Palette {
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const palettes: Palette[] = [
  { name: "Ivory & Gold", backgroundColor: "#F6F1E8", textColor: "#3A3128", accentColor: "#8A7352" },
  { name: "Sage", backgroundColor: "#EEF0E8", textColor: "#3E4A39", accentColor: "#7C8F6B" },
  { name: "Blush", backgroundColor: "#FBEFEC", textColor: "#4A3535", accentColor: "#B5736B" },
  { name: "Midnight", backgroundColor: "#1F2430", textColor: "#F2EDE4", accentColor: "#C8A96A" },
  { name: "Paper", backgroundColor: "#FBFBF9", textColor: "#1D1D1B", accentColor: "#9B978F" },
  { name: "Tangerine", backgroundColor: "#FF6B3D", textColor: "#1D1D1B", accentColor: "#FFE9D6" },
];
