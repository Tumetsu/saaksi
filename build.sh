#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# clear and re-create the out directory
rm -rf dist || exit 0;
mkdir dist;

# run our compile script, discussed above
grunt
