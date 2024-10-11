import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReservationService } from '../services/reservation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent implements OnInit {
  reservationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      guests: ['', [Validators.required, Validators.min(1)]],
      specialRequests: [''],
    });
  }

  onSubmit() {

    if (this.reservationForm.valid) {
      Swal.fire({
        icon: 'question',
        html: true,
        title: 'ท่านแน่ใจหรือไม่ที่จะทำการจอง',
        text: 'กรุณาตรวจสอบข้อมูลก่อนทำการจอง<br/>ร้านของเราขอขอบพระคุณท่านที่ได้มาใช้บริการ',
        showConfirmButton: true,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.reservationService
            .createReservation(
              this.reservationForm.value['name'],
              this.reservationForm.value['email'],
              this.reservationForm.value['phone'],
              this.reservationForm.value['date'],
              this.reservationForm.value['time'],
              this.reservationForm.value['guests'],
              this.reservationForm.value['specialRequests']
            )
            .subscribe((data) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Reservation has saved",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.router.navigate(['/home']);
              });
            });
        } else {
          this.reservationForm.reset();
        }
      });
    } else {
      Object.keys(this.reservationForm.controls).forEach((key) => {
        const control = this.reservationForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
