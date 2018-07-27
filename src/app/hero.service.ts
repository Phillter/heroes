import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessagesService } from './messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HeroService {
  private heroesUrl = 'api/heroes'; //URL to the web api

  constructor(
    private messagesService: MessagesService,
    private http: HttpClient ) { }

  private log(message: string) {
    this.messagesService.add('HeroService: ${message}');
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      //TODO: send error to remote logging infrastructure
      console.error(error); //log error to console

      //TODO: make error message more clear for user
      this.log('${operation} failed: ${error.message}');

      //allow app to continue by returning empty result
      return of(result as T);
    }
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
              .pipe(
                tap(heroes => this.log('fetched heroes')),
                catchError(this.handleError('getHeroes', []))
              );
  }

  getHero(id: number): Observable<Hero> {
    const url = '${this.heroesUrl}/${id}';
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log('fetched hero id=${id}')),
        catchError(this.handleError<Hero>('getHero id=${id}'))
      );
  }
}
