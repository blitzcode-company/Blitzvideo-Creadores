import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCanalComponent } from './editar-canal.component';

describe('EditarCanalComponent', () => {
  let component: EditarCanalComponent;
  let fixture: ComponentFixture<EditarCanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarCanalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
