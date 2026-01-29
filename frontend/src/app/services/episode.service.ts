import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Episode } from '../interfaces/episode.interface';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://localhost:5199/api';

  getEpisodes(page: number = 1): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.apiUrl}/Episodes?page=${page}`);
  }
}