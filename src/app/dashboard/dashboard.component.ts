import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as Chart from 'chart.js'
import { NYCBikeDataService } from "app/services/nycbike-data.service";
import { Station } from "app/entities/station";
import * as Rx from 'rxjs/Rx';
import { StationStatusModel } from "app/entities/stationStatus";
import { CdAutocomplete } from "app/mdautocomplete/cd-autocomplete.model";
import { CdAutocompleteResponse } from "app/mdautocomplete/cd-autocomplete-response.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stations: Station[];
  stationSelected: Station;
  stationsDataArray: any[];
  stationsDataSingle: StationStatusModel[];
  dashItems: any[];
  constructor(private bikeService: NYCBikeDataService) { };


  ngOnInit() {
    this.stations = [];
    this.dashItems = [{ loading: true }, { loading: true }, { loading: true }, { loading: true }];
    this.stationsDataSingle = [];
    this.stationsDataArray = [];

    //===============
    this.bikeService.getStations().subscribe((stations: Station[]) => {
      this.stations.push.apply(this.stations, stations);
      //this.loadStationsStatus();
    });
    this.bikeService.getStationsData().subscribe((stationsDataArray: any[]) => {
      this.stationsDataArray = stationsDataArray;
      this.updateChartsData(stationsDataArray);
    });
    this.bikeService.getStationsDataSingle().subscribe((stationsDataSingle: StationStatusModel[]) => {
      this.stationsDataSingle = stationsDataSingle;
      this.updateChartsDataSingle(stationsDataSingle);
    });
  }
  onStationChange(stationName) {
    this.stationSelected = this.stations.find(x => x.name == stationName);
    //console.log("Station Selected", stationName);
    this.updateChartsData(this.stationsDataArray);
    this.updateChartsDataSingle(this.stationsDataSingle);
  }
  //=========END=ngOnInit
  updateChartsData(stationsDataArray: any[]) {
    //==========BAR CHART
    let barDataArray = [{ data: [], label: "available bikes" }, { data: [], label: "available docks" }];

    let barLabels = [];
    let stationSelectedName: string = this.stations.length + " stations data";
    for (let key in stationsDataArray) {
      let filteredData = stationsDataArray[key];
      if (this.stationSelected) {
        filteredData = filteredData.filter(x => x.station_id == this.stationSelected.id);
        stationSelectedName = `(${this.stationSelected.name})`;
      }
      let availableBikesCount = filteredData.map(x => x.num_bikes_available).reduce((x, y) => x + y, 0);
      let availableDocksCount = filteredData.map(x => x.num_docks_available).reduce((x, y) => x + y, 0);
      barDataArray[0].data.push(availableBikesCount);
      barDataArray[1].data.push(availableDocksCount);
      barLabels.push(key);
    }
    let barChart = this.createDashItem("BAR CHART - Total Bikes Status " + stationSelectedName, "Number of bikes and docks available over time of ten seconds interval", 'bar', barLabels, barDataArray, { scaleShowVerticalLines: false, responsive: true });
    this.dashItems[0] = barChart;
    //==========LINE CHART
    let lineChart = this.createDashItem("LINE CHART - Total Bikes Status " + stationSelectedName, "Number of bikes and docks available over time of ten seconds interval", 'line', barLabels, barDataArray, { responsive: true });
    this.dashItems[1] = lineChart;

  }
  updateChartsDataSingle(stationsData) {
    let stationSelectedName: string = this.stations.length + " stations data";
    let filteredData0 = [];
    if (!_.isEmpty(this.stationsDataArray))
      filteredData0 = this.stationsDataArray[Object.keys(this.stationsDataArray)[0]];
    if (this.stationSelected) {
      stationsData = stationsData.filter(x => x.station_id == this.stationSelected.id);
      filteredData0 = filteredData0.filter(x => x.station_id == this.stationSelected.id);
      stationSelectedName = `(${this.stationSelected.name})`;
    }
    //==========PIE CHART 
    let pieDataArray = [];
    let stationsZeroBikes = stationsData.filter(x => x.num_bikes_available < 1).length;
    let stations50PlusBikes = stationsData.filter((x: StationStatusModel) => x.num_bikes_available > x.capacity * 50 / 100).length;
    let stations50MinusBikes = stationsData.filter((x: StationStatusModel) => x.num_bikes_available < x.capacity * 50 / 100).length;
    let pieLabels = [`stations with zero bikes (${stationsZeroBikes})`, `over 50% (${stations50PlusBikes})`, `less 50% (${stations50MinusBikes})`];
    pieDataArray.push(stationsZeroBikes);
    pieDataArray.push(stations50MinusBikes);
    pieDataArray.push(stations50PlusBikes);
    let pieChart = this.createDashItem("PIE CHART - Total Stations Status " + stationSelectedName, "Stations with number of over and less than 50 percent available bikes", 'pie', pieLabels, pieDataArray, null);
    this.dashItems[2] = pieChart;
    //==========RADAR CHART
    // //first records
    if (!filteredData0.length) return;
    let availableBikesCount0 = filteredData0.map(x => x.num_bikes_available).reduce((x, y) => x + y, 0);
    let availableDocksCount0 = filteredData0.map(x => x.num_docks_available).reduce((x, y) => x + y, 0);
    let disabledBikesCount0 = filteredData0.map(x => x.num_bikes_disabled).reduce((x, y) => x + y, 0);
    let disabledDocksCount0 = filteredData0.map(x => x.num_docks_disabled).reduce((x, y) => x + y, 0);
    //last record
    let availableBikesCount = stationsData.map(x => x.num_bikes_available).reduce((x, y) => x + y, 0);
    let availableDocksCount = stationsData.map(x => x.num_docks_available).reduce((x, y) => x + y, 0);
    let disabledBikesCount = stationsData.map(x => x.num_bikes_disabled).reduce((x, y) => x + y, 0);
    let disabledDocksCount = stationsData.map(x => x.num_docks_disabled).reduce((x, y) => x + y, 0);
    let radarDataArray = [{ data: [], label: "First Record" }, { data: [], label: "Now" }];
    let radarLabels = ["Available Bikes", "Available Docks", "Disabled Bikes", "Disabled Docks"]
    radarDataArray[0].data.push(availableBikesCount0);
    radarDataArray[0].data.push(availableDocksCount0);
    radarDataArray[0].data.push(disabledBikesCount0);
    radarDataArray[0].data.push(disabledDocksCount0);
    //===
    radarDataArray[1].data.push(availableBikesCount);
    radarDataArray[1].data.push(availableDocksCount);
    radarDataArray[1].data.push(disabledBikesCount);
    radarDataArray[1].data.push(disabledDocksCount);
    let radarChart = this.createDashItem("RADAR CHART - Total Bikes Status " + stationSelectedName, "Number of bikes, docks, disabled bike and docks over time of ten seconds interval", 'radar', radarLabels, radarDataArray, { responsive: true });
    this.dashItems[3] = radarChart;

  }
  //====================
  createDashItem(title: string, desc: string, type: string, labels: string[], data: any, options: any) {
    let chartData: any = {
      type: type,
      labels: labels,
      data: data
    }
    if (options)
      chartData.options = options;
    return {
      title: title,
      description: desc,
      chartData: chartData,
      type: type
    }
  }
  //=====================
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
