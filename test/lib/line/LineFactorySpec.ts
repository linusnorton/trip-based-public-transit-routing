
import * as chai from "chai";

import Line from "../../../src/lib/line/Line";
import LineFactory from "../../../src/lib/line/LineFactory";
import {TripFixtures} from "../trip/TripSpec";
import InMemoryLineRepository from "../../../src/lib/line/repository/InMemoryLineRepository";
import {Map} from "immutable";

describe("LineFactory", () => {

    it("generates a single line", () => {
        const factory = new LineFactory();
        const trips = [TripFixtures.tripA, TripFixtures.tripB];
        const expected = new InMemoryLineRepository(Map({
            [TripFixtures.tripA.stoppingPattern()]: [new Line(trips)]
        }));

        chai.expect(factory.getLines(trips)).to.deep.equal(expected);
    });

    it("generates a multiple lines for different stopping patterns", () => {
        const factory = new LineFactory();
        const trips = [TripFixtures.tripA, TripFixtures.tripB, TripFixtures.tripD];
        const expected = new InMemoryLineRepository(Map({
            [TripFixtures.tripA.stoppingPattern()]: [new Line([TripFixtures.tripA, TripFixtures.tripB])],
            [TripFixtures.tripD.stoppingPattern()]: [new Line([TripFixtures.tripD])],
        }));

        chai.expect(factory.getLines(trips)).to.deep.equal(expected);
    });

    it("splits overtaken trains", () => {
        const factory = new LineFactory();
        const trips = [TripFixtures.tripA, TripFixtures.tripB, TripFixtures.tripC, TripFixtures.tripD];
        const expected = new InMemoryLineRepository(Map({
            [TripFixtures.tripA.stoppingPattern()]: [
                new Line([TripFixtures.tripA, TripFixtures.tripB]),
                new Line([TripFixtures.tripC]),
            ],
            [TripFixtures.tripD.stoppingPattern()]: [new Line([TripFixtures.tripD])],
        }));

        chai.expect(factory.getLines(trips)).to.deep.equal(expected);
    });
});