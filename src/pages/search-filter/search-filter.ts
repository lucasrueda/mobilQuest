import { Component, ViewChild, trigger, style, animate, transition } from '@angular/core';
import { NavController, NavParams, Searchbar, Events } from 'ionic-angular';
import { HomePage } from '../home/home';

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
  gruposChips: Array<{ nombre: string, id: number, autos: Array<{ dominio: string, patente: string }> }> = [];
  filterGrupos: Array<{ nombre: string, id: number, autos: Array<{ dominio: string, patente: string }> }> = [];
  searchValue: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events) {
    const data = this.navParams.get('data');

    // Creando grupos para la lista
    for (let index = 0; index < data.vectorIdGrupo.length; index++) {
      if (data.vectorNombreGrupo[index]) {
        let grupo = {
          nombre: data.vectorNombreGrupo[index],
          id: data.vectorIdGrupo[index],
          autos: []
        }
        this.grupos.push(grupo);
      }
    }
    this.grupos.push({ nombre: 'Sin Grupo', id: null, autos: [] });
    data.idGrupo.forEach((id, index) => {
      let auto = {
        patente: data.patente[index],
        dominio: data.dominio[index]
      }
      if (id && this.grupos.find(x => x.id == id)) {
        this.grupos.find(x => x.id == id).autos.push(auto);
      } else {
        this.grupos.find(x => x.id == null).autos.push(auto);
      }
    });
    // this.filterGrupos = this.grupos;
    if (!this.grupos[this.grupos.length - 1].autos.length)
      this.grupos.pop();

    this.filterGrupos = [...this.grupos.map(obj => ({ ...obj, autos: [...obj.autos] }))];

    // Ahora creo los el array de grupo para los chips
    for (let index = 0; index < data.todos.vector_id_grupo.length; index++) {
      if (data.todos.vector_nombre_grupo[index]) {
        let grupo = {
          nombre: data.todos.vector_nombre_grupo[index],
          id: data.todos.vector_id_grupo[index],
          autos: []
        }
        this.gruposChips.push(grupo);
      }
    }
    this.gruposChips.push({ nombre: 'Sin Grupo', id: null, autos: [] });
    data.todos.id_grupo.forEach((id, index) => {
      let auto = {
        patente: data.todos.patente[index],
        dominio: data.todos.dominio[index]
      }
      if (id && this.gruposChips.find(x => x.id == id)) {
        this.gruposChips.find(x => x.id == id).autos.push(auto);
      } else {
        this.gruposChips.find(x => x.id == null).autos.push(auto);
      }
    });
    if (!this.gruposChips[this.gruposChips.length - 1].autos.length)
      this.gruposChips.pop();
  }

  onInput(value: string): void {
    if (!value) value = '';
    this.searchValue = value;
    // this.filterGrupos = JSON.parse(JSON.stringify(this.grupos));
    this.filterGrupos = [...this.grupos.map(obj => ({ ...obj, autos: [...obj.autos] }))];
    this.filterGrupos = this.filterGrupos.filter(g => {
      g.autos = g.autos.filter(a => a.dominio.toLowerCase().indexOf(value.toLowerCase()) > -1);
      return g.autos.length > 0;
    });
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 500);
  }

  filterByGroup(grupo) {
    this.filterGrupos = [...this.gruposChips.map(obj => ({ ...obj, autos: [...obj.autos] }))];
    this.filterGrupos = this.filterGrupos.filter(g => g.id == grupo.id);
    this.filterGrupos = this.filterGrupos.filter(g => {
      g.autos = g.autos.filter(a => a.patente.toLowerCase().indexOf(this.searchValue.toLowerCase()) === 0);
      return g.autos.length > 0;
    });
    this.event.publish('filtradoDeBusqueda', { vehiculos: this.filterGrupos[0].autos.map(x => x.dominio), nombre: grupo.nombre });
    this.navCtrl.pop();
  }

  filterByOne(auto) {
    this.event.publish('filtradoDeBusqueda', { vehiculos: [auto.dominio], nombre: auto.dominio });
    this.navCtrl.pop();
  }

  todaLaFlota() {
    this.event.publish('consultarTodo');
    this.navCtrl.pop();
  }
}
