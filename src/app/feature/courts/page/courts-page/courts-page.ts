import { Component, computed, inject, signal } from '@angular/core';
import { CourtsApi } from '../../courts-api';
import { Court } from '../../model/court';
import { UserService } from '../../../../user.service';
import { UserRoleEnum } from '../../../../core/model/user-role-enum';
import { CourtModal } from '../../component/court-modal/court-modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-courts-page',
    standalone: true,
    imports: [],
    templateUrl: './courts-page.html',
})
export class CourtsPage {
    private userService = inject(UserService);
    private courtsApi = inject(CourtsApi);
    private modal = inject(NgbModal);

    protected user = this.userService.getUser();
    protected isAdmin = computed(() => this.user()?.role === UserRoleEnum.ADMIN);

    protected courts = signal<Court[]>([]);
    protected loading = signal(true);
    protected errorMessage = signal<string | null>(null);
    protected successMessage = signal<string | null>(null);
    protected actionErrorMessage = signal<string | null>(null);

    constructor() {
        this.loadCourts();
    }

    protected onAddCourtClick() {
        const modalRef = this.modal.open(CourtModal);

        modalRef.result.then((court) => {
            this.courtsApi.addCourt(court).subscribe({
                next: () => {
                    this.successMessage.set('Kurt bol uspesne pridany.');
                    this.loadCourts();
                },
                error: (err) => {
                    console.error('Failed to add court', err);
                    this.actionErrorMessage.set('Nepodarilo sa pridat kurt.');
                },
            });
        }).catch(() => {
            // modal closed without saving
        });
    }

    protected onEditCourtClick(court: Court) {
        const modalRef = this.modal.open(CourtModal);

        modalRef.componentInstance.court = {
            name: court.name,
            sport: court.sport,
            pricePerHour: court.pricePerHour,
        };

        modalRef.result.then((updatedCourt) => {
            this.courtsApi.updateCourt(court.id, updatedCourt).subscribe({
                next: () => {
                    this.successMessage.set('Kurt bol uspesne upraveny.');
                    this.loadCourts();
                },
                error: (err) => {
                    console.error('Failed to update court', err);
                    this.actionErrorMessage.set('Nepodarilo sa upravit kurt.');
                },
            });
        }).catch(() => {
            // modal closed without saving
        });
    }

    protected onDeleteCourtClick(court: Court) {
        const confirmed = confirm(`Naozaj chces zmazat kurt ${court.name}?`);

        if (!confirmed) {
            return;
        }

        this.courtsApi.deleteCourt(court.id).subscribe({
            next: () => {
                this.successMessage.set('Kurt bol uspesne zmazany.');
                this.loadCourts();
            },
            error: (err) => {
                console.error('Failed to delete court', err);
                this.actionErrorMessage.set('Nepodarilo sa zmazat kurt.');
            },
        });
    }

    private loadCourts() {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.courtsApi.getCourts().subscribe({
            next: (data) => {
                this.courts.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load courts', err);
                this.errorMessage.set('Nepodarilo sa nacitat kurty.');
                this.loading.set(false);
            },
        });
    }

    private clearActionMessages() {
        this.successMessage.set(null);
        this.actionErrorMessage.set(null);
    }
}