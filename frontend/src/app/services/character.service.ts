import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Character } from '../interfaces/character.interface';

@Injectable({
    providedIn: 'root'
})
export class CharacterService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl || 'http://localhost:5199/api';

    getAllCharacters(): Observable<Character[]> {
        return this.http.get<Character[]>(`${this.apiUrl}/Characters`);
    }
}
