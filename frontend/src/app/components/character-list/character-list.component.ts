import { Component, OnInit, inject, signal, computed } from '@angular/core';
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

    allCharacters = signal<Character[]>([]);

    searchTerm = signal<string>('');
    selectedStatus = signal<string>('All');
    selectedSpecies = signal<string>('');
    selectedGender = signal<string>('All');
    selectedEpisode = signal<number | null>(null);

    currentPage = signal<number>(1);
    itemsPerPage = 12;

    filteredCharacters = computed(() => {
        let chars = this.allCharacters();
        const term = this.searchTerm().toLowerCase();
        const status = this.selectedStatus();
        const species = this.selectedSpecies().toLowerCase();
        const gender = this.selectedGender();
        const episodeId = this.selectedEpisode();

        if (term) {
            chars = chars.filter(c => c.name.toLowerCase().includes(term));
        }
        if (status !== 'All') {
            chars = chars.filter(c => c.status === status);
        }
        if (species) {
            chars = chars.filter(c => c.species.toLowerCase().includes(species));
        }
        if (gender !== 'All') {
            chars = chars.filter(c => c.gender === gender);
        }

        if (episodeId) {
            const urlSuffix = `/${episodeId}`;
            chars = chars.filter(c => c.episode.some(url => url.endsWith(urlSuffix)));
        }

        return chars;
    });

    paginatedCharacters = computed(() => {
        const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredCharacters().slice(startIndex, endIndex);
    });

    totalPages = computed(() => {
        return Math.ceil(this.filteredCharacters().length / this.itemsPerPage);
    });

    ngOnInit() {
        this.characterService.getAllCharacters().subscribe({
            next: (data) => this.allCharacters.set(data),
            error: (e) => console.error('Error fetching characters', e)
        });
    }

    nextPage() {
        if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1);
    }

    prevPage() {
        if (this.currentPage() > 1) this.currentPage.update(p => p - 1);
    }

    resetFilters() {
        this.searchTerm.set('');
        this.selectedStatus.set('All');
        this.selectedSpecies.set('');
        this.selectedGender.set('All');
        this.selectedEpisode.set(null);
        this.currentPage.set(1);
    }
}
