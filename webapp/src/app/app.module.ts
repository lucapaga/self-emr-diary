import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';

// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

// import { MarkdownModule } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DisplayUserprofileDialog } from './app.component';
import { RecordMgmtComponent } from './c/record-mgmt/record-mgmt.component';
import { LandingPageComponent } from './c/landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent, DisplayUserprofileDialog, RecordMgmtComponent, LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule, MatIconModule, MatButtonModule, MatListModule, MatCardModule,
    MatGridListModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatTreeModule,
    MatExpansionModule, MatChipsModule,
    MatProgressBarModule, MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule,
    MatDialogModule, MatAutocompleteModule, MatTableModule, MatCheckboxModule,
    MatDatepickerModule
    // ,MarkdownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
