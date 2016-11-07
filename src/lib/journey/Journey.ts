
import Leg from "./Leg";
import {Time} from "../trip/Trip";

export default class Journey {
    legs: Leg[];
    departureTime: Time;
    arrivalTime: Time;

    /**
     * @param legs
     */
    public constructor(legs: Leg[]) {
        this.legs = legs;
        this.departureTime = legs[0].departureTime;
        this.arrivalTime = legs[legs.length -1].arrivalTime;
    }

    /**
     * @param journey
     */
    public dominates(journey: Journey): boolean {
        return this.legs.length <= journey.legs.length
            && this.departureTime >= journey.departureTime
            && this.arrivalTime <= journey.arrivalTime;
    }

}
