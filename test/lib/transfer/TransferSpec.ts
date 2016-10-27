
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

    it("knows when the U-turn is quicker", () => {
        const uTurn = new Transfer(TripFixtures.tripF, 2, TripFixtures.tripG, 1);
        chai.expect(uTurn.uTurnIsQuicker()).to.equal(false);
    });

});
