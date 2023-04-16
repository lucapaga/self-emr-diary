import { Controller, Get, Req, Headers, Logger, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { AppStatusResponse, ClientPrincipal, GetLLoggedUserDetailsResponse } from './dto/reqres';
import { AzAADClientPrincipal } from './dto/aad-client-princpl';

@Controller("userprofile")
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) { }

  @Get("/status")
  @HttpCode(200)
  getStatus(): AppStatusResponse {
    this.logger.log("Providing status ...");
    return {
      resource: "USERPROFILE",
      status: "OK"
    };
  }

  @Get("me")
  async getLLoggedUserDetails(
    @Headers("X-MS-CLIENT-PRINCIPAL-NAME") clPrincipalName: string,
    @Headers("X-MS-CLIENT-PRINCIPAL-ID") clPrincipalID: string,
    @Headers("x-ms-client-principal") base64ClientPrincipal: string,
    @Req() request: Request
  ): Promise<GetLLoggedUserDetailsResponse> {
    var resp: GetLLoggedUserDetailsResponse = new GetLLoggedUserDetailsResponse();
    try {
      // this.logger.debug(`H 'X-MS-CLIENT-PRINCIPAL-NAME' >${clPrincipalName}<`);
      // this.logger.debug(`H 'X-MS-CLIENT-PRINCIPAL-ID' >${clPrincipalID}<`);
      // this.logger.debug(`H 'X-MS-CLIENT-PRINCIPAL' >${base64ClientPrincipal}<`);
      // this._logAllHeaders(request);
      // this.logger.debug(this._unpackClientPrincipalData(base64ClientPrincipal));

      resp.status = 'OK';
      resp.clientPrincipal = this._buildClientPrincipal(clPrincipalID, clPrincipalName, this._unpackClientPrincipalData(base64ClientPrincipal)); //new ClientPrincipal();
    } catch (error) {
      this.logger.error("[getLLoggedUserDetails] ERROR", error);
      resp.status = "KO";
      resp.statusDescription = "" + error;
    }
    return resp;
  }

  private _buildClientPrincipal(clPrincipalID: string, clPrincipalName: string, azAadCP: AzAADClientPrincipal): ClientPrincipal {
    var r: ClientPrincipal = new ClientPrincipal();

    if (azAadCP && azAadCP.claims && azAadCP.claims.length > 0) {
      azAadCP.claims.forEach(aClaim => {
        switch (aClaim.typ) {
          case "aud":
            r.aud = aClaim.val;
            break;
          case "name":
            r.displayName = aClaim.val;
            break;
          case "http:\/\/schemas.microsoft.com\/identity\/claims\/objectidentifier":
            r.userGUID = aClaim.val;
            break;
          case "preferred_username":
            r.username = aClaim.val;
            break;
          case "roles":
            r.roles = this._tokenizeRoles(aClaim.val);
            break;
          case "http:\/\/schemas.microsoft.com\/identity\/claims\/tenantid":
            r.tenantGUID = aClaim.val;
            break;
          default:
            break;
        }
      });
    }

    r.id = clPrincipalID;
    r.name = clPrincipalName;
    return r;
  }

  private _tokenizeRoles(val: string): string[] {
    if (val && val !== "") {
      return val
        .split(",")
        .map((aToken) => { return aToken.trim(); })
        .filter((aToken) => { return (aToken && aToken !== ""); });
    } else {
      return [];
    }
  }

  private _unpackClientPrincipalData(base64ClientPrincipal: string): AzAADClientPrincipal | undefined {
    if (base64ClientPrincipal && base64ClientPrincipal !== "") {
      const decodedB64 = Buffer.from(base64ClientPrincipal, 'base64').toString('utf-8');
      return JSON.parse(decodedB64) as AzAADClientPrincipal;
    } else {
      base64ClientPrincipal = "eyJhdXRoX3R5cCI6ImFhZCIsImNsYWltcyI6W3sidHlwIjoiYXVkIiwidmFsIjoiOTJiNTEwYzgtYjdhZS00NTEwLWE5YTAtMWQ4YjJhYjgwZWM4In0seyJ0eXAiOiJpc3MiLCJ2YWwiOiJodHRwczpcL1wvbG9naW4ubWljcm9zb2Z0b25saW5lLmNvbVwvMDVmNzNhNzUtOTk5YS00YjZmLTgzYzEtOGE5NTExYzNmOTBkXC92Mi4wIn0seyJ0eXAiOiJpYXQiLCJ2YWwiOiIxNjgxNTY4NjI2In0seyJ0eXAiOiJuYmYiLCJ2YWwiOiIxNjgxNTY4NjI2In0seyJ0eXAiOiJleHAiLCJ2YWwiOiIxNjgxNTcyNTI2In0seyJ0eXAiOiJhaW8iLCJ2YWwiOiJBV1FBbVwvOFRBQUFBZEdRK0NTSHk1cURZcmpLR0RcL0hQc3NwaDVUdzR0ZFI0WnFxQWU2bERWYVpaaWlEMjRXK1hGMVB3Q2RmZTFmYmp4XC9kMkd0d3JubklNaXVvYkNkRDJzZjRcLzJXdkt5Z0VTXC9GbHNQK09ydXlcLzFaZGRiZ1FQNWd3ZlJwckM2SFdlUyJ9LHsidHlwIjoiY19oYXNoIiwidmFsIjoidUpLQ2c1WW9pcHZPLWFwUzVWWExSQSJ9LHsidHlwIjoiY2MiLCJ2YWwiOiJDbUNFWmtsRXVHN0xFb3BlNmluM0lqQkJPMzd2aEx6YVRlOTdhclwvZ0lKZzdkNnNoVGc3aXpsQ1JRalVsUU5GN0o2blZ6RjlXRWdGMTJQWmlRNHFKaTdcL2hqNFVkOEZyMzd3Zk1BcmRRaUtxTXk2d3p4R1lTNWdFeitobTl4SzByS01VU0RXZHlkWEJ3YjJobGNtRXVhWFFhRWdvUWg2MTNIK3NOZFVLOGtONEpTcndCSWlJU0NoQVYxM3FHNG5TdlQ1WWlFdFFGZmkwQUtBRXlBa1ZWT0FGQ0NRbUFxdTdlS2pEYlNBPT0ifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMueG1sc29hcC5vcmdcL3dzXC8yMDA1XC8wNVwvaWRlbnRpdHlcL2NsYWltc1wvZW1haWxhZGRyZXNzIiwidmFsIjoiTHVjYS5QYWdhbmVsbGlAZ3J1cHBvaGVyYS5pdCJ9LHsidHlwIjoibmFtZSIsInZhbCI6IlBhZ2FuZWxsaSBMdWNhIn0seyJ0eXAiOiJub25jZSIsInZhbCI6IjczMmEyMmQ1ZWRjZjQwOTliNzE4NzM2ZWMwY2QzNDQ4XzIwMjMwNDE1MTQzMzQzIn0seyJ0eXAiOiJodHRwOlwvXC9zY2hlbWFzLm1pY3Jvc29mdC5jb21cL2lkZW50aXR5XC9jbGFpbXNcL29iamVjdGlkZW50aWZpZXIiLCJ2YWwiOiI3OWZjYzU0Zi0yYzYxLTRhNzUtOTYxZS04MTkwNDlkZjZjN2YifSx7InR5cCI6InByZWZlcnJlZF91c2VybmFtZSIsInZhbCI6Imx1Y2EucGFnYW5lbGxpQGdydXBwb2hlcmEuaXQifSx7InR5cCI6InJoIiwidmFsIjoiMC5BVG9BZFRyM0JacVpiMHVEd1lxVkVjUDVEY2dRdFpLdXR4QkZxYUFkaXlxNERzZzZBUDQuIn0seyJ0eXAiOiJyb2xlcyIsInZhbCI6ImFkbWluIn0seyJ0eXAiOiJodHRwOlwvXC9zY2hlbWFzLnhtbHNvYXAub3JnXC93c1wvMjAwNVwvMDVcL2lkZW50aXR5XC9jbGFpbXNcL25hbWVpZGVudGlmaWVyIiwidmFsIjoiT3RTbXNmZWtRWFZ2TEZoQ2hWYXp3X1EzZFZQcnI0WldCRHhqQl9TMHZXOCJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC9pZGVudGl0eVwvY2xhaW1zXC90ZW5hbnRpZCIsInZhbCI6IjA1ZjczYTc1LTk5OWEtNGI2Zi04M2MxLThhOTUxMWMzZjkwZCJ9LHsidHlwIjoidXRpIiwidmFsIjoiRmRkNmh1SjByMC1XSWhMVUJYNHRBQSJ9LHsidHlwIjoidmVyIiwidmFsIjoiMi4wIn1dLCJuYW1lX3R5cCI6Imh0dHA6XC9cL3NjaGVtYXMueG1sc29hcC5vcmdcL3dzXC8yMDA1XC8wNVwvaWRlbnRpdHlcL2NsYWltc1wvZW1haWxhZGRyZXNzIiwicm9sZV90eXAiOiJodHRwOlwvXC9zY2hlbWFzLm1pY3Jvc29mdC5jb21cL3dzXC8yMDA4XC8wNlwvaWRlbnRpdHlcL2NsYWltc1wvcm9sZSJ9";
      const decodedB64 = Buffer.from(base64ClientPrincipal, 'base64').toString('utf-8');
      return JSON.parse(decodedB64) as AzAADClientPrincipal;
      // return undefined;
    }
  }

  private _logAllHeaders(request: Request) {
    this.logger.debug(request.headers);
  }
}
