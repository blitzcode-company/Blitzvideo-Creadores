import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaprobarComponent } from './paraprobar.component';

describe('ParaprobarComponent', () => {
  let component: ParaprobarComponent;
  let fixture: ComponentFixture<ParaprobarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParaprobarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParaprobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
