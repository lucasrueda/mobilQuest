import { Component } from '@angular/core';
import { ViewController, Events } from 'ionic-angular';

@Component({
    template: `
    <h1>hola</h1>
    `
})

export class Profile {
    constructor(public viewCtrl: ViewController, public event: Events) {
        this.event.subscribe('user:click', () => {
            console.log('dissmiseando')
            this.dismiss();
        })
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}