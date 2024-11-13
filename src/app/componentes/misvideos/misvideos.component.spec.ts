import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisvideosComponent } from './misvideos.component';

describe('MisvideosComponent', () => {
  let component: MisvideosComponent;
  let fixture: ComponentFixture<MisvideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisvideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisvideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
