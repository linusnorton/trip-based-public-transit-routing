
import {Option} from "ts-option";
import {Station, default as Trip} from "../../trip/Trip";
import Line from "../Line";

interface LineRepository {
    linesForStation(station: Station): Option<Line[]>;
    lineForTrip(trip: Trip): Option<Line>;
}

export default LineRepository;

