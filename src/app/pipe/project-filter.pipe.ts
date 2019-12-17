import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectFilter'
})
export class ProjectFilterPipe implements PipeTransform {

  transform(value: any, searchText?: any): any {

    if (!value || value.length === 0 || !searchText) {
      return value;
    }
    searchText = searchText.toLowerCase();
    return value.filter((item) => {
      return (item['project'].toLowerCase().includes(searchText));
    });
  }

}
