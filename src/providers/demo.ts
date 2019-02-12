import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DemoProvider {

  constructor(
    public http: HttpClient
  ) {
    
  }

  checkDemo() {
    return this.http.get('https://ingeit.com.ar/api/mobileQuest').toPromise();
  }


}
