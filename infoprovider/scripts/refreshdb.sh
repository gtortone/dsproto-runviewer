#!/bin/bash

export RUNDIR="/storage/dsdata/setup-1"
#export RUNDIR="/storage/dsdata/setup-2"

for d in `ls -1d $RUNDIR/run0*`; do /opt/dsproto-runviewer/infoprovider/rvprovider.py --rundir $RUNDIR --run ${d: -5}; done
