import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

  constructor(private elementRef: ElementRef) { }

  /**
   * Key board action
   * @param event 
   */
  @HostListener('input', ['$event']) onInput(event: any) {
    const initalValue = this.elementRef.nativeElement.value;
    this.elementRef.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
  }


  /**
   * Copy Paste action 
   * @param event 
   */
  @HostListener('paste', ['$event']) onPaste(event: { originalEvent: any; preventDefault: () => void; }) {
      const clipboardData = (event.originalEvent || event).clipboardData.getData('text/plain');
      if (clipboardData) {
          const regEx = new RegExp('^[0-9]*$');
          if(!regEx.test(clipboardData)) {
              event.preventDefault();
          }
      }
      return;
  }

}
