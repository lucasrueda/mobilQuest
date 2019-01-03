import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  endpoint: string;
  logoUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.endpoint = "http://www.mobilequest.com.ar/session.php"
    this.logoUrl = "assets/imgs/login_logo.png"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
