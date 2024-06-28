import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarvideoComponent } from './editarvideo.component';

describe('EditarvideoComponent', () => {
  let component: EditarvideoComponent;
  let fixture: ComponentFixture<EditarvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarvideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
