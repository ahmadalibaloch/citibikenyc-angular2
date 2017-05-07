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
import { MdSliderModule } from '@angular/material';

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
      let page = 0, chunk = 100;
      let toBe = Rx.Observable
        .interval(500)
        .flatMap(() => {
          return Rx.Observable.of(stations.slice(page * chunk, (page * chunk) + chunk))
        }).subscribe(stations => {
          //we are pushing stations in intervals of (100 per) half second to lessen load on map drawing.
          this.stations.push.apply(this.stations, stations);
          if (stations.length < 1) {
            toBe.unsubscribe();
            //after stations are mapped, we will load their status
            this.loadStationsStatus();
          }
          page++;
        })

    });
  }

  loadStationsStatus() {
    this.bikeService.getStationsStatus().subscribe((stationsStatus: StationStatusModel[]) => {
      //Update stations status after every 10 seconds REST API
      //and then update stations status in those ten seconds in intervals again
      let page = 0, chunk = 100;
      let toBe = Rx.Observable
        .interval(1000)
        .flatMap(() => {
          return Rx.Observable.of(stationsStatus.slice(page * chunk, (page * chunk) + chunk))
        }).subscribe(stationsStatus => {
          stationsStatus.forEach(stationStatus => {
            let thisStation = this.stations.find(s => s.id == Number(stationStatus.station_id));
            if (thisStation) {
              //thisStation.status = stationStatus; No just update 3 props to save on angular rebinding
              thisStation.status.num_bikes_available = stationStatus.num_bikes_available;
              thisStation.status.num_docks_available = stationStatus.num_docks_available;
              thisStation.status.last_reported = stationStatus.last_reported;
            }
          });
          if (stationsStatus.length < 1)
            toBe.unsubscribe();
          page++;
        });
    })
  }

  //STATES METHODS

  less50() {
    return this.stations.length ? this.stations.filter(x => x.getIconUrl() == "assets/planned.png").length : "N/A";
  }

  notReporting() {
    return this.stations.length ? this.stations.filter(x => x.status.last_reported < 1).length : "N/A"
  }

  //MAP CODE BELOW
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
    this.distance = 10;
    this.setMapZoom(this.distance)
  }
  setMapZoom(radius: number) {
    if (!this.selectedStation.id) {
      return
    }
    this.zoom = this.radiusToZoom(this.distance);
  }

  //AUTO COMPLETE CODE BELOW - Put in Service
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
