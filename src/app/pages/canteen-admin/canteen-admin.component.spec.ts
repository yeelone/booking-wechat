import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenAdminComponent } from './canteen-admin.component';

describe('CanteenAdminComponent', () => {
  let component: CanteenAdminComponent;
  let fixture: ComponentFixture<CanteenAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanteenAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
