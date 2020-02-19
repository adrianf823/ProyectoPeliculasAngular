import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalAPComponent } from './form-modal-ap.component';

describe('FormModalAPComponent', () => {
  let component: FormModalAPComponent;
  let fixture: ComponentFixture<FormModalAPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormModalAPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModalAPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
