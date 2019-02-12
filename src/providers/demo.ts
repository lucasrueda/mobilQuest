import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class DemoProvider {

  constructor(
    public http: HttpClient
  ) {
    
  }

  checkDemo() {
    return this.http.get('https://ingeit.com.ar/api/mobileQuest', httpOptions).toPromise();
  }


}
