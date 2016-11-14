
import Trip from "../trip/Trip";
import LineRepository from "../line/repository/LineRepository";
import Transfer from "./Transfer";
import FootpathRepository from "./repository/FootpathRepository";
import {Map} from "immutable";

export default class TransferPreCalculation1 {
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
     * Algorithm 1 & 2 (p5). Loop over every stop in every trip and calculate the possible transfers.
     *
     * For efficiency the second algorithm has also been added here. It will remove any unnecessary u-turn transfers.
     *
     * @param trips
     */
    public getTransfers(trips: Trip[]): Map<Trip, Map<number, Transfer[]>> {
        const transfers = Map<Trip, Map<number, Transfer[]>>().asMutable();

        // for each tripT
        for (const tripT of trips) {
            const tripLine = this.lineRepository.lineForTrip(tripT);

            // for each stopQ of tripT after the first stop
            for (let i = 1; i < tripT.stops.length; i++) {

                // get stopQ for all stations connected to tripT.stops[i] by footpath.
                // note that the current stop (tripT.stops[i]) is included with interchange applied.
                for (const stopQ of this.footpathRepository.getConnectedStopsFor(tripT.stops[i])) {

                    // return all lines that pass through stopQ.station and the index, j, of the point they stop
                    for (const [j, line] of this.lineRepository.linesForStation(stopQ.station)) {
                        // don't add transfers to a final destination, if tripT shares a stop we don't need a transfer
                        if (j === line.stoppingStations().length -1) continue;

                        // find the first trip on the line that we can board
                        line.getEarliestTripAt(j, stopQ.arrivalTime).match({
                            none: () => {},
                            some: (tripU: Trip) => {
                                // add the transfer if:
                                // - the line of tripT is not the same as the line of tripU
                                // - tripU dominates tripT (arrives earlier)
                                // - we're transferring to an earlier stop on the same line
                                if (tripLine !== line || tripU.dominates(tripT) || j < i) {
                                    const transfer = new Transfer(tripT, i, tripU, j);

                                    // phase two of the algorithm, removing unnecessary u-turns
                                    if (!transfer.isUTurn() || !transfer.canChangeEarlier(this.footpathRepository.getInterchangeAt(transfer.getStationPriorToTransfer()))) {
                                        transfers.updateIn([transfer.tripT, transfer.stopI], [], prev => prev.concat(transfer));
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }

        return transfers.asImmutable();
    }


}
