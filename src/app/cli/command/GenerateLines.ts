import LineFactory from "../../../lib/line/LineFactory";
import LineRepository from "../../../lib/line/repository/LineRepository";
import TripRepository from "../../../lib/trip/repository/TripRepository";

export default class GenerateLines {
    private lineRepository: LineRepository;
    private tripRepository: TripRepository;
    private lineFactory: LineFactory;

    /**
     * @param lineRepository
     * @param tripRepository
     * @param lineGenerator
     */
    constructor(lineRepository: LineRepository, tripRepository: TripRepository, lineGenerator: LineFactory) {
        this.lineRepository = lineRepository;
        this.tripRepository = tripRepository;
        this.lineFactory = lineGenerator;
    }

    /**
     *
     */
    public async run(): Promise<void> {

    }

}
