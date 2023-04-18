import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { BareRecording, DiaryRecord } from '../../e/diary';
import { ConfigurationsService } from '../../s/configurations.service';
import { DiaryService } from '../../s/diary.service';
import { DiaryRecordViewModel } from '../../vm/diary-vm';

@Component({
  selector: 'app-record-mgmt',
  templateUrl: './record-mgmt.component.html',
  styleUrls: ['./record-mgmt.component.css']
})
export class RecordMgmtComponent implements AfterViewInit {

  // public dwnMatterFormControl = new FormControl('');
  public dwnMatterOptions: string[] = ['Urine', 'Parametri Corporei'];
  public dwnMeasureOptions: string[] = ['Volume'];
  public dwnRecordingOptions: string[] = [];

  public recordingMatter: string = "Urine";
  public recordingMeasure: string = "Volume";
  public recordingValue?: string;

  public executingSaveRecording: boolean = false;

  public tblRecordingsColumns: string[] = ["datetime", "matter", "measure", "value"];
  public tblRecordingsDataSource = new MatTableDataSource<DiaryRecordViewModel>([]);
  public tblRecordingsList: DiaryRecordViewModel[] = [];
  // @ViewChild(MatPaginator) tblRecordingsPaginator: MatPaginator;


  constructor(
    private readonly configuService: ConfigurationsService,
    private readonly diaryService: DiaryService,
    private snackBarRef: MatSnackBar
  ) { }

  ngAfterViewInit() {
    // this.tblRecordingsDataSource.paginator = this.tblRecordingsPaginator;
  }

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
    if (!this.recordingValue) {
      return;
    }

    this.executingSaveRecording = true;
    try {
      this.diaryService.saveRecording(
        this._buildRecordingFrom(
          this.recordingMatter,
          this.recordingMeasure,
          this.recordingValue
        )
      ).subscribe((savedRecording) => {
        console.log(`Recording successfully saved! GUID >${savedRecording.guid}<`);
        this.recordingValue = "";
        this._updateRecordingTable(savedRecording);
        this.executingSaveRecording = false;
      });
    } catch (error) {
      console.error("Something went wrong while saving recording", error);
      this.snackBarRef.open(
        'Non sono riuscito ad effettuare la registrazione',
        undefined,
        {
          duration: 2000
        }
      );
      this.executingSaveRecording = false;
    }
  }
  
  public getTBLRecordingsTotalValue():number {
    return this.tblRecordingsList
    .map(r => {
      if(r && r.diaryRecord && r.diaryRecord.recording && r.diaryRecord.recording.value) {
        if(typeof r.diaryRecord.recording.value === "number") {
          return r.diaryRecord.recording.value as number;
        }
      }
      try {
        return parseFloat(r.diaryRecord?.recording?.value as string);
      } catch (error) {
        return 0;
      }
    }).reduce((acc, value) => acc + value, 0);
  }

  private _updateRecordingTable(savedRecording: DiaryRecord) {
    this.tblRecordingsList.push(this._buildDiaryRecordViewModelFrom(savedRecording));
    this.tblRecordingsDataSource.data = this.tblRecordingsList; 
  }

  private _buildDiaryRecordViewModelFrom(savedRecording: DiaryRecord):DiaryRecordViewModel {
    var recVM:DiaryRecordViewModel = new DiaryRecordViewModel();
    recVM.diaryRecord=savedRecording;
    recVM.matterIcon=this._lookupMatterIcon(savedRecording.matter);
    recVM.measureIcon=this._lookupMeasureIcon(savedRecording.measure);
    return recVM;
  }

  private _lookupMeasureIcon(measure: string | undefined): string | undefined {
    return "water";
  }
  
  private _lookupMatterIcon(matter: string | undefined): string | undefined {
    return "wc";
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

    var currentDate: Date = new Date();
    var retStr: string = "";

    retStr = retStr + currentDate.getFullYear();
    retStr = retStr + currentDate.getMonth();
    retStr = retStr + currentDate.getDay();

    return retStr;
  }
}
