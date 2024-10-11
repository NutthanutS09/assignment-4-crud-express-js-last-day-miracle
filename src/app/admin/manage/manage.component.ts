import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class ManageComponent implements OnInit {
  reservatinList: [];
  menuinList: [];
  editFormGroup!: FormGroup;
  searchFormGroup!: FormGroup;
  editReservationId: string;
  editMenuId: string;
  checkSearchInput: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.getAllReservations();
    this.getAllMenu();
    this.editFormGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      guests: ['', [Validators.required, Validators.min(1)]],
      specialRequests: [''],
    });

    this.searchFormGroup = this.fb.group({
      searchName: [''],
      searchStartDate: [''],
      searchEndDate: [''],
    });
  }

  // the method for editing a reservation when user clicks on the edit button
  editReservation(editId: string) {
    this.reservationService.getReservation(editId).subscribe((data: any) => {
      console.log(data);
      this.editFormGroup.value['name'] = data.data.name;
      this.editReservationId = editId;
      this.editFormGroup.patchValue({
        name: data.data[0].name,
        email: data.data[0].email,
        phone: data.data[0].tel,
        date: data.data[0].reserve_date,
        time: data.data[0].reserve_time,
        guests: data.data[0].pax,
        specialRequests: data.data[0].remarks,
      });
    });
  }

  async getAllReservations() {
    this.reservationService.getAllReservations().subscribe((data: any) => {
      this.reservatinList = data.data;
      console.log(this.reservatinList);
    });
  }

  // the method for deleting a reservation when user clicks on the delete button
  async deleteReservation(id: string) {
    Swal.fire({
      title: 'ยืนยันหรือไม่?',
      text: 'ท่านยืนยันการลบข้อมูลนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.reservationService.deleteReservation(id).subscribe((data: any) => {
          Swal.fire(
            'ลบข้อมูลแล้ว!',
            'ท่านได้ทำการลบข้อมูลเรียบร้อยแล้ว',
            'success'
          );
          this.getAllReservations();
        });
      }
    });
  }

  onSubmitEdit() {
    if (!this.editFormGroup.invalid && this.editReservationId !== '') {
      Swal.fire({
        title: 'ยืนยันหรือไม่?',
        text: 'ท่านยืนยันการแก้ไขข้อมูลนี้หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.value) {
          this.reservationService
          .updateReservation(
            this.editReservationId,
            this.editFormGroup.value['name'],
            this.editFormGroup.value['email'],
            this.editFormGroup.value['phone'],
            this.editFormGroup.value['date'],
            this.editFormGroup.value['time'],
            this.editFormGroup.value['guests'],
            this.editFormGroup.value['specialRequests']
          )
          .subscribe((data: any) => {
            Swal.fire({
              title: 'แก้ไขข้อมูลแล้ว!',
              text: 'ท่านได้ทำการแก้ไขข้อมูลเรียบร้อยแล้ว',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
          }).then(() => {
            this.getAllReservations();
            window.location.reload();
            });
          });
        }
      });
    }
  }

  searchSubmit() {
    if (
      this.searchFormGroup.value['searchStartDate'] !== '' &&
      this.searchFormGroup.value['searchEndDate'] === ''
    ) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกวันที่สิ้นสุด',
      });
      this.editFormGroup.reset();
      return;
    }
    this.reservationService
      .searchReservation(
        this.searchFormGroup.value['searchName'],
        this.searchFormGroup.value['searchStartDate'],
        this.searchFormGroup.value['searchEndDate']
      )
      .subscribe((data: any) => {
        this.reservatinList = data.data;
        this.checkSearchInput = true;
      });
  }

  isReservation: boolean = true;
  isMenu: boolean = false;

  isReservationPage() {
    this.isReservation = true;
    this.isMenu = false;
  }

  isMenuPage() {
    this.isMenu = true;
    this.isReservation = false;
  }

  //menu
  MenuInfo = {
    name: '',
    price: '',
    description: '',
  }
  
  async getAllMenu() {
    this.menuService.getAllMenu().subscribe((data: any) => {
      this.menuinList = data.data;
      console.log(this.menuinList);
    });
  }

  setDescription(value: string) {
    this.MenuInfo.description = value;
  }
  
  addMenu() {
    const price: number = parseInt(this.MenuInfo.price);
    if (this.MenuInfo.description === '' || this.MenuInfo.description === null) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "โปรดเลือกคำอธิบาย",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.MenuInfo.description = '';
        }
      });
    }
    else {
      this.menuService.addMenu(this.MenuInfo.name, price, this.MenuInfo.description).subscribe(
        (response: any) => {
          // Success handling
          Swal.fire({
            position: "center",
            icon: "success",
            title: "เพิ่มเมนูสำเร็จ",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.reload();
          });
        },
        (error: any) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "เพิ่มเมนูไม่สำเร็จ",
            text: "เมนูนี้มีอยู่แล้ว",
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              this.MenuInfo.name = '';
              this.MenuInfo.price = '';
              this.MenuInfo.description = '';
            }
          });
        }
      );
    }
  }

  async deleteMenu(id: string) {
    Swal.fire({
      title: 'ยืนยันหรือไม่?',
      text: 'ท่านยืนยันการลบข้อมูลนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.menuService.deleteMenu(id).subscribe((data: any) => {
          Swal.fire(
            'ลบข้อมูลแล้ว!',
            'ท่านได้ทำการลบข้อมูลเรียบร้อยแล้ว',
            'success'
          ).then(() => {
            window.location.reload();
          });
        });
      }
    });
  }

  getMenuid(id: string) {
    this.menuService.getMenu(id).subscribe((data: any) => {
      this.MenuInfo.name = data.data[0].name;
      this.MenuInfo.price = data.data[0].price;
      this.MenuInfo.description = data.data[0].description;
    });
    this.editMenuId = id;
  }

  updateMenu(){
    const price: number = parseInt(this.MenuInfo.price);
    const id = this.editMenuId;
    Swal.fire({
      title: "ยืนยันหรือไม่?",
      text: "ยืนยันการเปลี่ยนแปลงข้อมูลนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuService.updateMenu(id ,this.MenuInfo.name, price, this.MenuInfo.description).subscribe(response => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "บันทึกการเปลี่ยนแปลงเรียบร้อย",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.reload();
          });
        })
      }
    });
  }
}
