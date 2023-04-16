#!/bin/bash

echo "Setting env variables ..."
. ./set-vars.sh ${1}

echo "Logging into ${AZURE_CR_NAME} ACR instance ..."
az acr login --name ${AZURE_CR_NAME}

echo "Building Docker image ..."
cd ..
docker build --no-cache -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} .

echo "Pushing Docker image to ACR ..."
docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}

echo "Deploying new ACApps version ..."
az containerapp update -n ${CAPP_NAME} -g ${RG} --image ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
