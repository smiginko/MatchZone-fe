import { Component, OnInit } from '@angular/core';
import { CourtCreateRequest } from '../../model/court-create-request';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-court-modal',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './court-modal.html',
})
export class CourtModal implements OnInit {
    court: CourtCreateRequest = {
        name: '',
        sport: 'TENNIS',
        pricePerHour: 10,
    };

    model: CourtCreateRequest = {
        name: '',
        sport: 'TENNIS',
        pricePerHour: 10,
    };

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {
        this.model = { ...this.court };
    }

    get isEditMode() {
        return this.court.name !== '' || this.court.pricePerHour !== 10;
    }

    save() {
        this.activeModal.close(this.model);
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
