import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private url = 'http://localhost:3000/menu';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:adminadmin;'),
    }),
  };

  constructor(private http: HttpClient) { }

  getAllMenu(): Observable<any> {
    return this.http
      .get(`${this.url}/getAllMenu`, this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  addMenu(name: string , price: number , description: string): Observable<any> {
    return this.http.post(`${this.url}/addMenu`, { name , price , description } , this.httpOptions);
  }

  deleteMenu(id: string): Observable<any> {
    return this.http
      .delete(`${this.url}/deleteMenu/${id}`, this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  updateMenu(id: string , name: string , price: number , description: string): Observable<any> {
    return this.http
      .put(`${this.url}/updateMenu/${id}`, { name , price , description } , this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  getMenu(id: string): Observable<any> {
    return this.http
      .get(`${this.url}/getMenu/${id}`, this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }
}
