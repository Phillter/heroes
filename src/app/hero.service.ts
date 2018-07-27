import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessagesService } from './messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class HeroService {
  private heroesUrl = 'api/heroes'; //URL to the web api

  constructor(
    private messagesService: MessagesService,
    private http: HttpClient ) { }

  private log(message: string) {
    this.messagesService.add(`HeroService: ${message}`);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      //TODO: send error to remote logging infrastructure
      console.error(error); //log error to console

      //TODO: make error message more clear for user
      this.log(`${operation} failed: ${error.message}`);

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
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
              .pipe(
                tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
                catchError(this.handleError<Hero>('addHero'))
              );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted hero id=${id}`)),
            catchError(this.handleError<Hero>('deleteHero'))
          );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()){ return of([]); }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
            .pipe(
              tap(_ => this.log(`found heroes matching "${term}"`)),
              catchError(this.handleError<Hero[]>('searchHeroes', []))
            ));
  }
}
