import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarVideoComponent } from './modal-eliminar-video.component';

describe('ModalEliminarVideoComponent', () => {
  let component: ModalEliminarVideoComponent;
  let fixture: ComponentFixture<ModalEliminarVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEliminarVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
