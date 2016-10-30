
import * as chai from "chai";
import Line from "../../../src/lib/line/Line";
import {TripFixtures} from "../trip/TripSpec";
import {InMemoryLineRepository} from "../../../src/lib/line/repository/InMemoryLineRepository";
import InMemoryFootpathRepository from "../../../src/lib/transfer/repository/InMemoryFootpathRepository";
import TransferPreCalculation1 from "../../../src/lib/transfer/TransferPreCalculation1";
import Transfer from "../../../src/lib/transfer/Transfer";

describe("Transfer", () => {

    it("knows when it's a U-turn", () => {
        const transfer = new Transfer(TripFixtures.tripA, 1, TripFixtures.tripC, 1);
        chai.expect(transfer.isUTurn()).to.equal(false);

        const uTurn = new Transfer(TripFixtures.tripF, 2, TripFixtures.tripG, 1);
        chai.expect(uTurn.isUTurn()).to.equal(true);
    });

    it("knows if the transfer can be made at an earlier stop", () => {
        const uTurn = new Transfer(TripFixtures.tripF, 2, TripFixtures.tripG, 1);
        chai.expect(uTurn.canChangeEarlier(0)).to.equal(true);
        chai.expect(uTurn.canChangeEarlier(100)).to.equal(false);
    });

    it("returns the stops after the transfer", () => {
        const transfer = new Transfer(TripFixtures.tripF, 2, TripFixtures.tripG, 1);
        chai.expect(transfer.stopsAfterTransfer()).to.deep.equal(transfer.tripU.stops.slice(2));
    });

});
