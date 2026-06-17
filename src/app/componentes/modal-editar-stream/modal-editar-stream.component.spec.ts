import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarStreamComponent } from './modal-editar-stream.component';

describe('ModalEditarStreamComponent', () => {
  let component: ModalEditarStreamComponent;
  let fixture: ComponentFixture<ModalEditarStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEditarStreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
