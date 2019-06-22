import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class CheckConnectionProvider {

  constructor(
    public http: HttpClient
  ) {
    
  }

  checkConn() {
    return this.http.get('http://httpbin.org/get', httpOptions).toPromise();
  }


}
