import { Component, VERSION } from '@angular/core';
import { fromEvent, merge, Observable, Subject, timer } from 'rxjs';
import { map, mapTo, scan, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  counter : number = 0;
  speed : number = 300;
  pauseCounter$ = new Subject<any>();
  rate : number = 1;
  start$: Observable<any>;
  reset$: Observable<any>;
  pause$: Observable<any>;
  startFlag: boolean = false;
  pauseFlag: boolean = true;
  iconType : string = 'email_outline';
  startBtnLabel : string = 'Start receving';
  pauseBtnLabel : string = 'Stop receving';


  ngOnInit(): void {
    this.start$ = fromEvent(document.querySelector("#start"), "click").pipe(
      switchMap(() => this.incrementCounter())
    );
    this.reset$ = fromEvent(document.querySelector("#reset"), "click").pipe(
      tap(() => {
        this.startFlag = false;
        this.pauseFlag = true;
        this.pauseCounter$.next(this.counter)}
      ),
      mapTo(0)
    );
    this.pause$ = fromEvent(document.querySelector("#pause"), "click").pipe(
      tap(() => {
        this.startFlag = false;
        this.pauseFlag = true;
        this.pauseCounter$.next(this.counter);
      }),
      map(x => this.counter)
    );
    merge(this.start$, this.reset$, this.pause$).subscribe(
      x => (this.counter = x)
    );
  }



  incrementCounter(){
    this.startFlag = true;
    this.pauseFlag = false;
    return timer(0,this.speed).pipe(
      scan((acc,curr) => acc + this.rate, this.counter),
      takeUntil(this.pauseCounter$)
    );
  }
}
