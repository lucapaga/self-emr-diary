# DIARY micrroservice

Tutte le funzionalità di registrazione, consultazione, "consuntivazione".


# Techies

## npm depz (not bundled by Nest automatically)

Se copi-incolli il template ricorda di lanciare prima di tutto il comando `npm i`.

Le seguenti add-on sono utili:
 - **@nestjs/swagger**: produce automaticamente il F/E swagger ed il JSON openapi
 - **@nestjs/platform-express**: per servire contenuti statici

## Mandatory environment variables

Senza la valorizzazione delle seguenti variabili in ambiente di esecuzione il microservice non funzionerà:
 - **COSMOS_DB_CONNECTION_STRING**: la connection string, comprensiva di chiave segreta del cosmosDB del microservice
 - **SERVER_PORT**: in esecuzione locale (**non** Docker) si può personalizzare la porta su cui si mette in ascolto il processo server.


## Azure Container Apps Deployment

Tutti gli script sono all'interno della directory `az`.

Procedere:
 - personalizzando **set-vars.sh**, in particolare per quanto concerne il nome della AzContApp, lo AzContAppEnv in cui inserirla, il nome dell'immagine docker, la porta esposta
 - personalizzando **init-container-app.sh**, in particolare per quanto concerne gli argomenti aggiuntivi al numero di versione e relativi riferimenti all'interno dello script (tipicamente per secret/password et similia).



 