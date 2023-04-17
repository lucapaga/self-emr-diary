import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordMgmtComponent } from './record-mgmt.component';

describe('RecordMgmtComponent', () => {
  let component: RecordMgmtComponent;
  let fixture: ComponentFixture<RecordMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordMgmtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
