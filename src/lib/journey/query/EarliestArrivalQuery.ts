
import LineRepository from "../../line/repository/LineRepository";
import {Station, Time, default as Trip} from "../../trip/Trip";
import {Map, List} from "immutable";
import FootpathRepository from "../../transfer/repository/FootpathRepository";
import Line from "../../line/Line";
import {Duration} from "../../transfer/repository/FootpathRepository";
import NestedTripSegmentQueue from "../NestedTripSegmentQueue";
import Transfer from "../../transfer/Transfer";

declare module "immutable" {
    interface Map<K, V> {
        [Symbol.iterator](): IterableIterator<[K,V]>;
    }
    interface List<T> {
        [Symbol.iterator](): IterableIterator<[T]>;
    }
}

type LineIndex = [Line, number, Duration];

export default class EarliestArrivalQuery {
    private lineRepository: LineRepository;
    private transfers: Map<Trip, Map<number, Transfer[]>>;
    private footpathRepository: FootpathRepository;

    /**
     * @param lineRepository
     * @param transfers
     * @param footpathRepository
     */
    constructor(lineRepository: LineRepository, transfers: Map<Trip, Map<number, Transfer[]>>, footpathRepository: FootpathRepository) {
        this.lineRepository = lineRepository;
        this.transfers = transfers;
        this.footpathRepository = footpathRepository;
    }

    /**
     *
     * @param origin
     * @param destination
     * @param departureTime
     * @returns {any}
     */
    public getJourney(origin: Station, destination: Station, departureTime: Time): Map<number, Time> {
        let destinationLines = this.getDestinationLines(destination);
        let queues = this.getReachableTripSegments(origin, departureTime);
        let numTransfers = 0;
        let earliestArrival = Infinity;
        let results = Map<number, Time>();

        while (!queues.empty(numTransfers)) {
            // for each trip segment in the queue at this depth
            for (const [trip, b, e] of queues.get(numTransfers)) {
                // for each line that takes us to our destination and is connected using the current trip
                for (const [line, i, footpathTime] of destinationLines.get(trip, [])) {
                    // the line arrives before the potential destination (on the same line)
                    // and it improves the final arrival time
                    if (b < i && trip.stops[i].arrivalTime + footpathTime < earliestArrival) {
                        // update the earliest arrival and store the result
                        earliestArrival = trip.stops[i].arrivalTime + footpathTime;
                        results = results.set(numTransfers, earliestArrival);
                    }
                }

                // if the next stop arrives before our best arrival time, look at more relevant transfers
                if (trip.stops[b + 1].arrivalTime < earliestArrival) {
                    // for every stop after the start of the trip segment, up to and including the end
                    for (let i = b + 1; i < e + 1; i++) {
                        // add any transfers from this stop
                        for (const transfer of this.transfers.getIn([trip, i], [])) {
                            queues.add(transfer.tripU, transfer.stopJ, numTransfers + 1);
                        }
                    }
                }
            }

            numTransfers++;
        }

        return results;
    }

    /**
     * Return an index of lines that contain the destination station or a station with a footpath to the destination,
     * the index of the station along the line, the duration of the footpath to the final destination (assuming the
     * station is not the final destination).
     *
     * @param destination
     * @returns {any}
     */
    private getDestinationLines(destination: Station): Map<Trip, LineIndex[]> {
        let lines = Map<Trip, LineIndex[]>();

        for (const [station, duration] of this.footpathRepository.getArrivalsAt(destination)) {
            const time = station === destination ? 0 : duration;

            for (const [index, line] of this.lineRepository.linesForStation(station)) {
                for (const trip of line.trips) {
                    const tripLines = lines.get(trip, []);
                    tripLines.push([line, index, time]);
                    lines = lines.set(trip, tripLines);
                }
            }
        }

        return lines;
    }

    /**
     * Create a queue of reachable trip segments from the origin station
     *
     * @param origin
     * @param departureTime
     * @returns {NestedTripSegmentQueue}
     */
    private getReachableTripSegments(origin: Station, departureTime: Time): NestedTripSegmentQueue {
        const queue = new NestedTripSegmentQueue(this.lineRepository);

        for (const [station, duration] of this.footpathRepository.getArrivalsAt(origin)) {
            const time = station === origin ? departureTime : departureTime + duration;

            for (const [index, line] of this.lineRepository.linesForStation(station)) {
                line.getEarliestTripAt(index, time).match<any>({
                    none: () => {},
                    some: trip => queue.add(trip, index, 0)
                });
            }
        }

        return queue;
    }
}

