import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Searchbar } from 'ionic-angular';

@Component({
  selector: 'page-search-filter',
  templateUrl: 'search-filter.html',
})
export class SearchFilterPage {
  @ViewChild('mainSearchbar') searchBar;

   constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 500);
  }

}
