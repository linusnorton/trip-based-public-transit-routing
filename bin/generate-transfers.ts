#!/usr/bin/env ts-node --max-old-heap=8184

import Container from "../src/app/Container";

const container = new Container();

container
    .generateTransfersCommand()
    .run()
    .then(_ => container.db().end())
    .catch(err => {
        console.error(err);
        container.db().end();
    });
