
import Trip from "../trip/Trip";
import LineRepository from "../line/repository/LineRepository";
import {Station} from "../trip/Trip";

interface FootpathRepository {
    stationsConnectedTo(station: Station): Station[];

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
        for (const trip of trips) {
            for (const stop of trip.stops) {
                const stations = this.footpathRepository.stationsConnectedTo(stop.station);

            }
        }
    }

}
