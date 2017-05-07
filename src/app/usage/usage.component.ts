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
  _latitude: number = 40.737580;//NYC
  _longitude: number = -74.005048;//NYC
  _zoom: number = 12;
  google: any;
  heatMapType: string = 'busyareas';
  constructor(private mapsApi: GoogleMapsAPIWrapper, private _loader: MapsAPILoader, private bikeService: NYCBikeDataService) {
    this.stationsDataArray = [];
    _loader.load().then(() => {
      this.google = window["google"];
      this.bikeService.getStationsDataSingle().subscribe((stationsDataArray: StationStatusModel[]) => {
        if (this.stationsDataArray.length < 1) {
          this.stationsDataArray = stationsDataArray;
        }
        this.drawHeatMap(this.heatMapType);
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
      this.heatmap.set('radius', this.heatMapRadius ? 15 : null);
  }
  drawHeatMap(heatMapType: string) {
    if (this.heatmap)
      this.heatmap.setMap(null);
    if (!this.map || !this.google) return;
    this.heatmap = new this.google.maps.visualization.HeatmapLayer({
      data: this.getPoints(heatMapType),
      map: this.map
    });
    this.setHeatMapRadius();
  }
  getPoints(heatMapType: string) {
    return this.stationsDataArray.map((s: StationStatusModel) => {
      let weight = 100 - (s.num_bikes_available / s.capacity * 100);//busy
      if (this.heatMapType == "busyareas")
        weight = s.num_docks_available;
      return { location: new this.google.maps.LatLng(s.lat, s.lon), weight: weight };
      //return new this.google.maps.LatLng(s.lat, s.lon);
    });
  }
}
