import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { UserPrincipal, UserProfile } from '../e/userprofile';


class ClientPrincipalDTO {
  userGUID?: string;
  tenantGUID?: string;
  id?: string;
  name?: string;
  aud?: string;
  displayName?: string;
  username?: string;
  roles?: string[];
}

class GetLLoggedUserDetailsResponse {
  status?: string;
  clientPrincipal?: ClientPrincipalDTO;
}

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {
  private mockMode: boolean = false;
  private userProfile?: UserProfile;

  constructor(private http: HttpClient) { }

  getMyProfile(): Observable<UserProfile | undefined> {
    if (this.userProfile) {
      console.log("UserProfile already decoded, returning it");
      return of(this.userProfile);
    }

    if (this.mockMode) {
      var r: UserProfile = new UserProfile();
      r.principal = new UserPrincipal();

      r.principal.id = "The ID";
      r.principal.name = "The Name";
      r.principal.aud = "The AUD";
      r.principal.displayName = "Cognome Nome";
      r.principal.roles = ["Il mio ruolo"];
      r.principal.tenantGUID = "tenantGUID";
      r.principal.userGUID = "userGUID";
      r.principal.username = "username";

      this.userProfile = r;
      return of(r);
    }

    return this.http.get<Observable<HttpResponse<GetLLoggedUserDetailsResponse>>>(
      "/userprofile/me",
      {
        observe: "response"
      }
    ).pipe(
      map((value) => {
        if (value && value.body) {
          var srvResp = value.body as GetLLoggedUserDetailsResponse;
          if (srvResp.status === 'OK') {
            var r: UserProfile = new UserProfile();
            r.principal = new UserPrincipal();

            r.principal.id = srvResp.clientPrincipal?.id;
            r.principal.name = srvResp.clientPrincipal?.name;
            r.principal.aud = srvResp.clientPrincipal?.aud;
            r.principal.displayName = srvResp.clientPrincipal?.displayName;
            r.principal.roles = srvResp.clientPrincipal?.roles;
            r.principal.tenantGUID = srvResp.clientPrincipal?.tenantGUID;
            r.principal.userGUID = srvResp.clientPrincipal?.userGUID;
            r.principal.username = srvResp.clientPrincipal?.username;

            this.userProfile = r;
            return r;
          } else {
            this.userProfile = undefined;
            return undefined;
          }
        } else {
          this.userProfile = undefined;
          return undefined;
        }
      }),
      catchError((err, caught) => {
        console.error("[UserprofileService][getMyProfile] Caught an error!", err);
        this.userProfile = undefined;
        throw err;
      })
    );
  }
}
