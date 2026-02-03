import { Injectable } from '@angular/core';

export interface EpisodeSearchParams {
  name?: string;
  episode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilterMapperService {

  mapEpisodeSearchTerm(term: string): EpisodeSearchParams {
    if (!term) return { name: '', episode: '' };

    const isEpisodeCode = /S\d\dE\d\d/i.test(term);

    if (isEpisodeCode) {
      return { episode: term, name: '' };
    } else {
      return { name: term, episode: '' };
    }
  }
}
