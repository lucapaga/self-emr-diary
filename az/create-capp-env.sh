#!/bin/bash

az containerapp env create \
    -g DCI_DAIA_DAIA_2020_PAGANELLI \
    -n capp-selfemrdiary-dev \
    -l westeurope
