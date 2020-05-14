import { throwError } from 'rxjs';

export function handleError(err) {

    let errorMessage = 'Some error occurred';
    console.log(err);
    if (err) {

        if (err instanceof ErrorEvent) {

            errorMessage = `Error occurred - ${err.message}`;
        } else {
            // Network errors

            errorMessage = `Backend returned status ${err.status} - Error Message : ${err.message}`;
        }
    }
    return throwError(errorMessage);
}
