# Trip Based Public Transit Routing

Journey planning algorithm as described by [Sascha Witt's paper](https://arxiv.org/pdf/1504.07149v2.pdf).
 
## Test

```
npm install
npm test
```

## Setup

```
CREATE DATABASE ojp;

CREATE TABLE trip_transfers(
  trip_t int(11) unsigned not null,
  stop_i tinyint(5) unsigned not null,
  trip_u int(11) unsigned not null,
  stop_j tinyint(5) unsigned not null,
  primary key(trip_t, stop_i, trip_u, stop_j)
);
```

## Run

```
npm install -g ts-node uk-rail-import                                 # requires root
DATABASE_USERNAME=user DATABASE_NAME=ojp uk-rail-import --timetable   # takes 15-30 minutes
ts-node --max-old-space-size=8192 ./bin/generate-transfers.ts         # may take 45 minutes
ts-node ./bin/query.ts                                                # origin/destination hardcoded in script
```

## License

This software is licensed under [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).

Copyright 2016 Linus Norton.
