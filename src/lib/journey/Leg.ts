import {Stop, Time} from "../trip/Trip";

export default class Leg {
    stops: Stop[];
    departureTime: Time;
    arrivalTime: Time;

    /**
     * @param stops
     */
    public constructor(stops: Stop[]) {
        this.stops = stops;
        this.departureTime = stops[0].departureTime;
        this.arrivalTime = stops[stops.length - 1].arrivalTime;
    }

}
