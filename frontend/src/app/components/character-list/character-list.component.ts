import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../interfaces/character.interface';
import { CharacterCardComponent } from '../character-card/character-card.component';

@Component({
    selector: 'app-character-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, CharacterCardComponent],
    templateUrl: './character-list.component.html',
    styleUrl: './character-list.component.scss'
})
export class CharacterListComponent implements OnInit {
    private characterService = inject(CharacterService);

    characters = signal<Character[]>([]);

    searchTerm = signal<string>('');
    selectedStatus = signal<string>('All');
    selectedSpecies = signal<string>('');
    selectedGender = signal<string>('All');


    currentPage = signal<number>(1);
    totalPages = signal<number>(1);
    totalItems = signal<number>(0);

    ngOnInit() {
        this.loadCharacters();
    }

    loadCharacters() {
        this.characterService.getCharacters(
            this.currentPage(),
            this.searchTerm(),
            this.selectedStatus(),
            this.selectedSpecies(),
            this.selectedGender()
        ).subscribe({
            next: (response) => {
                this.characters.set(response.results);
                this.totalPages.set(response.info.pages);
                this.totalItems.set(response.info.count);
            },
            error: (e) => {
                console.error('Error fetching characters', e);
                this.characters.set([]);
            }
        });
    }

    onFilterChange() {
        this.currentPage.set(1);
        this.loadCharacters();
    }

    nextPage() {
        if (this.currentPage() < this.totalPages()) {
            this.currentPage.update(p => p + 1);
            this.loadCharacters();
        }
    }

    prevPage() {
        if (this.currentPage() > 1) {
            this.currentPage.update(p => p - 1);
            this.loadCharacters();
        }
    }

    resetFilters() {
        this.searchTerm.set('');
        this.selectedStatus.set('All');
        this.selectedSpecies.set('');
        this.selectedGender.set('All');
        this.currentPage.set(1);
        this.loadCharacters();
    }
}
