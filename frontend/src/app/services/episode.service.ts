import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Episode } from '../interfaces/episode.interface';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://localhost:5199/api';

  getEpisodes(page: number = 1, name: string = '', episode: string = '', season: string = '', startDate: string = '', endDate: string = ''): Observable<ApiResponse<Episode>> {
    let params = new HttpParams().set('page', page.toString());

    if (name) params = params.set('name', name);
    if (episode) params = params.set('episode', episode);
    if (season && season !== 'All') params = params.set('season', season);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<ApiResponse<Episode>>(`${this.apiUrl}/Episodes`, { params });
  }
}