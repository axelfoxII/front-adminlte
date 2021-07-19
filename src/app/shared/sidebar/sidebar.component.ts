import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  constructor(private sidebarService: SidebarService, private router:Router) {

    this.menuItems = sidebarService.menu;
    console.log(this.menuItems);

  }

  ngOnInit(): void {
    $('[data-widget="treeview"]').Treeview('init');
  }

  logout(){
    
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');


  }

}
