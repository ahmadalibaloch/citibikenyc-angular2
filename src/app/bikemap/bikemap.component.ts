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
  stations50MinusBikesCount: number;
  stations50PlusBikesCount: number;
  stationsZeroBikesCount: number;
  distance: number = 100;

  lat: number = 40.737580;
  lng: number = -74.005048;
  zoom: number = 13;
  selectedStation: StationStatusModel;
  stationsDataArray: StationStatusModel[];
  inputValue: string;
  circles: SebmGoogleMapCircle[];
  fitBounds: LatLngBounds;

  constructor(private bikeService: NYCBikeDataService, private circleManager: CircleManager) {
    this.selectedStation = new StationStatusModel();
    this.circles = [];
    this.stationsDataArray = [];
  }

  ngOnInit() {
    this.bikeService.getStationsDataSingle().subscribe((stationsDataArray: StationStatusModel[]) => {
      stationsDataArray.forEach(
        ns => {
          //only update needed props for best performance and minimal redraw
          let so = this.stationsDataArray.find(s => s.station_id == ns.station_id);
          if (!so) {
            this.stationsDataArray.push(ns);
            return;
          }
          if (ns.num_bikes_available != so.num_bikes_available)
            so.num_bikes_available = ns.num_bikes_available;
          if (ns.num_docks_available != so.num_docks_available)
            so.num_docks_available = ns.num_docks_available;
          if (ns.last_reported != so.last_reported)
            so.last_reported = ns.last_reported;
        }
      );
      this.stationsZeroBikesCount = stationsDataArray.filter(x => x.num_bikes_available < 1).length;
      this.stations50PlusBikesCount = stationsDataArray.filter((x: StationStatusModel) => x.num_bikes_available > x.capacity * 50 / 100).length;
      this.stations50MinusBikesCount = stationsDataArray.filter((x: StationStatusModel) => x.num_bikes_available < x.capacity * 50 / 100).length;
    });
  }

  //MAP CODE BELOW
  radiusToZoom(radius: number) {
    return Math.round(20 - Math.log(radius) / Math.LN2);
  }
  onStationChange(stationName) {
    let selectedStation = this.stationsDataArray.find(x => x.name == stationName);
    if (!selectedStation) {
      this.zoom = 13;
      this.lat = 40.737580;
      this.lng = -74.005048;
      this.distance = 100;
      this.selectedStation = new StationStatusModel();
      return;
    }
    this.lat = selectedStation.lat;
    this.lng = selectedStation.lon;
    this.selectedStation = selectedStation;
    this.distance = 10;
    this.setMapZoom(this.distance)
  }
  setMapZoom(radius: number) {
    if (!this.selectedStation.station_id) {
      return
    }
    this.zoom = this.radiusToZoom(this.distance);
  }

  //AUTO COMPLETE CODE BELOW - Put in Service
  inputAutocomplete: CdAutocomplete = {
    changeTrigger: false,
    list: []
  };

  filterList(q: string, list: StationStatusModel[]) {
    return list.filter(function (item) {
      return item.name.toLowerCase().startsWith(q.toLowerCase());
    });
  }
  /* TODO use API here */
  getStations(q: string) {
    this.updateInputAutocompleteData(this.filterList(q, this.stationsDataArray));
  }

  updateInputAutocomplete(response: CdAutocompleteResponse): void {
    this.getStations(response.q);
  }

  updateInputAutocompleteData(list: StationStatusModel[]): void {
    this.inputAutocomplete.list = list.map(x => x.name);
    this.inputAutocomplete.changeTrigger = !this.inputAutocomplete.changeTrigger;
  }

}
