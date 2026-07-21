import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountGoalsComponent } from './account-goals.component';

describe('AccountGoalsComponent', () => {
  let component: AccountGoalsComponent;
  let fixture: ComponentFixture<AccountGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountGoalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
