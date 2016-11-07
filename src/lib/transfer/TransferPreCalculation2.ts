
import Transfer from "./Transfer";
import FootpathRepository from "./repository/FootpathRepository";

export default class TransferPreCalculation2 {
    private footpathRepository: FootpathRepository;

    /**
     * @param footpathRepository
     */
    constructor(footpathRepository: FootpathRepository) {
        this.footpathRepository = footpathRepository;
    }

    /**
     * Remove transfers that are a U-turn where a transfer is possible at the preceding stop.
     *
     * @param transfers
     * @returns {Transfer[]}
     */
    public getTransfers(transfers: Transfer[]): Transfer[] {
        return transfers.filter(transfer => {
            const interchange = this.footpathRepository.getInterchangeAt(transfer.getStationPriorToTransfer());

            return !(transfer.isUTurn() && transfer.canChangeEarlier(interchange));
        });
    }
}