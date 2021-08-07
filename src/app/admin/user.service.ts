import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'api/users';
  constructor(private http: HttpClient) { }

  // getUsers() {
  //   return this.http.get(this.url)
  //     .pipe(
  //       tap(users => console.log('Getting users...', users)),
  //     );
  // }

  /** GET heroes from the server */
  getUsers(): Observable<any> {
    return this.http.get<any>(this.url)
      .pipe(
        tap(users => console.log('Getting users...', users)),
        catchError(this.handleError('getHeroes'))
      ) as Observable<any>;
  }

  /** GET User by id. Return `undefined` when id not found */
  getUser<Data>(id: number | string): Observable<any> {
    if (typeof id === 'string') {
      id = parseInt(id, 10);
    }
    const url = `${this.url}/?id=${id}`;
    return this.http.get<any[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<any>(`getUser id=${id}`))
      );
  }

  //////// Save methods //////////

  /** POST: add a new user to the server */
  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.url, user, httpOptions).pipe(
      tap((addedUser) => this.log(`added hero w/ id=${addedUser.id}`)),
      catchError(this.handleError<any>('addUser'))
    );
  }
  /** DELETE: delete the user from the server */
  deleteUser(user: any | number): Observable<any> {
    const id = typeof user === 'number' ? user : user.id;
    const url = `${this.url}/${id}`;

    return this.http.delete<any>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted user id=${id}`)),
      catchError(this.handleError<any>('deleteUser'))
    );
  }

  /** PUT: update the user on the server */
  updateUser(user: any): Observable<any> {
    return this.http.put(this.url, user, httpOptions).pipe(
      tap(_ => this.log(`updated user id=${user.id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }
  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param operation - name of the operation that failed
   */
  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
       `server returned code ${error.status} with body "${error.error}"`;

      // TODO: better job of transforming error for user consumption
      throw new Error(`${operation} failed: ${message}`);
    };

  }

  private log(message: string) {
    console.log('HeroService: ' + message);
  }
}
