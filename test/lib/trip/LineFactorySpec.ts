
import * as chai from "chai";

import Line from "../../../src/lib/trip/Line";
import LineFactory from "../../../src/lib/trip/LineFactory";
import {TripFixtures} from "./TripSpec";

describe("LineFactory", () => {

    it("generates a single line", () => {
        const factory = new LineFactory();
        const trips = [TripFixtures.tripA, TripFixtures.tripB];
        const expected = [
            new Line(trips)
        ];

        chai.expect(factory.getLines(trips)).to.deep.equal(expected);
    });

    it("generates a multiple lines for different stopping patterns", () => {
        const factory = new LineFactory();
        const trips = [TripFixtures.tripA, TripFixtures.tripB, TripFixtures.tripD];
        const expected = [
            new Line([TripFixtures.tripA, TripFixtures.tripB]),
            new Line([TripFixtures.tripD]),
        ];

        chai.expect(factory.getLines(trips)).to.deep.equal(expected);
    });

    it("splits overtaken trains", () => {
        const factory = new LineFactory();
        const trips = [TripFixtures.tripA, TripFixtures.tripB, TripFixtures.tripC, TripFixtures.tripD];
        const expected = [
            new Line([TripFixtures.tripA, TripFixtures.tripB]),
            new Line([TripFixtures.tripC]),
            new Line([TripFixtures.tripD]),
        ];

        chai.expect(factory.getLines(trips)).to.deep.equal(expected);
    });
});