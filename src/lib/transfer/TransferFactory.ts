
import Trip from "../trip/Trip";
import LineRepository from "../line/repository/LineRepository";
import {Station} from "../trip/Trip";

type Duration = number;

interface FootpathRepository {
    stationsConnectedTo(station: Station): Station[];
    getDuration(station: Station, station: Station): Duration;
}

class Transfer {

}

export default class TransferFactory {
    private lineRepository: LineRepository;
    private footpathRepository: FootpathRepository;

    /**
     * @param lineRepository
     * @param footpathRepository
     */
    constructor(lineRepository: LineRepository, footpathRepository: FootpathRepository) {
        this.lineRepository = lineRepository;
        this.footpathRepository = footpathRepository;
    }

    /**
     *
     * @param trips
     */
    public getTransfers(trips: Trip[]) {

    }

    /**
     * Algorithm 1 (p5). Loop over every stop in every trip and calculate the possible transfers
     *
     * @param trips
     */
    private generateTransfers(trips: Trip[]) {
        const transfers = [];

        for (const trip of trips) {
            const tripLine = this.lineRepository.lineForTrip(trip);

            for (let i = 1; i < trip.stops.length; i++) {
                const stop = trip.stops[i];
                const stations = this.footpathRepository.stationsConnectedTo(stop.station);

                for (const station of [stop.station, ...stations]) {
                    // if station === stop.station interchange is applied
                    const arrivalTime = stop.arrivalTime + this.footpathRepository.getDuration(stop.station, station);

                    for (const line of this.lineRepository.linesForStation(station)) {
                        for (const tripB of line.trips) {
                            for (let j = tripB.indexOf(station); j < tripB.stops.length - 1; j++) {
                                const stopB = tripB.stops[j];

                                // TODO i < j
                                if (stopB.departureTime > arrivalTime && line != tripLine && !trip.dominates(tripB)) {
                                    transfers.push(new Transfer(trip, station, tripB, stopB));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}
