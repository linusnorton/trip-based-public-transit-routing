
import {Map, List} from "immutable";
import Trip from "../trip/Trip";
import LineRepository from "../line/repository/LineRepository";

type TripSegment = [Trip, number, number];

export default class NestedTripSegmentQueue {
    private items: List<List<TripSegment>>;
    private tripStopIndex: Map<Trip, number>; //earliest stop we can arrive a each trip???
    private lineRepository: LineRepository;

    constructor(lineRepository: LineRepository) {
        this.items = List();
        this.tripStopIndex = Map<Trip, number>();
        this.lineRepository = lineRepository;
    }

    public add(tripT: Trip, stopIndex: number, depth: number): void {
        const oldStopIndex = this.tripStopIndex.get(tripT, Infinity);

        if (stopIndex < oldStopIndex) {
            this.items.update(depth, List, prev => prev.push([tripT, stopIndex, oldStopIndex]));

            for (const tripU of this.lineRepository.lineForTrip(tripT).tripsAfterAndIncluding(tripT)) {
                this.tripStopIndex.update(tripU, Infinity, prev => Math.min(prev, stopIndex));
            }
        }
    }

    public empty(depth: number): boolean {
        return this.items[depth].length > 0;
    }

    public get(depth: number): List<TripSegment> {
        return this.items.get(depth);
    }

}