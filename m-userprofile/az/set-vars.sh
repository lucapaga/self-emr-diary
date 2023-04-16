#!/bin/bash

export SUBSCRIPTION="HERA DCI-AzureML-Prod"
export RG=DCI_DAIA_DAIA_2020_PAGANELLI

AZURE_CR_NAME=daia2023paganelli
export AZURE_CR_NAME
export DOCKER_REGISTRY=${AZURE_CR_NAME}.azurecr.io

export CAPP_NAME=m-userprofile
export CAPP_ENV_NAME=capp-selfemrdiary-dev

export DOCKER_IMAGE_NAME=self-emf-diary/${CAPP_NAME}
export DOCKER_EXPOSED_SERVER_PORT=3001

if [ -n "$1" ]
then
    export DOCKER_IMAGE_VERSION=$1
else
    export DOCKER_IMAGE_VERSION=0.0.1
    echo "[WARN] No image defined as arg0, using default: ${DOCKER_IMAGE_VERSION}!"
fi
