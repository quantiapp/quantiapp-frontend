import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountShareComponent } from './account-share.component';

describe('AccountShareComponent', () => {
  let component: AccountShareComponent;
  let fixture: ComponentFixture<AccountShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
