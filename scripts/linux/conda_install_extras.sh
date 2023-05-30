#!/bin/bash

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

if [[ -z "$CONDA_PREFIX" ]]; then
    echo "$0 must be run from a Conda environment" >&2
    exit 1
fi

conda install -y -c conda-forge libsecret=0.18.8
