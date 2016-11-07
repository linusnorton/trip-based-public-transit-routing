
import * as chai from "chai";
import {TripFixtures} from "../trip/TripSpec";
import InMemoryFootpathRepository from "../../../src/lib/transfer/repository/InMemoryFootpathRepository";
import TransferPreCalculation3 from "../../../src/lib/transfer/TransferPreCalculation3";
import Transfer from "../../../src/lib/transfer/Transfer";
import {Map} from 'immutable';

describe("Transfer pre-calculation step 3", () => {

    it("keep a transfer that takes you to an unvisited station", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1}),
            "D": Map({"D": 1}),
        }));

        const transfers = [new Transfer(TripFixtures.tripA, 2, TripFixtures.tripF, 2)];
        const trips = [TripFixtures.tripA, TripFixtures.tripF];
        const algorithm = new TransferPreCalculation3(footpathRepo, transfers);
        const expected = Map()
            .set(TripFixtures.tripA, Map().set(2, transfers).set(1, []))
            .set(TripFixtures.tripF, Map().set(3, []).set(2, []).set(1, []));

        chai.expect(algorithm.getTransfers(trips)).to.deep.equal(expected);
    });

    it("discards transfers that don't improve the arrival times", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1})
        }));

        const transfers = [new Transfer(TripFixtures.tripA, 1, TripFixtures.tripC, 1)];
        const trips = [TripFixtures.tripA, TripFixtures.tripC];
        const algorithm = new TransferPreCalculation3(footpathRepo, transfers);
        const expected = Map()
            .set(TripFixtures.tripA, Map().set(2, []).set(1, []))
            .set(TripFixtures.tripC, Map().set(2, []).set(1, []));

        chai.expect(algorithm.getTransfers(trips)).to.deep.equal(expected);
    });

    it("keep transfers that improve the arrival times at stations that have been visited", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1})
        }));

        const transfers = [new Transfer(TripFixtures.tripB, 1, TripFixtures.tripC, 1)];
        const trips = [TripFixtures.tripB, TripFixtures.tripC];
        const algorithm = new TransferPreCalculation3(footpathRepo, transfers);
        const expected = Map()
            .set(TripFixtures.tripB, Map().set(2, []).set(1, transfers))
            .set(TripFixtures.tripC, Map().set(2, []).set(1, []));

        chai.expect(algorithm.getTransfers(trips)).to.deep.equal(expected);
    });

    // this case is logically stupid but correct as it adds an arrival time at A
    it("keeps transfers that take you back to the origin", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1}),
            "D": Map({"D": 1})
        }));

        const transfers = [new Transfer(TripFixtures.tripF, 1, TripFixtures.tripG, 2)];
        const trips = [TripFixtures.tripF, TripFixtures.tripG];
        const algorithm = new TransferPreCalculation3(footpathRepo, transfers);
        const expected = Map()
            .set(TripFixtures.tripF, Map().set(3, []).set(2, []).set(1, transfers))
            .set(TripFixtures.tripG, Map().set(3, []).set(2, []).set(1, []));

        chai.expect(algorithm.getTransfers(trips)).to.deep.equal(expected);
    });

    it("remove transfers that only improve times before the change", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1})
        }));

        const transfers = [new Transfer(TripFixtures.tripC, 1, TripFixtures.tripB, 1)];
        const trips = [TripFixtures.tripC, TripFixtures.tripB];
        const algorithm = new TransferPreCalculation3(footpathRepo, transfers);
        const expected = Map()
            .set(TripFixtures.tripC, Map().set(2, []).set(1, []))
            .set(TripFixtures.tripB, Map().set(2, []).set(1, []));

        chai.expect(algorithm.getTransfers(trips)).to.deep.equal(expected);
    });

});
