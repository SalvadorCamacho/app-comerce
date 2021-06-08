import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonCheckbox, MenuController } from '@ionic/angular';
import { CategoryModel } from '../../model/CategoryModel';
import {NgbConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
})
export class FilterMenuComponent implements OnInit {
@Output('checkbox') checkbox: EventEmitter<any> = new EventEmitter<any>();
@Input('categories') categories: CategoryModel[] = [];

collapsed: boolean;

@ViewChild('checkbox', {static: false}) ionCheckbox: IonCheckbox;

constructor(private menuController: MenuController, private router : Router, private ngb: NgbConfig
           ) { }

  ngOnInit() {
    this.collapsed = false;
  }

    onClick(){
      this.collapsed = !this.collapsed;
    }


    checkboxSelected(ev: any){
      this.menuController.close('filter').then();
      this.checkbox.emit({
         name: ev.target.name,
         selected: ev.target.checked
      });
    }

    closeMenu(){
      this.menuController.close('filter').then();
    }


}
