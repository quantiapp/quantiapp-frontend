import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingPermissionsComponent } from './sharing-permissions.component';

describe('SharingPermissionsComponent', () => {
  let component: SharingPermissionsComponent;
  let fixture: ComponentFixture<SharingPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharingPermissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharingPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
