
import LineRepository from "./LineRepository";
import {Option, Some, None} from "ts-option";
import Line from "../Line";
import {Station, default as Trip} from "../../trip/Trip";
import {LineMap} from "../LineFactory";

type LineTripMap = Map<Trip, Line>;
type LineWithIndex = [number, Line];
type LineStationMap = Map<Station, LineWithIndex[]>;

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
        this.linesByStation = new Map<Station, LineWithIndex[]>();

        for (const [_, lines] of linesByStoppingPattern) {
            const stoppingStations = lines[0].stoppingStations();
            this.lines.concat(lines);

            // index the lines by each station in the line, storing both the line and and the index of the station
            for (let j = 0; j < stoppingStations.length; j++) {
                const station = lines[0].stoppingStations()[j];

                if (this.linesByStation.has(station)) {
                    this.linesByStation.get(station).concat(lines.map((line): LineWithIndex => [j, line]));
                }
                else {
                    this.linesByStation.set(station, lines.map((line): LineWithIndex => [j, line]));
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
     * @returns {[number, Line][]}
     */
    public linesForStation(station: Station): [number, Line][] {
        return this.linesByStation.has(station)
            ? this.linesByStation.get(station)
            : [];
    }

    /**
     * @param trip
     * @returns {Line}
     */
    public lineForTrip(trip: Trip): Line {
        return this.linesByTrip.get(trip);
    }
}
