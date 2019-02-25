import { Component, ViewChild, trigger, style, animate, transition } from '@angular/core';
import { NavController, NavParams, Searchbar, Events } from 'ionic-angular';
import { group } from '@angular/core/src/animation/dsl';

@Component({
  selector: 'page-search-filter',
  templateUrl: 'search-filter.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(0)', opacity: 0 }),
          animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('200ms', style({ transform: 'translateX(0)', opacity: 0 }))
        ])
      ]
    )
  ]
})
export class SearchFilterPage {
  @ViewChild('mainSearchbar') searchBar;
  grupos: Array<{ nombre: string, id: number, autos: Array<{ dominio: string, patente: string }> }> = [];
  filterGrupos: Array<{ nombre: string, id: number, autos: Array<{ dominio: string, patente: string }> }> = [];
  searchValue: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events) {
    const data = this.navParams.get('data');
    for (let index = 0; index < data.vectorIdGrupo.length; index++) {
      let grupo = {
        nombre: data.vectorNombreGrupo[index],
        id: data.vectorIdGrupo[index],
        autos: []
      }
      this.grupos.push(grupo);
    }
    this.grupos.push({ nombre: 'Sin Grupo', id: null, autos: [] });
    data.idGrupo.forEach((id, index) => {
      let auto = {
        patente: data.patente[index],
        dominio: data.dominio[index]
      }
      if (id) {
        this.grupos.find(x => x.id == id).autos.push(auto);
      } else {
        this.grupos.find(x => x.id == null).autos.push(auto);
      }
    });
    // this.filterGrupos = this.grupos;
    this.filterGrupos = [...this.grupos.map(obj => ({ ...obj, autos: [...obj.autos] }))];
  }

  onInput(value: string): void {
    if (!value) value = '';
    this.searchValue = value;
    // this.filterGrupos = JSON.parse(JSON.stringify(this.grupos));
    this.filterGrupos = [...this.grupos.map(obj => ({ ...obj, autos: [...obj.autos] }))];
    this.filterGrupos = this.filterGrupos.filter(g => {
      g.autos = g.autos.filter(a => a.patente.toLowerCase().indexOf(value.toLowerCase()) > -1);
      return g.autos.length > 0;
    });
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 500);
  }

  filterByGroup(grupo) {
    this.filterGrupos = [...this.grupos.map(obj => ({ ...obj, autos: [...obj.autos] }))];
    this.filterGrupos = this.filterGrupos.filter(g => g.id == grupo.id);
    this.filterGrupos = this.filterGrupos.filter(g => {
      g.autos = g.autos.filter(a => a.patente.toLowerCase().indexOf(this.searchValue.toLowerCase()) === 0);
      return g.autos.length > 0;
    });
    this.event.publish('filtradoDeBusqueda', this.filterGrupos[0].autos.map( x => x.dominio));
    this.navCtrl.pop();
  }

  filterByOne(auto) {
    this.event.publish('filtradoDeBusqueda', [auto.dominio]);
    this.navCtrl.pop();
  }
}
