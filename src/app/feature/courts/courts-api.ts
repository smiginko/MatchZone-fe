import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Court} from "./model/court";
import {CourtCreateRequest} from "./model/court-create-request";

@Injectable({
    providedIn: 'root',
})
export class CourtsApi {
    private http = inject(HttpClient);

    private readonly _url = environment.beUrl + '/courts';

    getCourts() {
        return this.http.get<Court[]>(this._url);
    }

    addCourt(request: CourtCreateRequest) {
        return this.http.post<void>(this._url, request);
    }

    updateCourt(id: string, request: CourtCreateRequest) {
        return this.http.put<void>(`${this._url}/${id}`, request);
    }

    deleteCourt(id: string) {
    return this.http.delete<void>(`${this._url}/${id}`);
}
}