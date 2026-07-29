import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerUi } from "@shared/ui/spinner/spinner.ui";
import { Darkable } from "@shared/directives/darkable";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { AccountShareFacade } from '../../../share.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-search-user',
  imports: [SpinnerUi, ReactiveFormsModule, Darkable, SubmitableButton],
  template: `
    <div class="panel-body flex gap-5 flex-col">
      <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Partilha de conta</h1>

      <form (submit)="submit()" [formGroup]="findUserByKeyFormGroup" class="panel-form flex gap-5 flex-col">
        <div class="form-control flex flex-col gap-2.5">
          <label for="#account_name" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Chave de utilizador</label>
          <input type="text"
          id="account_name"
          (change)="this.resetHasSearched()"
          class="bg-[#FAFAFA] text-sm border border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
          appDarkable="dark:bg-(--dm-bg) dark:text-(--dm-secondary) dark:border-white/10"
          formControlName="userKey" placeholder="" >
        </div>

        <div class="submit">
          <button
          type="submit"
          [disabled]="this.isSearchingUser() || this.findUserByKeyFormGroup.invalid"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1.5 font-medium">
            @if(isSearchingUser()){
              <app-spinner />
            } @else {
              Procurar
            }
          </button>
        </div>

      </form>

      @if(hasSearched() && this.notFoundUser()) {

        <div class="error-container py-12 flex flex-col gap-2.5 items-center justify-center">
          <div class="icon text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_316_1600)">
              <path d="M9 39H15V47C15 47.552 15.448 48 16 48C16.552 48 17 47.552 17 47V39H20C20.552 39 21 38.552 21 38C21 37.448 20.552 37 20 37H17V35C17 34.448 16.552 34 16 34C15.448 34 15 34.448 15 35V37H10V27C10 26.448 9.552 26 9 26C8.448 26 8 26.448 8 27V38C8 38.552 8.448 39 9 39Z" fill="currentColor" fill-opacity="0.6"/>
              <path d="M40 39H46V47C46 47.552 46.448 48 47 48C47.552 48 48 47.552 48 47V39H51C51.552 39 52 38.552 52 38C52 37.448 51.552 37 51 37H48V35C48 34.448 47.552 34 47 34C46.448 34 46 34.448 46 35V37H41V27C41 26.448 40.552 26 40 26C39.448 26 39 26.448 39 27V38C39 38.552 39.448 39 40 39Z" fill="currentColor" fill-opacity="0.6"/>
              <path d="M29.5 48C33.084 48 36 45.084 36 41.5V32.5C36 28.916 33.084 26 29.5 26C25.916 26 23 28.916 23 32.5V41.5C23 45.084 25.916 48 29.5 48ZM25 32.5C25 30.019 27.019 28 29.5 28C31.981 28 34 30.019 34 32.5V41.5C34 43.981 31.981 46 29.5 46C27.019 46 25 43.981 25 41.5V32.5Z" fill="currentColor" fill-opacity="0.6"/>
              <path d="M0 0V14V60H60V14V0H0ZM2 2H58V12H2V2ZM58 58H2V14H58V58Z" fill="currentColor" fill-opacity="0.6"/>
              <path d="M54.293 3.293L52 5.586L49.707 3.293L48.293 4.707L50.586 7L48.293 9.293L49.707 10.707L52 8.414L54.293 10.707L55.707 9.293L53.414 7L55.707 4.707L54.293 3.293Z" fill="currentColor" fill-opacity="0.6"/>
              <path d="M3 11H42V3H3V11ZM5 5H40V9H5V5Z" fill="currentColor" fill-opacity="0.6"/>
              </g>
              <defs>
              <clipPath id="clip0_316_1600">
              <rect width="60" height="60" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </div>
          <p class="description max-w-64 text-(--secondary)/60 text-sm text-center" appDarkable="dark:text-(--dm-secondary)/60">
            Não foi possível localizar um utilizador com esta chave
          </p>
        </div>

      } @else {
        <div class="description">
          <p class="text-base text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">
            Solicite a chave ao utilizador com quem pretende partilhar a conta.
          </p>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class SearchUserComponent implements OnInit {
  isSearchingUser = signal<boolean>(false);
  findUserByKeyFormGroup = new FormGroup<any>({});
  private facade = inject(AccountShareFacade);
  private destroyRef = inject(DestroyRef);
  notFoundUser = signal<boolean>(false);
  hasSearched = signal<boolean>(false);

  userFoundEmitter = output<User>();

  ngOnInit(): void {
    this.findUserByKeyFormGroup = new FormGroup({
      'userKey': new FormControl('', [ Validators.required ])
    })
  }

  resetHasSearched(): void {
    this.hasSearched.set(false);
  }

  submit(): void {
    if(this.findUserByKeyFormGroup.invalid) return;
    this.isSearchingUser.set(true);
    this.notFoundUser.set(false);

    const user_key: string = this.findUserByKeyFormGroup.get('userKey')?.value;

    this.facade.findUserByKey(user_key).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.isSearchingUser.set(false);
        this.hasSearched.set(true);
      })
    ).subscribe({
      next: response => {
        this.userFoundEmitter.emit(response);
      },
      error: (error) => {
        if (error?.status === HttpStatusCode.NotFound || error?.status === 404 || error?.error?.code === 404 || error?.code === 404) {
          this.notFoundUser.set(true);
        } else {
          this.notFoundUser.set(true);
        }
      }
    });
  }
}
