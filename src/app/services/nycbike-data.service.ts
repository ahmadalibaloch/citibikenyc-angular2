import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as Rx from 'rxjs/Rx';
import { Station } from "app/entities/station";
import { StationStatusModel } from "app/entities/stationStatus";
import { Observable } from "rxjs/Observable";

@Injectable()
export class NYCBikeDataService {
    private apiDomain = 'https://gbfs.citibikenyc.com';
    private apiStations = '/gbfs/en/station_information.json';
    private apiStationsStatus = '/gbfs/en/station_status.json';
    private stationsDataPerTime = {};//per 10 seconds
    private observableDataArray: Rx.ReplaySubject<any> = new Rx.ReplaySubject(1);
    private observableStationsStatus: Rx.ReplaySubject<any> = new Rx.ReplaySubject(1);

    constructor(private http: Http) {
        this.getStations().subscribe(stations => {
            this.getStationsStatus().subscribe(stationsStatuses => {
                let timeStr = new Date().toTimeString().substring(0, 8);
                stationsStatuses.forEach(
                    (stationStatus: StationStatusModel) => {
                        let station = stations.find(s => s.id == stationStatus.station_id);
                        stationStatus.capacity = station.capacity;
                        stationStatus.name = station.name;
                        stationStatus.shortName = station.short_name;
                        stationStatus.lat = station.lat;
                        stationStatus.lon = station.lon;
                        stationStatus.lastReportedStr = this.getDateStr(stationStatus.last_reported);
                        stationStatus.iconUrl = this.getIconUrl(stationStatus.num_bikes_available, stationStatus.capacity);
                    });
                this.stationsDataPerTime[timeStr] = stationsStatuses;
                this.observableStationsStatus.next(stationsStatuses);//recent
                this.observableDataArray.next(this.stationsDataPerTime);//over time
            })
        });

    };
    public getIconUrl(bikesAvailable: number, capacity: number) {
        let fiftyP = capacity * 50 / 100;
        if (bikesAvailable < 1)
            return "assets/outOfService.png";
        else if (bikesAvailable < fiftyP)
            return "assets/planned.png";
        else return "assets/in-service.png";
    }
    getDateStr(seconds: number) {
        if (seconds < 1) return "No Update";
        let d = new Date(0);
        d.setSeconds(seconds);
        return d.toLocaleString();
    }
    public getStationsData(): Rx.ReplaySubject<any> {
        return this.observableDataArray;
    }
    public getStationsDataSingle(): Rx.ReplaySubject<any> {
        return this.observableStationsStatus;
    }
    public getStations(): Rx.Observable<Station[]> {
        let apiUrl = this.apiDomain + this.apiStations;
        return this.http.get(apiUrl)
            .map(x => x.json().data.stations.map(
                s => new Station(s)
            ));
    }
    public getStationsStatus(): Rx.Observable<StationStatusModel[]> {
        let apiUrl = this.apiDomain + this.apiStationsStatus;
        let pollData = this.http.get(apiUrl)
            .map(x => x.json().data.stations);
        return pollData.expand(
            () => Rx.Observable.timer(10000).concatMap(() => pollData)
        );
    }
}
