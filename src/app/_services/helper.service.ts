import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelperService {


  constructor(private http: HttpClient) { }

  getDocumentContent(){
    return this.http.get('assets/csv/Navigation.csv', {responseType:'text'})

  }
}
