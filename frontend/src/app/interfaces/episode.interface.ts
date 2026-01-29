export interface Episode {
  id: number;
  name: string;
  airDate: string;
  episodeCode: string;
  season: number;
  episodeNumber: number;
  seen?: boolean;
}