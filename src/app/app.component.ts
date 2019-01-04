import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, component: any, active: boolean, icon: string }>;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storage: Storage,
  ) {
    this.pages = [
      { title: 'Home', component: 'HomePage', active: true, icon: 'home' },
      { title: 'Mapa', component: 'HomePage', active: true, icon: 'map' }
    ];

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.storage.ready()
        .then(() => {
          this.storage.get('id_cliente').then((id_cliente) => {
            if (id_cliente) {
              this.rootPage = HomePage;
            } else {
              this.rootPage = LoginPage;
            }
          });
        })
    });
  }

  logout() {
    this.storage.clear()
      .then(() => {
        this.nav.setRoot(LoginPage);
      })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
