import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../model/user';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(value: any, searchText?: any): any {

    if (!value || value.length === 0 || !searchText) {
      return value;
    }
    searchText = searchText.toLowerCase();
    return value.filter((item) => {
      return (item['firstName'].toLowerCase().includes(searchText) || item['lastName'].toLowerCase().includes(searchText));
    });
  }

}
