
import {Station, default as Trip} from "../../trip/Trip";
import Line from "../Line";

interface LineRepository {
    linesForStation(station: Station): [number, Line][];
    lineForTrip(trip: Trip): Line;
}

export default LineRepository;

