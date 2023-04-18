import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { BareRecording, DiaryRecord } from '../e/diary';


class DiaryBaseResponse {
  status?: 'OK' | 'WARN' | 'KO';
  statusDescription?: string;
}

class BareRecordingDTO {
  datetime?: Date;
  value?: string | number;
}

class DiaryRecordDTO {
  guid?: string;
  matter?: string;
  measure?: string;
  recording?: BareRecordingDTO;
  cluster?: string;
  status?: string;
}

class DiarySaveRecordingRequest {
  record?: DiaryRecordDTO;
}

class DiarySaveRecordingResponse extends DiaryBaseResponse {
  record?: DiaryRecordDTO;
}

class DiaryFetchRecordingResponse extends DiaryBaseResponse {
  records?: DiaryRecordDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  constructor(private http: HttpClient) { }

  public fetchRecordings(): Observable<DiaryRecord[]> {
    return this.http.get<Observable<HttpResponse<DiaryFetchRecordingResponse>>>(
      "/diary/recording",
      {
        observe: "response"
      }
    ).pipe(
      map((value) => {
        // var ret: DiaryRecord = new DiaryRecord();
        if (value !== undefined && value !== null && value.body !== undefined && value.body !== null) {
          var srvResp = value.body as DiaryFetchRecordingResponse;
          if (srvResp.status === "OK") {
            // ret.text = srvResp.chatResponse?.response;
            if (srvResp.records) {
              return srvResp.records.map((aRecording) => { return this._buildFromDTO(aRecording); })  
            } else {
              return [];
            }
          } else {
            throw new Error("Service failed getting diary recordings ...");
          }
        } else {
          throw new Error("Service failed getting diary recordings ...");
        }
        // return ret;
      }),
      catchError((err, caught) => {
        console.error("[DiaryService][fetchRecordings] Caught an error!", err);
        throw err;
      })
    );
  }

  public saveRecording(recording: DiaryRecord): Observable<DiaryRecord> {
    return this.http.post<Observable<HttpResponse<DiarySaveRecordingResponse>>>(
      "/diary/recording",
      this._buildDiarySaveRecordingRequestWith(this._buildDTOFrom(recording)),
      {
        observe: "response"
      }
    ).pipe(
      map((value) => {
        // var ret: DiaryRecord = new DiaryRecord();
        if (value !== undefined && value !== null && value.body !== undefined && value.body !== null) {
          var srvResp = value.body as DiarySaveRecordingResponse;
          if (srvResp.status === "OK") {
            // ret.text = srvResp.chatResponse?.response;
            if (srvResp.record) {
              return this._buildFromDTO(srvResp.record);
            } else {
              return recording;
            }
          } else {
            throw new Error("Service failed saving diary recording ...");
          }
        } else {
          throw new Error("Service failed saving diary recording ...");
        }
        // return ret;
      }),
      catchError((err, caught) => {
        console.error("[DiaryService][saveRecording] Caught an error!", err);
        throw err;
      })
    );
  }

  private _buildDiarySaveRecordingRequestWith(dr: DiaryRecordDTO): DiarySaveRecordingRequest {
    var ret: DiarySaveRecordingRequest = new DiarySaveRecordingRequest();
    ret.record = dr;
    return ret;
  }

  private _buildFromDTO(record: DiaryRecordDTO): DiaryRecord {
    var ret: DiaryRecord = new DiaryRecord();
    ret.cluster = record.cluster;
    ret.guid = record.guid;
    ret.matter = record.matter;
    ret.measure = record.measure;
    ret.status = record.status;
    if (record.recording) {
      ret.recording = new BareRecording();
      ret.recording.datetime = record.recording.datetime;
      ret.recording.value = record.recording.value;
    }
    return ret;
  }

  private _buildDTOFrom(recording: DiaryRecord): DiaryRecordDTO {
    var dto: DiaryRecordDTO = new DiaryRecordDTO();
    dto.cluster = recording.cluster;
    dto.matter = recording.matter;
    dto.measure = recording.measure;
    if (recording.recording) {
      dto.recording = new BareRecordingDTO();
      dto.recording.datetime = recording.recording?.datetime;
      dto.recording.value = recording.recording?.value;
    }
    dto.status = recording.status;
    return dto;
  }
}
