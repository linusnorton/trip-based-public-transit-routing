import LineFactory from "../../../lib/line/LineFactory";
import TripRepository from "../../../lib/trip/repository/TripRepository";
import Command from "./Command";
import DatabaseFootpathRepository from "../../../lib/transfer/repository/DatabaseFootpathRepository";
import TransferRepository from "../../../lib/transfer/repository/TransferRepository";
import TransferPreCalculation1 from "../../../lib/transfer/TransferPreCalculation1";
import TransferPreCalculation3 from "../../../lib/transfer/TransferPreCalculation3";

export default class GenerateTransfers implements Command {
    private tripRepository: TripRepository;
    private footpathRepository: DatabaseFootpathRepository;
    private dbFactory;

    /**
     * @param tripRepository
     * @param footpathRepository
     * @param dbFactory
     */
    constructor(tripRepository: TripRepository, footpathRepository: DatabaseFootpathRepository, dbFactory) {
        this.tripRepository = tripRepository;
        this.footpathRepository = footpathRepository;
        this.dbFactory = dbFactory;
    }

    /**
     * Generate the lines and transfers for all trips in the database
     */
    public async run(): Promise<void> {
        console.log(process.memoryUsage());
        const [trips, footpathRepository] = await Promise.all([
            this.tripRepository.getTrips(),
            this.footpathRepository.getMemoryRepository()
        ]) ;
        console.info("Loaded trips and footpaths");
        console.log(process.memoryUsage());
        const lineFactory = new LineFactory();
        const lines = lineFactory.getLines(trips);

        console.info("Generated lines");
        console.log(process.memoryUsage());
        const p1 = new TransferPreCalculation1(lines, footpathRepository);
        const p3 = new TransferPreCalculation3(footpathRepository, p1.getTransfers(trips));

        console.info("Calculated initial transfers and filtered u-turns");
        console.log(process.memoryUsage());
        const transfers = p3.getTransfers(trips);

        console.info("Removed useless transfers");
        console.log(process.memoryUsage());
        const db = this.dbFactory();
        const transferRepository = new TransferRepository(db);

        try {
            await transferRepository.storeTransfers(transfers);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            db.end();
        }
    }

}
