import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Character } from '../interfaces/character.interface';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
    providedIn: 'root'
})
export class CharacterService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getCharacters(
        page: number = 1,
        name: string = '',
        status: string = '',
        species: string = '',
        gender: string = ''
    ): Observable<ApiResponse<Character>> {
        let params = new HttpParams().set('page', page.toString());

        if (name) params = params.set('name', name);
        if (status && status !== 'All') params = params.set('status', status);
        if (species) params = params.set('species', species);
        if (gender && gender !== 'All') params = params.set('gender', gender);

        return this.http.get<ApiResponse<Character>>(`${this.apiUrl}/Characters`, { params });
    }
}
