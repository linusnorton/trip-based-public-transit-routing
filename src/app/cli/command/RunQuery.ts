
import Command from "./Command";
import TripRepository from "../../../lib/trip/repository/TripRepository";
import TransferRepository from "../../../lib/transfer/repository/TransferRepository";
import EarliestArrivalQuery from "../../../lib/journey/query/EarliestArrivalQuery";
import DatabaseFootpathRepository from "../../../lib/transfer/repository/DatabaseFootpathRepository";
import LineFactory from "../../../lib/line/LineFactory";

export default class RunQuery implements Command {
    private tripRepository: TripRepository;
    private transferRepository: TransferRepository;
    private footpathRepository: DatabaseFootpathRepository;

    /**
     * @param tripRepository
     * @param transferRepository
     * @param footpathRepository
     */
    constructor(tripRepository: TripRepository, transferRepository: TransferRepository, footpathRepository: DatabaseFootpathRepository) {
        this.tripRepository = tripRepository;
        this.transferRepository = transferRepository;
        this.footpathRepository = footpathRepository;
    }

    /**
     * @returns {Promise<void>}
     */
    public async run(): Promise<void> {
        const footpaths = await this.footpathRepository.getMemoryRepository();
        const trips = await this.tripRepository.getTrips();
        const transfers = await this.transferRepository.getTransfers(trips);

        console.log("Loaded trips and transfers");
        const lineFactory = new LineFactory();
        const lines = lineFactory.getLines(trips);

        console.log("Performing query");
        const query = new EarliestArrivalQuery(lines, transfers, footpaths);
        console.log("query finished");

        const result = query.getJourney("DIS", "WWW", 3600 * 5);

        for (const journey of result.getJourneys()) {
            console.log(`${journey.origin}->${journey.destination}: ${displayTime(journey.duration())}`);
            for (const leg of journey.legs) {
                console.log(" ----");
                for (const stop of leg.stops) {
                    console.log(`  ${stop.station} ${displayTime(stop.departureTime)}`);
                }
            }
        }
    }

}

function displayTime(timestamp: number) {
    let hours   = Math.floor(timestamp / 3600);
    let minutes = Math.floor((timestamp - (hours * 3600)) / 60);
    let mins = (minutes < 10) ? "0" + minutes : minutes;

    return hours+':'+mins;
}