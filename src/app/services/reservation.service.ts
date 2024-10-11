import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private url = 'http://localhost:3000/reservation';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:adminadmin;'),
    }),
  };

  constructor(private http: HttpClient) {}

  createReservation(
    name: string,
    email: string,
    phone: string,
    reserveDate: string,
    reserveTime: string,
    guests: number,
    specialRequests: string
  ): Observable<string> {
    return this.http
      .post(
        `${this.url}/addReservation`,
        {
          name: name,
          email: email,
          phone: phone,
          reserveDate: reserveDate,
          reserveTime: reserveTime,
          guests: guests,
          specialRequests: specialRequests,
        },
        { responseType: 'text', headers: this.httpOptions.headers }
      )
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  updateReservation(
    editId: string,
    name: string,
    email: string,
    phone: string,
    reserveDate: string,
    reserveTime: string,
    guests: number,
    specialRequests: string
  ) {
    return this.http
      .put(`${this.url}/updateReservation/${editId}`, {
        name: name,
        email: email,
        phone: phone,
        reserveDate: reserveDate,
        reserveTime: reserveTime,
        guests: guests,
        specialRequests: specialRequests,
      } , this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  getAllReservations(): Observable<any> {
    return this.http
      .get(`${this.url}/getAllReservation`, this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  getReservation(id: string): Observable<any> {
    return this.http
      .get(`${this.url}/getReservation/${id}`, this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  deleteReservation(id: string): Observable<any> {
    return this.http
      .delete(`${this.url}/deleteReservation/${id}`, this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  searchReservation(
    name: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.http
      .get(
        `${this.url}/getReservationByGuestNameStartDateEndDate/${name}/${name}/${name}/${startDate}/${endDate}`,
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }
}
