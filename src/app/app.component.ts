import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HelperService } from './_services/helper.service';
import { MenuItem } from './_models/menu.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  subscription: Subscription;
  menuToShow: MenuItem[];
  data: any;

  constructor(private helperService: HelperService) {
    this.menuToShow = [];
  }

  ngOnInit() {
    this.subscription = this.helperService.getDocumentContent().subscribe(response => {
      this.data = response;
      this.menuToShow = this.getData(this.data);
      this.menuToShow = this.menuToShow.filter(item => {
        return item.parentId === 'NULL';
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getData(data) {
    let rows = data.split(['\n']);
    for (let i = 1; i < rows.length; i++) {
      let menuItem: MenuItem = { id: 0, linkUrl: '', name: '', parentId: 0, menuitems: [], isHidden: false };
      let columns = rows[i].split(';');
      menuItem.id = columns[0];
      menuItem.name = columns[1];
      menuItem.parentId = columns[2];
      menuItem.isHidden = columns[3];
      menuItem.linkUrl = columns[4];
      this.menuToShow.push(menuItem);
    }
    return this.arrangeSubMenu();
  }

  arrangeSubMenu() {
    this.menuToShow
      .filter(item => item.isHidden === 'False')
      .forEach(item => {
        let parent = item.parentId;
        if (this.menuToShow.find(item => item.id === parent)) {
          let menuItem: MenuItem = this.menuToShow.find(x => x.id === parent);
          menuItem.menuitems.push(item);
        }
      });
    this.menuToShow.forEach(item => {
      item.menuitems.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    });
    return this.menuToShow;
  }

}

