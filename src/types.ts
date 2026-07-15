export interface Scene {
  id: number;
  title: string;
  text: string;
  narratorName: string;
  duration: number; // in seconds
  subtitle: string;
}

export interface VideoSettings {
  slogan: string;
  aspectRatio: "16:9" | "9:16";
  overlayFilter: "golden" | "emerald" | "twilight" | "none";
  activeScene: number;
  isPlaying: boolean;
  isMuted: boolean;
  backgroundMusicVolume: number;
  voiceVolume: number;
  voiceSpeed: number; // 0.5 to 2
  voicePitch: number; // 0.5 to 2
  showParticles: boolean;
  autoPlayNext: boolean;
}

export interface CompanyInfo {
  name: string;
  englishName: string;
  slogan: string;
  phones: string[];
}
