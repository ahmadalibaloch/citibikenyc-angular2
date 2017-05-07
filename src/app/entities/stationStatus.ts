export class StationStatusModel {
    station_id: number;
    num_bikes_available: number;
    num_bikes_disabled: number;
    num_docks_available: number;
    num_docks_disabled: number;
    is_installed: number;
    is_renting: number;
    is_returning: number;
    last_reported: number;
    eightd_has_available_keys: false;

    capacity: number;
    shortName: string;
    name: string;
    lat: number;
    lon: number;
}