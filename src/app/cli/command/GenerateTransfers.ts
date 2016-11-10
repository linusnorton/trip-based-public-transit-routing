import LineFactory from "../../../lib/line/LineFactory";
import DatabaseLineRepository from "../../../lib/line/repository/DatabaseLineRepository";
import TripRepository from "../../../lib/trip/repository/TripRepository";
import Command from "./Command";
import DatabaseFootpathRepository from "../../../lib/transfer/repository/DatabaseFootpathRepository";
import TransferRepository from "../../../lib/transfer/repository/TransferRepository";
import TransferPreCalculation1 from "../../../lib/transfer/TransferPreCalculation1";
import TransferPreCalculation2 from "../../../lib/transfer/TransferPreCalculation2";
import TransferPreCalculation3 from "../../../lib/transfer/TransferPreCalculation3";

export default class GenerateTransfers implements Command {
    private tripRepository: TripRepository;
    private footpathRepository: DatabaseFootpathRepository;
    private lineRepository: DatabaseLineRepository;
    private transferRepository: TransferRepository;

    /**
     * @param tripRepository
     * @param footpathRepository
     * @param lineRepository
     * @param transferRepository
     */
    constructor(tripRepository: TripRepository, footpathRepository: DatabaseFootpathRepository, lineRepository: DatabaseLineRepository, transferRepository: TransferRepository) {
        this.tripRepository = tripRepository;
        this.footpathRepository = footpathRepository;
        this.lineRepository = lineRepository;
        this.transferRepository = transferRepository;
    }

    /**
     * Generate the lines and transfers for all trips in the database
     */
    public async run(): Promise<void> {
        const [trips, footpathRepository] = await Promise.all([
            this.tripRepository.getTrips(),
            this.footpathRepository.getMemoryRepository()
        ]) ;

        console.info("Loaded trips and footpaths");
        const lineFactory = new LineFactory();
        const lines = lineFactory.getLines(trips);

        console.info("Generated lines");
        const p1 = new TransferPreCalculation1(lines, footpathRepository);
        const p2 = new TransferPreCalculation2(footpathRepository);
        const p3 = new TransferPreCalculation3(footpathRepository, p2.getTransfers(p1.getTransfers(trips)));

        console.info("Calculated initial transfers and filtered u-turns");
        const transfers = p3.getTransfers(trips);
    
        return this.transferRepository.storeTransfers(transfers);
    }

}
