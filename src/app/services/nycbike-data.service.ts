import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as Rx from 'rxjs/Rx';
import { Station } from "app/entities/station";
import { StationStatusModel } from "app/entities/stationStatus";

@Injectable()
export class NYCBikeDataService {
    private apiDomain = 'https://gbfs.citibikenyc.com';
    private apiStations = '/gbfs/en/station_information.json';
    private apiStationsStatus = '/gbfs/en/station_status.json';

    constructor(private http: Http) { };
    public getStations(): Rx.Observable<Station[]> {
        let apiUrl = this.apiDomain + this.apiStations;

        return this.http.get(apiUrl)
            .map(x => x.json().data.stations.map(
                s => new Station(s)
            ));
    }
    public getStationsStatus(): Rx.Observable<StationStatusModel[]> {
        let apiUrl = this.apiDomain + this.apiStationsStatus;

        return this.http.get(apiUrl)
            .map(x => x.json().data.stations);
    }

}
