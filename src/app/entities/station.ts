import { StationStatusModel } from "app/entities/stationStatus";

export class Station {
    public id: number;
    public name: string;
    public short_name: string;
    public lat: number;
    public lon: number;
    public capacity: number;

    public region_id: number;

    public status: StationStatusModel;
    public lastReported() {
        if (this.status) {
            let d = new Date(0);
            d.setSeconds(this.status.last_reported);
            return d.toLocaleString();;
        }
        else return "No updated recently"
    }
    //
    public iconUrl: string;
    public getIconUrl() {
        if (!this.status)
            return "assets/outOfService.png";
        let fiftyP = this.capacity * 50 / 100;
        if (this.status.num_bikes_available < 1)
            return "assets/outOfService.png";
        else if (this.status.num_bikes_available < fiftyP)
            return "assets/planned.png";
        else return "assets/in-service.png";
    }
    constructor(station: any) {
        this.capacity = station.capacity;
        this.id = station.station_id;
        this.lat = station.lat;
        this.lon = station.lon;
        this.name = station.name;
        this.short_name = station.short_name;
        this.region_id = station.region_id;
        this.status = new StationStatusModel();
    }
}
