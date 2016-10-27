
import * as chai from "chai";
import Line from "../../../src/lib/line/Line";
import {TripFixtures} from "../trip/TripSpec";
import {InMemoryLineRepository} from "../../../src/lib/line/repository/InMemoryLineRepository";
import InMemoryFootpathRepository from "../../../src/lib/transfer/repository/InMemoryFootpathRepository";
import TransferPreCalculation1 from "../../../src/lib/transfer/TransferPreCalculation1";
import Transfer from "../../../src/lib/transfer/Transfer";

describe("Transfer pre-calculation step 1", () => {

    it("calculates a basic set of transfers", () => {
        const lineRepo = new InMemoryLineRepository(new Map([
            [TripFixtures.tripA.stoppingPattern(), [
                new Line([TripFixtures.tripA, TripFixtures.tripB]),
                new Line([TripFixtures.tripC]),
            ]],
            [TripFixtures.tripD.stoppingPattern(), [new Line([TripFixtures.tripD])]],
        ]));

        const footpathRepo = new InMemoryFootpathRepository(new Map([
            ["A", new Map([["A", 1]])],
            ["B", new Map([["B", 1]])],
            ["C", new Map([["C", 1]])],
        ]));

        const trips = [
            TripFixtures.tripA,
            TripFixtures.tripB,
            TripFixtures.tripC,
        ];

        const algorithm = new TransferPreCalculation1(lineRepo, footpathRepo);

        const expected = [
            new Transfer(TripFixtures.tripA, 1, TripFixtures.tripC, 1),
            new Transfer(TripFixtures.tripC, 1, TripFixtures.tripB, 1),
        ];

        chai.expect(algorithm.getTransfers(trips)).to.deep.equal(expected);
    });

    it("calculates transfers made available via footpath", () => {
        const lineRepo = new InMemoryLineRepository(new Map([
            [TripFixtures.tripA.stoppingPattern(), [
                new Line([TripFixtures.tripA, TripFixtures.tripB]),
                new Line([TripFixtures.tripC]),
            ]],
            [TripFixtures.tripD.stoppingPattern(), [new Line([TripFixtures.tripD])]],
        ]));

        const footpathRepo = new InMemoryFootpathRepository(new Map([
            ["A", new Map([["A", 1]])],
            ["B", new Map([["B", 1]])],
            ["C", new Map([["C", 1]])],
            ["X", new Map([["X", 1]])],
            ["Y", new Map([["Y", 1]])],
            ["Z", new Map([["Z", 1]])],
            ["C", new Map([["X", 1]])],
            ["X", new Map([["C", 1]])],
        ]));

        const trips = [
            TripFixtures.tripA,
            TripFixtures.tripB,
            TripFixtures.tripC,
            TripFixtures.tripD,
        ];

        const algorithm = new TransferPreCalculation1(lineRepo, footpathRepo);

        const expected = [
            new Transfer(TripFixtures.tripA, 1, TripFixtures.tripC, 1),
            new Transfer(TripFixtures.tripA, 2, TripFixtures.tripD, 0),
            new Transfer(TripFixtures.tripB, 2, TripFixtures.tripD, 0),
            new Transfer(TripFixtures.tripC, 1, TripFixtures.tripB, 1),
            new Transfer(TripFixtures.tripC, 2, TripFixtures.tripD, 0),
        ];
        //console.dir(algorithm.getTransfers(trips), { depth: 5 });
        chai.expect(algorithm.getTransfers(trips)).to.deep.equal(expected);
    });

    it("uses footpaths to take shortcuts", () => {
        const lineRepo = new InMemoryLineRepository(new Map([
            [TripFixtures.tripE.stoppingPattern(), [
                new Line([TripFixtures.tripE, TripFixtures.tripF]),
            ]]
        ]));

        const footpathRepo = new InMemoryFootpathRepository(new Map([
            ["A", new Map([["A", 1]])],
            ["B", new Map([["B", 1]])],
            ["C", new Map([["C", 1]])],
            ["D", new Map([["D", 1]])],
            ["B", new Map([["C", 1]])],
        ]));

        const trips = [
            TripFixtures.tripE,
            TripFixtures.tripF
        ];

        const algorithm = new TransferPreCalculation1(lineRepo, footpathRepo);

        const expected = [
            new Transfer(TripFixtures.tripF, 1, TripFixtures.tripE, 2),
        ];
        //console.dir(algorithm.getTransfers(trips), { depth: 5 });
        chai.expect(algorithm.getTransfers(trips)).to.deep.equal(expected);
    });

    it("uses footpaths go back on itself", () => {
        const lineRepo = new InMemoryLineRepository(new Map([
            [TripFixtures.tripE.stoppingPattern(), [
                new Line([TripFixtures.tripE, TripFixtures.tripF]),
            ]]
        ]));

        const footpathRepo = new InMemoryFootpathRepository(new Map([
            ["A", new Map([["A", 1]])],
            ["B", new Map([["B", 1]])],
            ["C", new Map([["C", 1]])],
            ["D", new Map([["D", 1]])],
            ["C", new Map([["B", 1]])],
        ]));

        const trips = [
            TripFixtures.tripE,
            TripFixtures.tripF
        ];

        const algorithm = new TransferPreCalculation1(lineRepo, footpathRepo);

        const expected = [
            new Transfer(TripFixtures.tripE, 2, TripFixtures.tripF, 1),
        ];
        //console.dir(algorithm.getTransfers(trips), { depth: 5 });
        chai.expect(algorithm.getTransfers(trips)).to.deep.equal(expected);
    });
});
