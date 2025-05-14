import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmacionStreamComponent } from './modal-confirmacion-stream.component';

describe('ModalConfirmacionStreamComponent', () => {
  let component: ModalConfirmacionStreamComponent;
  let fixture: ComponentFixture<ModalConfirmacionStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalConfirmacionStreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmacionStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
