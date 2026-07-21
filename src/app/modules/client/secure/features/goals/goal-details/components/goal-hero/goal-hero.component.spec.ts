import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalHeroComponent } from './goal-hero.component';

describe('GoalHeroComponent', () => {
  let component: GoalHeroComponent;
  let fixture: ComponentFixture<GoalHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
