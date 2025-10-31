import { AfterViewInit, Directive, ElementRef, HostListener, input, OnChanges, output, signal, SimpleChanges, WritableSignal } from "@angular/core";

@Directive()
export abstract class Scroller<T = any> implements AfterViewInit, OnChanges{
    
    private initialX: number | null = null;
    private initialY: number | null = null;
    
    protected activeIndex = signal(0);
    itemsArray = input.required<T[]>();
    alignment = input<string>('center');
    active = output<number>();

    scrollerElementRef!: ElementRef<HTMLElement>;
    // limitedContainerElementRef!: ElementRef<HTMLElement>;
    
    protected paddingX = signal<number>(0);

    constructor() {}

    ngAfterViewInit(): void {
        this.bootstrap();
        this.valueToPadding();
    }

    ngOnChanges(changes: SimpleChanges): void {
        
    }

    protected bootstrap(){}
    
    @HostListener('window:resize', ['$event']) onResize(event: any){
        this.valueToPadding();
    }

    protected valueToPadding(){
        // this.paddingX.set(this.limitedContainerElementRef.nativeElement.offsetLeft);
    }
    
    next(){
        if(this.activeIndex() === this.itemsArray().length - 1) return;

        let ai = this.activeIndex() + 1;
        this.activeIndex.set(ai);
        this.scrollToActiveIndex(ai);
    }

    prev(){
        if(this.activeIndex() === 0) return;
        
        let ai = this.activeIndex() - 1;
        this.activeIndex.set(ai);
        this.scrollToActiveIndex(ai);
    }

    slideTo(index: number){
        this.activeIndex.set(index);
        this.scrollToActiveIndex(this.activeIndex());
    }
    
    scrollToActiveIndex(activeIndex: number){
        let CONTAINER_INDEX = 0;
        let scrollerElementRefChildrensAsHtmlElement = this.scrollerElementRef.nativeElement.childNodes[CONTAINER_INDEX] as HTMLElement;
        let getActiveItemByActiveIndexAsHtmlElement = scrollerElementRefChildrensAsHtmlElement.children[activeIndex] as HTMLElement;
        
        for (let index = 0; index < scrollerElementRefChildrensAsHtmlElement.children.length; index++) {
            (scrollerElementRefChildrensAsHtmlElement.children[index] as HTMLElement).style.scrollSnapAlign = this.alignment();
        }

        this.active.emit(activeIndex);

        this.scrollerElementRef.nativeElement.scrollTo(getActiveItemByActiveIndexAsHtmlElement.offsetLeft - this.paddingX(), 0)
    }

    @HostListener('touchstart', ['$event'])
    public captureInitialXOnTouchStart($event: any){
        this.initialX = $event.touches[0].clientX;
        this.initialY = $event.touches[0].clientY;
    }

    @HostListener('touchmove', ['$event'])
    public carouselTouchMoveEventHandler($event: any){

        if(this.initialX === null || this.initialY === null) return;
        var currentX = $event.touches[0].clientX;
        var currentY = $event.touches[0].clientY;

        var deltaX = currentX - this.initialX;
        var deltaY = currentY - this.initialY;

        if(Math.abs(deltaX) > Math.abs(deltaY)){
            // $event.preventDefault();
            if(deltaX < 0){
                this.next();
            }else{
                this.prev();
            }
        }

        this.initialX = null;
        this.initialY = null;

    }

    @HostListener('wheel', ['$event'])
    public carouselWheelEventHandler($event: any){        
        this.initialX = $event.clientX;
        this.initialY = $event.clientY;
        
        if(this.initialX === null || this.initialY === null) return;

        var deltaX = $event.deltaX;
        var deltaY = $event.deltaY;

        if(Math.abs(deltaX) > Math.abs(deltaY)){
            $event.preventDefault();
            if(deltaX > 0){
                // this.next();
            }else{
                // this.prev();
            }
        }

        this.initialX = null;
        this.initialY = null;

    }
}