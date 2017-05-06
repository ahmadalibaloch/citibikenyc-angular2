import { Component, OnInit } from '@angular/core';
import { MdAutocompleteModule } from '@angular/material';
import { NYCBikeDataService } from "app/services/nycbike-data.service";
import { Station } from "app/entities/station";
import * as Rx from 'rxjs/Rx';
import { StationStatusModel } from "app/entities/stationStatus";
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import { CdAutocomplete } from "app/mdautocomplete/cd-autocomplete.model";
import { CdAutocompleteResponse } from "app/mdautocomplete/cd-autocomplete-response.model";
import { CircleManager, SebmGoogleMapCircle, LatLngBounds } from "angular2-google-maps/core";

@Component({
  selector: 'app-bikemap',
  templateUrl: './bikemap.component.html',
  styleUrls: ['./bikemap.component.css']
})
export class BikemapComponent implements OnInit {
  distance: number = 100;

  lat: number = 40.737580;
  lng: number = -74.005048;
  zoom: number = 13;
  stations: Station[];
  selectedStation: Station;
  circles: SebmGoogleMapCircle[];
  fitBounds: LatLngBounds;

  constructor(private bikeService: NYCBikeDataService, private circleManager: CircleManager) {
    this.stations = [];
    this.selectedStation = new Station({});
    this.circles = [];
  }


  ngOnInit() {
    this.bikeService.getStations().subscribe((stations: Station[]) => {
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
  radiusToZoom(radius: number) {
    return Math.round(20 - Math.log(radius) / Math.LN2);
  }
  onChange(stationName) {
    let selectedStation = this.stations.find(x => x.name == stationName);
    if (!selectedStation) {
      this.zoom = 13;
      this.lat = 40.737580;
      this.lng = -74.005048;
      this.distance = 100;
      this.selectedStation = new Station({});
      return;
    }
    this.lat = selectedStation.lat;
    this.lng = selectedStation.lon;
    this.selectedStation = selectedStation;
    this.setMapZoom(this.distance)
  }
  setMapZoom(radius: number) {
    if (!this.selectedStation.id) {
      return
    }
    this.zoom = this.radiusToZoom(this.distance);
  }

  inputAutocomplete: CdAutocomplete = {
    changeTrigger: false,
    list: []
  };

  filterList(q: string, list: Station[]) {
    return list.filter(function (item) {
      return item.name.toLowerCase().startsWith(q.toLowerCase());
    });
  }

  /* TODO use API here */
  getStations(q: string) {
    this.updateInputAutocompleteData(this.filterList(q, this.stations));
  }

  updateInputAutocomplete(response: CdAutocompleteResponse): void {
    this.getStations(response.q);
  }

  updateInputAutocompleteData(list: Station[]): void {
    this.inputAutocomplete.list = list.map(x => x.name);
    this.inputAutocomplete.changeTrigger = !this.inputAutocomplete.changeTrigger;
  }

}
