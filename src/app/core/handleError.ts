import { throwError } from 'rxjs';

export function handleError(err) {

    let errorMessage = 'Some error occurred';
    console.log(err);
    if(err){

        if(err.error instanceof ErrorEvent){

            errorMessage = `Error occurred - ${err.error.message}`;
        }
        else {
            // Network errors

            errorMessage = `Backend returned status ${err.error.status} - Error Message : ${err.error.message}`;
        } 
    }
    return throwError(errorMessage);
}