# Progetto "self-emr-diary"

## Introduzione

La soluzione mira a fornire ad un paziente uno strumento digitale per registrare i parametri
che è chiamato a monitorare autonomamente per poi presentarli ai medici.

## Struttura del repo

Il progetto è in stack [NGINX + Angular] + NEST per ogni microservice.

Il progetto è così strutturato
 - **az**: script per l'inizializzazione dell'Azure Container App Environment
 - **webapp**: front-end in NGINX/Angular
 - ...

Ogni directory ad eccezione di **az** ha elementi comuni:
 - **Dockerfile**: per la build dell'immagine docker shippabile
 - folder **az**: con gli script per la creazione, il deployment e l'aggiornamento su Azure Container App specifica

