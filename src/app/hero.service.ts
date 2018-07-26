import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor( private messagesService: MessagesService) { }

  getHeroes(): Observable<Hero[]> {
    // TODO: Send message after fetching heroes from remote server
    this.messagesService.add('HeroService: fetched Heroes list')
    return of(HEROES);
  }

  getHero(id: number): Observable<Hero> {
    //TODO: Send message after getting hero specified
    this.messagesService.add('HeroService: fetched hero id=${id}');
    return of(HEROES.find(hero => hero.id === id));
  }
}
