
import * as chai from "chai";

import {Map} from "immutable";
import InMemoryFootpathRepository from "../../../../src/lib/transfer/repository/InMemoryFootpathRepository";
import TransferPreCalculation1 from "../../../../src/lib/transfer/TransferPreCalculation1";
import TransferPreCalculation3 from "../../../../src/lib/transfer/TransferPreCalculation3";
import {TripFixtures} from "../../trip/TripSpec";
import LineFactory from "../../../../src/lib/line/LineFactory";
import EarliestArrivalQuery from "../../../../src/lib/journey/query/EarliestArrivalQuery";
import Journey from "../../../../src/lib/journey/Journey";
import Leg from "../../../../src/lib/journey/Leg";
import {Stop, default as Trip} from "../../../../src/lib/trip/Trip";
import QueryResults from "../../../../src/lib/journey/query/QueryResults";

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
        const p3 = new TransferPreCalculation3(footpathRepo, p1.getTransfers(trips));
        const transfers = p3.getTransfers(trips);

        const query = new EarliestArrivalQuery(lines, transfers, footpathRepo);

        chai.expect(query.getJourney("A", "B", 900)).to.deep.equal(
            new QueryResults([new Journey([
                new Leg([new Stop("A", Infinity, 1000), new Stop("B", 1005, 1006)])
            ])])
        );

        chai.expect(query.getJourney("A", "C", 900)).to.deep.equal(
            new QueryResults([new Journey([
                new Leg([
                    new Stop("A", Infinity, 1000),
                    new Stop("B", 1005, 1006),
                    new Stop("C", 1010, Infinity),
                ])
            ])])
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
        const p3 = new TransferPreCalculation3(footpathRepo, p1.getTransfers(trips));
        const transfers = p3.getTransfers(trips);

        const query = new EarliestArrivalQuery(lines, transfers, footpathRepo);

        chai.expect(query.getJourney("A", "D", 900)).to.deep.equal(
            new QueryResults()
        );
    });

    it("uses transfers and footpaths to get to additional stops", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1, "X": 1}),
            "C": Map({"C": 1}),
            "X": Map({"X": 1}),
            "Y": Map({"Y": 1}),
            "Z": Map({"Z": 1}),
        }));

        const trips = [TripFixtures.tripA, TripFixtures.tripB, TripFixtures.tripD];
        const lineFactory = new LineFactory();
        const lines = lineFactory.getLines(trips);
        const p1 = new TransferPreCalculation1(lines, footpathRepo);
        const p3 = new TransferPreCalculation3(footpathRepo, p1.getTransfers(trips));
        const transfers = p3.getTransfers(trips);

        const query = new EarliestArrivalQuery(lines, transfers, footpathRepo);

        chai.expect(query.getJourney("A", "Y", 900)).to.deep.equal(
            new QueryResults([new Journey([
                new Leg([
                    new Stop("A", Infinity, 1000),
                    new Stop("B", 1005, 1006),
                ]),
                new Leg([
                    new Stop("X", Infinity, 1102),
                    new Stop("Y", 1106, 1107),
                ]),
            ])])
        );
    });

    it("uses transfers to get to additional stops", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1}),
        }));

        const tripA = new Trip([
            new Stop("A", Infinity, 1000),
            new Stop("B", 1010, Infinity)
        ]);

        const tripB = new Trip([
            new Stop("B", 1015, 1016),
            new Stop("C", 1020, Infinity)
        ]);

        const trips = [tripA, tripB];
        const lineFactory = new LineFactory();
        const lines = lineFactory.getLines(trips);
        const p1 = new TransferPreCalculation1(lines, footpathRepo);
        const p3 = new TransferPreCalculation3(footpathRepo, p1.getTransfers(trips));
        const transfers = p3.getTransfers(trips);

        const query = new EarliestArrivalQuery(lines, transfers, footpathRepo);

        chai.expect(query.getJourney("A", "C", 900)).to.deep.equal(
            new QueryResults([new Journey([
                new Leg([
                    new Stop("A", Infinity, 1000),
                    new Stop("B", 1010, Infinity)
                ]),
                new Leg([
                    new Stop("B", 1015, 1016),
                    new Stop("C", 1020, Infinity)
                ]),
            ])])
        );
    });

});