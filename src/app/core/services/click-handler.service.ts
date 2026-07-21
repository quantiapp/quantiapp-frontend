import { Directive, ElementRef } from "@angular/core";

@Directive()
export class ClickHandler {

    constructor(private element: ElementRef<any>) {}

    onClickOutside = (event: Event, closestTargetRef: string, fn: () => void) => {
        const target = event.target as HTMLElement;

        const myElement = this.element.nativeElement as HTMLElement;

        const closestTarget = myElement.closest(closestTargetRef);

        if(!closestTarget) return;

        const clickedOnMe = myElement.contains(target);
        const clickedOnClosestTarget = closestTarget.contains(target);

        if(!clickedOnMe && clickedOnClosestTarget) {
            fn();
            // this.formGroup.reset();
        }
    }

}