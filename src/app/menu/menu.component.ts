import { Component } from '@angular/core';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuinList: [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.getAllMenu();
  }

  async getAllMenu() {
    this.menuService.getAllMenu().subscribe((data: any) => {
      this.menuinList = data.data;
      console.log(this.menuinList);
    });
  }
}
