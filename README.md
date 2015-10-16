# Saaksi
[![Build Status](https://travis-ci.org/Tumetsu/saaksi.svg?branch=master)](https://travis-ci.org/Tumetsu/saaksi)
[![Coverage Status](http://tumetsu.github.io/saaksi/cov/coverage.svg)](http://tumetsu.github.io/saaksi/cov/report-html/)

Saaksi is a web service which should in future let users to download FMI's weatherdata online. It will be the next development from earlier [FMI Weather downloader](https://github.com/Tumetsu/FMI-weather-downloader) providing online UI. The plan is to use [FMI's Metolib library](https://github.com/fmidev/metolib) for pulling the data to client.

## Deployment
Saaksi utilizes Travis CI for deploying the latest master version to [its Github page](http://tumetsu.github.io/saaksi/). Despite of this the current version is still not usable for public so please refrain from linking it to anywhere for now.

## Build & development
Project was created with Yeoman angular generator and adding Foundation and ui-router libraries manually.

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
