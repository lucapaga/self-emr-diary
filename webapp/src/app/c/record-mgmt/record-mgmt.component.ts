import { Component } from '@angular/core';
// import { FormControl } from '@angular/forms';
import { BareRecording, DiaryRecord } from 'src/app/e/diary';
import { ConfigurationsService } from 'src/app/s/configurations.service';
import { DiaryService } from '../../s/diary.service';

@Component({
  selector: 'app-record-mgmt',
  templateUrl: './record-mgmt.component.html',
  styleUrls: ['./record-mgmt.component.css']
})
export class RecordMgmtComponent {

  // public dwnMatterFormControl = new FormControl('');
  public dwnMatterOptions: string[] = ['Urine', 'Parametri Corporei'];
  public dwnMeasureOptions: string[] = ['Volume'];
  public dwnRecordingOptions: string[] = [];

  public recordingMatter: string = "Urine";
  public recordingMeasure: string = "Volume";
  public recordingValue?: string;

  constructor(
    private readonly configuService: ConfigurationsService,
    private readonly diaryService: DiaryService
  ) { }

  public onMatterChange(): void {
    console.log("Mattter has changed: " + this.recordingMatter);

    switch (this.recordingMatter) {
      case "Urine":
        this.dwnMeasureOptions = ["Volume"];
        if (!this.recordingMeasure) {
          this.recordingMeasure = "Volume";
        }
        break;
      case "Parametri Corporei":
        this.dwnMeasureOptions = ["Temperatura"];
        if (!this.recordingMeasure) {
          this.recordingMeasure = "Temperatura";
        }
        break;
      default:
        break;
    }
  }

  public onMeasureChange(): void {
    console.log("Measure has changed: " + this.recordingMeasure);

    switch (this.recordingMatter) {
      case "Urine":
        switch (this.recordingMeasure) {
          case "Volume":
            this.dwnRecordingOptions = ["200", "250", "300", "350", "400", "450", "500"];
            break;
          default:
            break;
        }
        break;
      case "Parametri Corporei":
        switch (this.recordingMeasure) {
          case "Temperatura":
            this.dwnRecordingOptions = [];
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  public async saveRecording(): Promise<void> {
    console.log(`OK, going to save >${this.recordingValue}< recording value`);
    if(!this.recordingValue) {
      return;
    }
    
    this.diaryService.saveRecording(
      this._buildRecordingFrom(
        this.recordingMatter,
        this.recordingMeasure,
        this.recordingValue
      )
    ).subscribe((savedRecording) => {
      console.log(`Recording successfully saved! GUID >${savedRecording.guid}<`);
    });
  }

  private _buildRecordingFrom(
    recordingMatter: string,
    recordingMeasure: string,
    recordingValue: string | number,
    recordingCluster?: string
  ): DiaryRecord {
    var record: DiaryRecord = new DiaryRecord();

    record.recording = new BareRecording();
    record.recording.datetime = new Date();
    record.recording.value = recordingValue;

    record.cluster = this._calculateProperCluster(recordingCluster);

    record.matter = recordingMatter;
    record.measure = recordingMeasure;

    return record;
  }

  private _calculateProperCluster(
    recordingCluster: string | undefined
  ): string | undefined {
    if (recordingCluster) {
      return recordingCluster;
    }

    var currentDate:Date = new Date();
    var retStr:string  = "";
    
    retStr = retStr + currentDate.getFullYear();
    retStr = retStr + currentDate.getMonth();
    retStr = retStr + currentDate.getDay();

    return retStr;
  }
}
