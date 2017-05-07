import { Component, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper, LatLngBounds, SebmGoogleMapCircle, LatLngLiteral, MapsAPILoader } from "angular2-google-maps/core";
import { MapOptions } from "angular2-google-maps/core/services/google-maps-types";
import { NYCBikeDataService } from "app/services/nycbike-data.service";
import { StationStatusModel } from "app/entities/stationStatus";

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent implements OnInit {
  heatMapRadius: boolean;
  heatmap: any;
  stationsDataArray: any;
  map: any;
  mapOptions: MapOptions;
  mapCenter: LatLngLiteral;
  _latitude: number = 40.737580;
  _longitude: number = -74.005048;
  _zoom: number = 13;
  google: any;
  heatMapType: string;
  constructor(private mapsApi: GoogleMapsAPIWrapper, private _loader: MapsAPILoader, private bikeService: NYCBikeDataService) {
    this.stationsDataArray = [];
    _loader.load().then(() => {
      this.google = window["google"];
      this.bikeService.getStationsDataSingle().subscribe((stationsDataArray: StationStatusModel[]) => {
        if (this.stationsDataArray.length < 1) {
          this.stationsDataArray = stationsDataArray;
          return;
        }
        this.drawHeatMap();
      })
    });
  }

  ngOnInit() {
    let heatMapDiv = document.getElementById("heatmap");
    let mapOptions: any = {
      center: { lat: this._latitude, lng: this._longitude },
      zoom: this._zoom,
      disableDefaultUI: false,
      backgroundColor: null,
      draggableCursor: true,
      draggingCursor: true,
      keyboardShortcuts: false,
      zoomControl: true
    };
    this.mapsApi.createMap(heatMapDiv, mapOptions);
    this.mapsApi.getNativeMap().then((map: any) => {
      this.map = map;
      console.log("Google", this.google);
      console.log("Got the map", this.map);
    });
  }
  setHeatMapRadius() {
    if (this.heatmap)
      this.heatmap.set('radius', this.heatMapRadius ? 20 : null);
  }
  drawHeatMap() {
    if (this.heatmap)
      this.heatmap.setMap(null);
    if (!this.map || !this.google) return;
    this.heatmap = new this.google.maps.visualization.HeatmapLayer({
      data: this.getPoints(),
      map: this.map
    });
    this.heatmap.set('radius', this.heatMapRadius ? 20 : null);
  }
  getPoints() {
    return this.stationsDataArray.map((s: StationStatusModel) => {
      let weight = s.capacity * s.num_docks_available / 100;//busy
      if (this.heatMapType == "slow")
        weight = s.capacity - (s.capacity * s.num_docks_available / 100);
      return { location: new this.google.maps.LatLng(s.lat, s.lon), weight: weight };
      //return new this.google.maps.LatLng(s.lat, s.lon);
    });
  }
}
