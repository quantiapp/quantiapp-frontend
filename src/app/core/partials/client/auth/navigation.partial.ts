import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Dropdownable } from "@shared/directives/dropdownable";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, Dropdownable, Darkable],
  template: `
    <div class="navigation-container px-4 py-4 flex flex-col bg-white rounded-tl-[1.25rem] rounded-tr-[1.25rem]"
    appDarkable="dark:bg-(color:--secondary)"
    >
    
      <div class="dropdown overflow-hidden" [appDropdownable]="this.dropdownIsExtended()">
        <div class="items flex flex-col gap-3">
          <div class="item flex justify-between items-center p-4 rounded-2xl bg-(color:--secondary)">
            <div class="content flex gap-4 items-center">
              <div class="icon w-10 h-10 border border-white rounded-[0.625rem] flex justify-center items-center">
                <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 14.1053V20.1056C3.75 21.5057 3.75 22.2054 4.02248 22.7402C4.26217 23.2106 4.64434 23.5934 5.11475 23.8331C5.649 24.1053 6.34874 24.1053 7.74614 24.1053H22.2539C23.6513 24.1053 24.35 24.1053 24.8842 23.8331C25.3547 23.5934 25.7381 23.2106 25.9778 22.7402C26.25 22.2059 26.25 21.5072 26.25 20.1098V14.1053M3.75 14.1053V11.6053M3.75 14.1053H26.25M3.75 11.6053V10.6056C3.75 9.20546 3.75 8.50487 4.02248 7.97009C4.26217 7.49969 4.64434 7.11751 5.11475 6.87783C5.64953 6.60535 6.35011 6.60535 7.75024 6.60535H22.2502C23.6504 6.60535 24.3495 6.60535 24.8842 6.87783C25.3547 7.11751 25.7381 7.49969 25.9778 7.97009C26.25 8.50435 26.25 9.20409 26.25 10.6015V11.6053M3.75 11.6053H26.25M8.75 19.1053H13.75M26.25 14.1053V11.6053" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="content">
                <p class="text-white text-sm">
                  Adicionar cartão
                </p>
              </div>
            </div>
            <div class="arrow w-10 h-10 flex justify-center items-center">
              <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.35535L5 5.35535L1 9.35535" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="item flex justify-between items-center p-4 rounded-2xl bg-(color:--secondary)">
            <div class="content flex gap-4 items-center">
              <div class="icon w-10 h-10 border border-white rounded-[0.625rem] flex justify-center items-center">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 21.3553V16.0424M4 16.0424C9.81818 11.4931 14.1818 20.5916 20 16.0422V4.66882C14.1818 9.21819 9.81818 0.119244 4 4.66861V16.0424Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="content">
                <p class="text-white text-sm">
                  Adicionar meta
                </p>
              </div>
            </div>
            <div class="arrow w-10 h-10 flex justify-center items-center">
              <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.35535L5 5.35535L1 9.35535" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="item flex justify-between items-center p-4 rounded-2xl bg-(color:--secondary)">
            <div class="content flex gap-4 items-center">
              <div class="icon w-10 h-10 border border-white rounded-[0.625rem] flex justify-center items-center">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 13.3553L19 16.3553M19 16.3553L16 19.3553M19 16.3553H5M8 11.3553L5 8.35535M5 8.35535L8 5.35535M5 8.35535H19" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="content">
                <p class="text-white text-sm">
                  Registrar transação
                </p>
              </div>
            </div>
            <div class="arrow w-10 h-10 flex justify-center items-center">
              <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.35535L5 5.35535L1 9.35535" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <nav class="flex justify-around gap-10 items-center">
        <button [routerLink]="['/secure/dashboard']" [routerLinkActive]="'active'">
          <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.5 23.7503V16.8153C25.5 16.1474 25.4994 15.8133 25.4182 15.5024C25.3462 15.227 25.2281 14.9663 25.0682 14.7308C24.8877 14.465 24.637 14.2446 24.1342 13.8048L18.1342 8.55479C17.201 7.73817 16.7344 7.33007 16.2092 7.17477C15.7465 7.03793 15.2532 7.03793 14.7905 7.17477C14.2657 7.32996 13.7997 7.73767 12.8679 8.55305L6.86596 13.8048C6.3633 14.2446 6.11255 14.465 5.93212 14.7308C5.77224 14.9663 5.65319 15.227 5.58121 15.5024C5.5 15.8133 5.5 16.1474 5.5 16.8153V23.7503C5.5 24.915 5.5 25.4973 5.6903 25.9568C5.94404 26.5693 6.4304 27.0565 7.04297 27.3103C7.5024 27.5006 8.08482 27.5006 9.24967 27.5006C10.4145 27.5006 10.9976 27.5006 11.457 27.3103C12.0696 27.0565 12.5558 26.5694 12.8096 25.9568C12.9999 25.4974 13 24.915 13 23.7501V22.5001C13 21.1194 14.1192 20.0001 15.5 20.0001C16.8807 20.0001 18 21.1194 18 22.5001V23.7501C18 24.915 18 25.4974 18.1902 25.9568C18.444 26.5694 18.9304 27.0565 19.543 27.3103C20.0024 27.5006 20.5849 27.5006 21.7496 27.5006C22.9145 27.5006 23.4976 27.5006 23.957 27.3103C24.5696 27.0565 25.0559 26.5693 25.3096 25.9568C25.4999 25.4973 25.5 24.915 25.5 23.7503Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
  
        <button [routerLink]="['/secure/accounts']" [routerLinkActive]="'active'">
          <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.25 13.75V19.7502C4.25 21.1504 4.25 21.8501 4.52248 22.3849C4.76217 22.8553 5.14434 23.2381 5.61475 23.4778C6.149 23.75 6.84874 23.75 8.24614 23.75H22.7539C24.1513 23.75 24.85 23.75 25.3842 23.4778C25.8547 23.2381 26.2381 22.8553 26.4778 22.3849C26.75 21.8506 26.75 21.1519 26.75 19.7545V13.75M4.25 13.75V11.25M4.25 13.75H26.75M4.25 11.25V10.2502C4.25 8.85011 4.25 8.14953 4.52248 7.61475C4.76217 7.14434 5.14434 6.76217 5.61475 6.52248C6.14953 6.25 6.85011 6.25 8.25024 6.25H22.7502C24.1504 6.25 24.8495 6.25 25.3842 6.52248C25.8547 6.76217 26.2381 7.14434 26.4778 7.61475C26.75 8.149 26.75 8.84874 26.75 10.2461V11.25M4.25 11.25H26.75M9.25 18.75H14.25M26.75 13.75V11.25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
  
        <button (click)="this.toggleDropdown()" class="w-[3.125rem] h-[3.125rem] bg-(color:--primary) rounded-full flex justify-center items-center">
          <svg [class]="(this.dropdownIsExtended()) ? 'rotate-45' : 'rotate-0'" class="duration-[.6s]" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 14H14M14 14H26.5M14 14V26.5M14 14V1.5" stroke="#202020" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

        </button>
  
        <button>
          <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.9374 11.1537L25.4797 10.899C25.4086 10.8595 25.3736 10.8396 25.3393 10.819C24.9979 10.6146 24.7102 10.332 24.5002 9.99404C24.4791 9.96003 24.4592 9.92436 24.4185 9.85387C24.3778 9.78347 24.3572 9.74779 24.3383 9.71248C24.15 9.36083 24.0481 8.96894 24.042 8.57008C24.0414 8.52998 24.0415 8.48901 24.0429 8.40756L24.0518 7.87598C24.0662 7.02532 24.0733 6.59867 23.9538 6.21577C23.8476 5.87567 23.67 5.56241 23.4327 5.29656C23.1646 4.99606 22.7934 4.78168 22.0503 4.35345L21.433 3.99776C20.692 3.57072 20.3213 3.35714 19.9279 3.27571C19.5798 3.20367 19.2207 3.20701 18.8739 3.28486C18.4824 3.37273 18.1164 3.59189 17.3848 4.02995L17.3807 4.03194L16.9384 4.29676C16.8685 4.33864 16.8331 4.35974 16.798 4.37923C16.4502 4.57263 16.0618 4.67957 15.6641 4.69234C15.624 4.69362 15.5832 4.69362 15.5016 4.69362C15.4206 4.69362 15.3781 4.69362 15.3381 4.69234C14.9394 4.67951 14.5503 4.57199 14.2019 4.37779C14.1668 4.35822 14.132 4.33695 14.062 4.29488L13.6169 4.02766C12.8803 3.58545 12.5114 3.36402 12.1178 3.27571C11.7696 3.19758 11.4092 3.19542 11.0599 3.26839C10.6654 3.35077 10.2947 3.56594 9.55323 3.99629L9.54993 3.99776L8.94035 4.35155L8.93361 4.35568C8.1988 4.78215 7.83051 4.9959 7.56462 5.29517C7.32867 5.56075 7.15231 5.87352 7.04675 6.21272C6.92743 6.59614 6.93379 7.0237 6.94817 7.87837L6.9571 8.4092C6.95845 8.48958 6.96079 8.52952 6.96021 8.56906C6.95429 8.96874 6.85107 9.36142 6.66218 9.7137C6.6435 9.74854 6.62337 9.78338 6.58318 9.85297C6.54295 9.92261 6.52347 9.95724 6.50261 9.99084C6.2917 10.3307 6.00267 10.6148 5.65916 10.8197C5.62519 10.8399 5.58938 10.8594 5.51902 10.8984L5.06706 11.1488C4.3151 11.5656 3.93921 11.7741 3.6657 12.0709C3.42373 12.3334 3.24094 12.6448 3.12936 12.984C3.00324 13.3673 3.00334 13.7972 3.00529 14.6569L3.00689 15.3596C3.00883 16.2136 3.01149 16.6402 3.1379 17.021C3.24973 17.3579 3.43119 17.6675 3.6718 17.9284C3.94377 18.2234 4.31592 18.4306 5.06218 18.8458L5.51011 19.095C5.58634 19.1374 5.6247 19.1583 5.66146 19.1804C6.00185 19.3854 6.28861 19.6688 6.49773 20.0067C6.52032 20.0432 6.542 20.0811 6.58537 20.1568C6.6282 20.2316 6.65011 20.2691 6.66992 20.3066C6.85326 20.6537 6.95142 21.0393 6.95812 21.4318C6.95884 21.4742 6.95822 21.5171 6.95677 21.6033L6.94817 22.1127C6.93369 22.9704 6.92738 23.3996 7.0474 23.7841C7.15358 24.1242 7.33105 24.4375 7.56828 24.7033C7.83644 25.0038 8.20819 25.2181 8.95134 25.6463L9.56847 26.0019C10.3095 26.429 10.6799 26.6423 11.0734 26.7237C11.4214 26.7958 11.7808 26.793 12.1276 26.7151C12.5196 26.6271 12.8869 26.4072 13.6205 25.9679L14.0628 25.7031C14.1328 25.6612 14.1682 25.6402 14.2033 25.6207C14.5511 25.4273 14.939 25.3198 15.3368 25.307C15.3769 25.3057 15.4177 25.3057 15.4993 25.3057C15.581 25.3057 15.6217 25.3057 15.6619 25.307C16.0606 25.3199 16.4509 25.4277 16.7992 25.6219C16.8299 25.639 16.8606 25.6574 16.9145 25.6898L17.3847 25.9721C18.1214 26.4144 18.4895 26.6352 18.8831 26.7235C19.2313 26.8016 19.592 26.8048 19.9413 26.7318C20.3357 26.6495 20.7071 26.4339 21.4482 26.0038L22.067 25.6446C22.8022 25.2179 23.1709 25.0039 23.4369 24.7045C23.6728 24.439 23.8494 24.1263 23.955 23.7871C24.0735 23.4065 24.0663 22.9822 24.0521 22.1399L24.0429 21.5905C24.0415 21.5101 24.0414 21.4702 24.042 21.4306C24.0479 21.0309 24.1494 20.638 24.3383 20.2857C24.357 20.2509 24.3772 20.2158 24.4173 20.1464C24.4575 20.0768 24.4783 20.0421 24.4992 20.0085C24.7101 19.6687 24.9994 19.3843 25.3429 19.1794C25.3765 19.1594 25.4111 19.1403 25.4797 19.1022L25.4821 19.1011L25.9341 18.8507C26.686 18.434 27.0626 18.2252 27.3361 17.9284C27.5781 17.6659 27.7607 17.3549 27.8722 17.0158C27.9976 16.6346 27.9967 16.2072 27.9947 15.3576L27.9931 14.6398C27.9911 13.7859 27.9901 13.3592 27.8637 12.9785C27.7519 12.6416 27.5694 12.332 27.3288 12.0711C27.0571 11.7764 26.6844 11.5691 25.9396 11.1547L25.9374 11.1537Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.5004 15C10.5004 17.7614 12.739 20 15.5004 20C18.2618 20 20.5004 17.7614 20.5004 15C20.5004 12.2385 18.2618 9.99995 15.5004 9.99995C12.739 9.99995 10.5004 12.2385 10.5004 15Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
  
        <button>
          <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.0208 24.1653C20.4186 22.376 18.0908 21.25 15.5 21.25C12.9092 21.25 10.5812 22.376 8.979 24.1653M15.5 26.25C9.2868 26.25 4.25 21.2132 4.25 15C4.25 8.7868 9.2868 3.75 15.5 3.75C21.7132 3.75 26.75 8.7868 26.75 15C26.75 21.2132 21.7132 26.25 15.5 26.25ZM15.5 17.5C13.4289 17.5 11.75 15.8211 11.75 13.75C11.75 11.6789 13.4289 10 15.5 10C17.5711 10 19.25 11.6789 19.25 13.75C19.25 15.8211 17.5711 17.5 15.5 17.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </nav>
    </div>
  `,
  styles: `
    button:not(:nth-child(3)) path{
      stroke: #B3B3B3;
    }
    button.active:not(:nth-child(3)) path{
      stroke: #F1C40F !important;
    }
  `
})
export class NavigationPartial implements OnInit {
  dropdownIsExtended = signal(false);
  ngOnInit(): void {

  }

  toggleDropdown(): void{
    if(this.dropdownIsExtended()){
      this.closeDropdown();
      return;
    }

    this.openDropdown();
  }

  openDropdown(): void{
    this.dropdownIsExtended.set(true);
  }

  closeDropdown(): void{
    this.dropdownIsExtended.set(false);
  }
}
