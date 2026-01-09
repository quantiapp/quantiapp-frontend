import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAccounts } from './shared-accounts';

describe('SharedAccounts', () => {
  let component: SharedAccounts;
  let fixture: ComponentFixture<SharedAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
