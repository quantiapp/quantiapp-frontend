import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordReplacer'
})
export class WordReplacerPipe implements PipeTransform {

  transform(value: string, replace: string, to: string): string {
    return value.replace(replace, to);
  }

}
