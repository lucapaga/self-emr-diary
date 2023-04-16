# Introduction

Gestione del profilo dell'utente autenticato.
Recupera le attribuzioni centrali (Azure AAD) attraverso gli header standard Azure AAD:
 - `X-MS-CLIENT-PRINCIPAL-NAME` 
 - `X-MS-CLIENT-PRINCIPAL-ID`


## References

Documentazione Azure:
 - [https://learn.microsoft.com/en-us/azure/container-apps/authentication#access-user-claims-in-application-code]
 - [https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-restrict-your-app-to-a-set-of-users]


# Semi-automation

Sono disponibili gli script di creazione ed aggiornamento su Azure Container Apps nella directory `cicd`.
