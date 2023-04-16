import { Component, Inject } from '@angular/core';
import { UserprofileService } from './s/userprofile.service';
import { UserProfile } from './e/userprofile';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  userProfile: UserProfile;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Self EHR Diary';
  userProfile?: UserProfile;

  constructor(
    private userProfileSRV: UserprofileService,
    private displayUserprofileDialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    try {
      this.userProfileSRV.getMyProfile()
        .subscribe((up: UserProfile | undefined) => {
          this.userProfile = up;
        });
    } catch (error) {
      console.error("Unable to decode user-profile?", error)
      this.userProfile = undefined;
    }
  }

  displayUserProfileDialog(): void {
    if (this.userProfile) {
      this.displayUserprofileDialog.open(DisplayUserprofileDialog, {
        data: { userProfile: this.userProfile },
      });
    }
  }

}


@Component({
  selector: 'dialog-userprofile',
  templateUrl: 'dialog-userprofile.html',
})
export class DisplayUserprofileDialog {
  constructor(
    public dialogRef: MatDialogRef<DisplayUserprofileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
