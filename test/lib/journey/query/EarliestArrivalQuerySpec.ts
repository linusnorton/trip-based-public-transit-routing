
import * as chai from "chai";

import {Map} from "immutable";
import InMemoryFootpathRepository from "../../../../src/lib/transfer/repository/InMemoryFootpathRepository";
import TransferPreCalculation1 from "../../../../src/lib/transfer/TransferPreCalculation1";
import TransferPreCalculation2 from "../../../../src/lib/transfer/TransferPreCalculation2";
import TransferPreCalculation3 from "../../../../src/lib/transfer/TransferPreCalculation3";
import {TripFixtures} from "../../trip/TripSpec";
import LineFactory from "../../../../src/lib/line/LineFactory";
import EarliestArrivalQuery from "../../../../src/lib/journey/query/EarliestArrivalQuery";

describe("EarliestArrivalQuery", () => {

    it("finds the quickest route to a station with a single trip", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1})
        }));

        const trips = [TripFixtures.tripA, TripFixtures.tripB];
        const lineFactory = new LineFactory();
        const lines = lineFactory.getLines(trips);
        const p1 = new TransferPreCalculation1(lines, footpathRepo);
        const p2 = new TransferPreCalculation2(footpathRepo);
        const p3 = new TransferPreCalculation3(footpathRepo, p2.getTransfers(p1.getTransfers(trips)));
        const transfers = p3.getTransfers(trips);

        const query = new EarliestArrivalQuery(lines, transfers, footpathRepo);

        chai.expect(query.getJourney("A", "B", 900)).to.deep.equal(
            Map().set(0, 1005)
        );
        chai.expect(query.getJourney("A", "C", 900)).to.deep.equal(
            Map().set(0, 1010)
        );
    });

    it("returns an empty set when no journey is possible", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1}),
            "D": Map({"D": 1}),
        }));

        const trips = [TripFixtures.tripA, TripFixtures.tripB];
        const lineFactory = new LineFactory();
        const lines = lineFactory.getLines(trips);
        const p1 = new TransferPreCalculation1(lines, footpathRepo);
        const p2 = new TransferPreCalculation2(footpathRepo);
        const p3 = new TransferPreCalculation3(footpathRepo, p2.getTransfers(p1.getTransfers(trips)));
        const transfers = p3.getTransfers(trips);

        const query = new EarliestArrivalQuery(lines, transfers, footpathRepo);

        chai.expect(query.getJourney("A", "D", 900)).to.deep.equal(
            Map()
        );
    });

    it("returns an empty set when no journey is possible", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1, "X": 1}),
            "X": Map({"X": 1}),
            "Y": Map({"Y": 1}),
            "Z": Map({"Z": 1}),
        }));

        const trips = [TripFixtures.tripA, TripFixtures.tripB, TripFixtures.tripD];
        const lineFactory = new LineFactory();
        const lines = lineFactory.getLines(trips);
        const p1 = new TransferPreCalculation1(lines, footpathRepo);
        const p2 = new TransferPreCalculation2(footpathRepo);
        const p3 = new TransferPreCalculation3(footpathRepo, p2.getTransfers(p1.getTransfers(trips)));
        const transfers = p3.getTransfers(trips);

        const query = new EarliestArrivalQuery(lines, transfers, footpathRepo);

        chai.expect(query.getJourney("A", "Z", 900)).to.deep.equal(
            Map().set(1, 1111)
        );
    });

});