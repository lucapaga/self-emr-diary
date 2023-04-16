#!/bin/bash

# Argz
# -------------------------------------
#  1. image version tag
#  2. CosmosDB connection string

. ./set-vars.sh ${1}

# echo "Selecting working subscription: ${SUBSCRIPTION} ..." 
# az account set --subscription ${SUBSCRIPTION}

echo "Creating Container APP ${CAPP_NAME} (with default Microsoft image) ..."
az containerapp create -n ${CAPP_NAME} -g ${RG} --environment ${CAPP_ENV_NAME} --system-assigned --registry-server ${AZURE_CR_NAME}.azurecr.io --registry-identity system

echo "Logging into ${AZURE_CR_NAME} ACR instance ..."
az acr login --name ${AZURE_CR_NAME}

echo "Building Docker image ..."
cd ..
docker build --no-cache -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} .

echo "Pushing Docker image to ACR ..."
docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}

echo "Enabling CAPP ${CAPP_NAME} to pull from ACR ${AZURE_CR_NAME} ..."
SAI=$(az containerapp show -n ${CAPP_NAME} -g ${RG} --query "identity.principalId" | sed "s/\"//g")
az role assignment create --role AcrPull --scope /subscriptions/91adeefe-2ef9-4fea-a7cd-7a5fc8e3be8b/resourceGroups/${RG}/providers/Microsoft.ContainerRegistry/registries/${AZURE_CR_NAME} --assignee-object-id ${SAI}

echo "Updating CAPP ${CAPP_NAME} to proper image (${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}) and with all env-varz ..."
az containerapp update -n ${CAPP_NAME} -g ${RG} \
    --image ${AZURE_CR_NAME}.azurecr.io/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
    --set-env-vars \
        COSMOS_DB_CONNECTION_STRING=${2} 

echo "Enabling internal ingress ..."
az containerapp ingress enable -n ${CAPP_NAME} -g ${RG} --type internal --allow-insecure --target-port ${DOCKER_EXPOSED_SERVER_PORT}
