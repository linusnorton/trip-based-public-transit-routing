#!/usr/bin/env ts-node

import Container from '../Container';
import OptionMap from "../../lib/collection/Map";

global.Promise = require("bluebird");



const container = new Container();

const t = new OptionMap<string, number[]>();
console.log(t);
// command.run()
//     .catch(console.error)
//     .finally(() => container.get("db").end());