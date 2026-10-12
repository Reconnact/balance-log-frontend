# Balance Log — frontend

Balance Log is a weight tracker. Log your weight whenever you step on the scale,
see the history and the curve, set a goal weight and follow your progress.

This repo is the Vue frontend. The Spring Boot REST API is in balance-log-backend.

## Run

Needs Node 26 and the backend on http://localhost:8080 (`./gradlew bootRun` in balance-log-backend).

    npm install
    npm run dev

- open http://localhost:5173
- register, then log in
- the weights page shows sample entries as a curve and a list

## Test

    npm run test:unit

Webtechnologien project, HTW Berlin, WiSe 2026/27.
