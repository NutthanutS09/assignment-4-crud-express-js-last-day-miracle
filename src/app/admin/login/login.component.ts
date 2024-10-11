import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private userService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      
      this.userService.getUserDB(this.loginForm.value['username'], this.loginForm.value['password']).subscribe((data) => {

        if (localStorage.getItem('username') !== '' && localStorage.getItem('username') !== null) {
          
          Swal.fire({
            icon: 'success',
            title: 'ยินดีต้อนรับเข้าสู่ระบบ',
            showConfirmButton: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Navigate to the desired component
              window.location.reload()
            }
          });
        
        } else {
          Swal.fire({
            icon: 'error',
            title: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
            showConfirmButton: true
          });
        }
        
      });
      
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
