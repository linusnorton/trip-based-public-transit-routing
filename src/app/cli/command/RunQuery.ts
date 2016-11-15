
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

        console.log(query.getJourney("MYB", "WWW", 3600 * 5));
    }



}