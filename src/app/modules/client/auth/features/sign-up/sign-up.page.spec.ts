import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpPage } from './sign-up.page';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SignUpPage', () => {
  let component: SignUpPage;
  let fixture: ComponentFixture<SignUpPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpPage],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
