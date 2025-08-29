import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInPage } from './sign-in.page';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SignInPage', () => {
  let component: SignInPage;
  let fixture: ComponentFixture<SignInPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInPage],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
