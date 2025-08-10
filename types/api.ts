// types/api.ts
export interface Show {
  id: number;
  name: string;
  url: string;
  genres: string[];
  schedule: {
    time: string;
    days: string[];
  };
  image: {
    medium: string;
    original: string;
  } | null;
  summary: string;
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  summary: string;
  image: {
    medium: string;
    original: string;
  } | null;
}

export interface Season {
  season: number;
  episodes: Episode[];
}