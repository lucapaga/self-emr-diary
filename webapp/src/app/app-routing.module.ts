import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './c/landing-page/landing-page.component';
import { RecordMgmtComponent } from './c/record-mgmt/record-mgmt.component';

const routes: Routes = [
  { path: "welcome", component: LandingPageComponent },
  { path: "diary", component: RecordMgmtComponent },
  { path: "", redirectTo: "diary", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
