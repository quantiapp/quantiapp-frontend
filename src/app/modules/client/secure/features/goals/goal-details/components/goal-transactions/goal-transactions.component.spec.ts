import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalTransactionsComponent } from './goal-transactions.component';

describe('GoalTransactionsComponent', () => {
  let component: GoalTransactionsComponent;
  let fixture: ComponentFixture<GoalTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
