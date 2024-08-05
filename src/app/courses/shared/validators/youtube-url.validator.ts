import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { exists } from "fs";
import { catchError, map, Observable, of } from "rxjs";

export function validateYouTubeUrl(prefix: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
    const url = control.value;
    if (!url.startsWith(prefix)) {
      return of({ invalidUrl: true }); // Invalid URL format
    }

    // Simulate an async check (replace with actual async operation)
    return checkYouTubeUrlExistence(url).pipe(
      map(exists => exists ? null : { videoNotExists: true }),
      catchError(() => of({ videoNotExists: true }))
    );
  };
}

function checkYouTubeUrlExistence(url: string): Observable<boolean> {
  // Simulate an async check for existence of the YouTube video
  return of(url === 'https://youtu.be/valid' /* Replace with actual async check */);
}
