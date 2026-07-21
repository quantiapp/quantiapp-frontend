import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHeroComponent } from './account-hero.component';

describe('AccountHeroComponent', () => {
  let component: AccountHeroComponent;
  let fixture: ComponentFixture<AccountHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
