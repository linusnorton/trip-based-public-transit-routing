
import LineRepository from "./LineRepository";
import {Option, Some, None} from "ts-option";
import Line from "../Line";
import {Station, default as Trip} from "../../trip/Trip";
import {LineMap} from "../LineFactory";

type LineTripMap = Map<Trip, Line>;
type LineStationMap = Map<Station, Line[]>;

export class InMemoryLineRepository implements LineRepository {
    private lines: Line[];
    private linesByTrip: LineTripMap;
    private linesByStation: LineStationMap;

    /**
     * @param linesByStoppingPattern
     */
    public constructor(linesByStoppingPattern: LineMap) {
        this.lines = [];
        this.linesByTrip = new Map<Trip, Line>();
        this.linesByStation = new Map<Station, Line[]>();

        for (const [_, lines] of linesByStoppingPattern) {
            this.lines.push(...lines);

            // index the lines by each station in the line
            for (const station of lines[0].stoppingStations()) {
                if (this.linesByStation.has(station)) {
                    this.linesByStation.get(station).push(...lines);
                }
                else {
                    this.linesByStation.set(station, lines);
                }
            }

            // set up an index for each trips line
            for (const line of lines) {
                for (const trip of line.trips) {
                    this.linesByTrip.set(trip, line);
                }
            }
        }
    }

    /**
     * @param station
     * @returns {Option<Line[]>}
     */
    public linesForStation(station: Station): Option<Line[]> {
        return this.linesByStation.has(station)
            ? new Some(this.linesByStation.get(station))
            : new None();
    }

    /**
     * @param trip
     * @returns {Option<Line>}
     */
    public lineForTrip(trip: Trip): Option<Line> {
        return this.linesByTrip.has(trip)
            ? new Some(this.linesByTrip.get(trip))
            : new None();
    }
}
