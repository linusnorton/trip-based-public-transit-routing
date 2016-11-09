
import LineRepository from "./LineRepository";
import Line from "../Line";
import {Station, default as Trip} from "../../trip/Trip";
import {LineMap} from "../LineFactory";
import {Map} from "immutable";

declare module "immutable" {
    interface Map<K, V> {
        [Symbol.iterator](): IterableIterator<[K,V]>;
    }
}

type LineTripMap = Map<Trip, Line>;
type LineWithIndex = [number, Line];
type LineStationMap = Map<Station, LineWithIndex[]>;

export default class InMemoryLineRepository implements LineRepository {
    private lines: Line[];
    private linesByTrip: LineTripMap;
    private linesByStation: LineStationMap;

    /**
     * @param linesByStoppingPattern
     */
    public constructor(linesByStoppingPattern: LineMap) {
        this.lines = [];
        this.linesByTrip = Map<Trip, Line>();
        this.linesByStation = Map<Station, LineWithIndex[]>();

        for (const [_, lines] of linesByStoppingPattern) {
            const stoppingStations = lines[0].stoppingStations();
            this.lines.concat(lines);

            // index the lines by each station in the line, storing both the line and and the index of the station
            for (let j = 0; j < stoppingStations.length; j++) {
                const station = lines[0].stoppingStations()[j];
                const currentValue = this.linesByStation.get(station, []);
                const linesWithIndex = lines.map((line): LineWithIndex => [j, line]);

                this.linesByStation = this.linesByStation.set(station, currentValue.concat(linesWithIndex));
            }

            // set up an index for each trip's line
            for (const line of lines) {
                for (const trip of line.trips) {
                    this.linesByTrip = this.linesByTrip.set(trip, line);
                }
            }
        }
    }

    /**
     * @param station
     * @returns {[number, Line][]}
     */
    public linesForStation(station: Station): [number, Line][] {
        return this.linesByStation.get(station, []);
    }

    /**
     * @param trip
     * @returns {Line}
     */
    public lineForTrip(trip: Trip): Line {
        return this.linesByTrip.get(trip);
    }

    public getLines(): Line[] {
        return this.lines;
    }
}
