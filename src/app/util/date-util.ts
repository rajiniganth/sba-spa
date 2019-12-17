import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

export const DateValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const dateChecked = control.get('dateFlag');
    if (dateChecked.value) {
        const startDate = control.get('startDate').value;
        const endDate = control.get('endDate').value;
        if (startDate != null && endDate != null) {
            var stDt = new Date(startDate.year, startDate.month - 1, startDate.day);
            var endDt = new Date(endDate.year, endDate.month - 1, endDate.day);
            stDt.setDate(stDt.getDate() + 1);
            if (endDt < stDt) {
                return { 'dateMismatch': true };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

export const dateInISOString =  (value: any) => value != null ? value.year + '-' + value.month + '-' + value.date  : null;

export const toDate =  (value: any) => value != null ? new Date(value.year, value.month - 1, value.day + 1) : null;

export const toDateFrString =  (value: any) => value != null ? new Date(value) : null;

export const getDateInNgxFormat =  (value: any) => {
    if (value != null) {
        let str = value.split('-');
        return [{
            year: str[0],
            month: str[1],
            day: str[2]
        }];
    } else {
        return null;
    }
};


