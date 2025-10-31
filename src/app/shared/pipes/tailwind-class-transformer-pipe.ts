import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tailwindClassTransformer'
})
export class TailwindClassTransformerPipe implements PipeTransform {

  transform(value: string, attribute: string): string {
    return `${ attribute }-[${ value }]`;
  }

}
