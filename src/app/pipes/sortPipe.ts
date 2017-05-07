import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({ name: 'sort', pure: false })
export class SortPipe implements PipeTransform {
    transform(items: any[], field: string, order: string): any[] {
        if (!order || order == "")
            return items.sort((a: any, b: any) => {
                if (a[field] < b[field])
                    return -1;
                else if (a[field] > b[field])
                    return 1;
                else return 0
            });
        else if (order == "desc")
            return items.sort((a: any, b: any) => {
                if (a[field] > b[field])
                    return -1;
                else if (a[field] < b[field])
                    return 1;
                else return 0
            });
    }
}