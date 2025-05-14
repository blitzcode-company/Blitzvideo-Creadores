import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorearStreamComponent } from './monitorear-stream.component';

describe('MonitorearStreamComponent', () => {
  let component: MonitorearStreamComponent;
  let fixture: ComponentFixture<MonitorearStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitorearStreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorearStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
