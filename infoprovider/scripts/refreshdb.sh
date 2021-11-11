#!/bin/bash

for d in `ls -1d /storage/dsdata/setup-1/run0*`; do /opt/dsproto-runviewer/infoprovider/rvprovider.py --run ${d: -5} --setup 1; done
