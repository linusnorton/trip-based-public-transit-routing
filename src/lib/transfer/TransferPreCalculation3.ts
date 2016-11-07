
import Transfer from "./Transfer";
import Trip from "../trip/Trip";
import {Station, Time} from "../trip/Trip";
import FootpathRepository from "./repository/FootpathRepository";
import {Stop} from "../trip/Trip";
import {Map} from "immutable";

export default class TransferPreCalculation3 {
    private footpathRepository: FootpathRepository;
    private transfers: Map<Trip, Map<number, Transfer[]>>;

    /**
     * @param footpathRepository
     * @param transfers
     */
    public constructor(footpathRepository: FootpathRepository, transfers: Transfer[]) {
        this.footpathRepository = footpathRepository;
        this.transfers = Map<Trip, Map<number, Transfer[]>>().withMutations(map => {
            for (const transfer of transfers) {
                map.updateIn([transfer.tripT, transfer.stopI], [], prev => prev.concat(transfer));
            }
        });
    }

    /**
     * Iterate through each trip checking to see which transfers improve the arrival time. Return the set of all
     * transfers that were useful to a trip.
     *
     * @param trips
     * @returns {Transfer[]}
     */
    public getTransfers(trips: Trip[]): Map<Trip, Map<number, Transfer[]>> {
        let results = Map<Trip, Map<number, Transfer[]>>();

        for (const trip of trips) {
            results = results.set(trip, this.getTransfersForTrip(trip));
        }

        return results;
    }

    /**
     * Return the transfers that improve this trip's arrival time at any station along the trip.
     *
     * @param trip
     * @returns {Transfer[]}
     */
    private getTransfersForTrip = (trip: Trip): Map<number, Transfer[]> => {
        let arrivals = Map<Station, Time>();
        let departures = Map<Station, Time>();

        // Return any transfers passing through the given stop that improve the arrival or departure time
        const getTransfersForStop = (stopS: Stop, i: number): Transfer[] => {
            updateArrivalAndDepartureTimesFromStop(stopS);

            return this.transfers.getIn([trip, i], []).filter(transfer => {
                // keep the transfer if it improves any arrival/departure times at any stop after the change
                return transfer.stopsAfterTransfer().filter(updateArrivalAndDepartureTimesFromStop).length > 0;
            });
        };

        // update the arrival & departure time at the given stop, returning true if the stop improves any time
        const updateArrivalAndDepartureTimesFromStop = (stopP: Stop): boolean => {
            let keep = stopP.arrivalTime < arrivals.get(stopP.station, Infinity);

            arrivals = arrivals.update(stopP.station, Infinity, prev => Math.min(stopP.arrivalTime, prev));

            for (const stopQ of this.footpathRepository.getConnectedStopsFor(stopP)) {
                keep = keep || stopQ.arrivalTime < arrivals.get(stopQ.station, Infinity)
                            || stopQ.arrivalTime < departures.get(stopQ.station, Infinity);

                arrivals = arrivals.update(stopQ.station, Infinity, prev => Math.min(stopQ.arrivalTime, prev));
                departures = departures.update(stopQ.station, Infinity, prev => Math.min(stopQ.arrivalTime, prev));
            }

            return keep;
        };

        let transfers = Map<number, Transfer[]>();

        // iterate back from the last stop to the second stop, len(stops) -1 ... 1 storing the useful transfers
        for (let i = trip.stops.length - 1; i > 0; i--) {
            transfers = transfers.set(i, getTransfersForStop(trip.stops[i], i));
        }

        return transfers;
    }
}

