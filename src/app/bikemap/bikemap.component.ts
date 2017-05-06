import { Component, OnInit } from '@angular/core';
import { NYCBikeDataService } from "app/services/nycbike-data.service";
import { Station } from "app/entities/station";
import * as Rx from 'rxjs/Rx';
import { StationStatusModel } from "app/entities/stationStatus";
import { plainToClass } from "class-transformer";


@Component({
  selector: 'app-bikemap',
  templateUrl: './bikemap.component.html',
  styleUrls: ['./bikemap.component.css']
})
export class BikemapComponent implements OnInit {

  title: string = 'My first angular2-google-maps project';
  lat: number = 40.737580;
  lng: number = -74.005048;
  zoom: number = 13;
  stations: Station[];

  constructor(private bikeService: NYCBikeDataService) {
    this.stations = [];
  }

  ngOnInit() {
    this.bikeService.getStations().subscribe((stations: Station[]) => {
      this.title = stations.length + "";
      this.stations = stations;
      this.loadStationsStatus();

    });


  }

  loadStationsStatus() {
    this.bikeService.getStationsStatus().subscribe((stationsStatus: StationStatusModel[]) => {
      stationsStatus.forEach(stationStatus => {
        let thisStation = this.stations.find(s => s.id == Number(stationStatus.station_id));
        if (thisStation)
          thisStation.status = stationStatus;
      })
    });
  }

}
