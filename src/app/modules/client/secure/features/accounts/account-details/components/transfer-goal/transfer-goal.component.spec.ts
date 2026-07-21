import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferGoalComponent } from './transfer-goal.component';

describe('TransferGoalComponent', () => {
  let component: TransferGoalComponent;
  let fixture: ComponentFixture<TransferGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferGoalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
