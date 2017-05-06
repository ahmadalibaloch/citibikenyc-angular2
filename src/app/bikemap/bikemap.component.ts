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

@Component({
  selector: 'app-bikemap',
  templateUrl: './bikemap.component.html',
  styleUrls: ['./bikemap.component.css']
})
export class BikemapComponent implements OnInit {

  lat: number = 40.737580;
  lng: number = -74.005048;
  zoom: number = 13;
  stations: Station[];
  thisValue: string;

  constructor(private bikeService: NYCBikeDataService) {
    this.stations = [];
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
  onChange(data) {
    console.log("changed", data);
  }

  inputValue: string = "";
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
