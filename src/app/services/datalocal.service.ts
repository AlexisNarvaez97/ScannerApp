import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatalocalService {


  guardados: Registro[] = [];



  constructor(private storage: Storage, private navCtrl: NavController, private inAppBrowser: InAppBrowser ) {

    // El get retorna una promesa el cual se ejecuta con el then donde vienen registros y se almacenan en un array vacio con modelo de registros y se evalua si vienen o no registros.
    // this.storage.get('registros').then( registros => {
    //   this.guardados = registros || [];
    //   console.log(registros);
    // });

    this.cargarStorage();

  }

  async cargarStorage () {

    this.guardados = await this.storage.get('registros') || [];

  }



  async guardarRegistro(format: string, text: string) {

    await this.cargarStorage();

    const nuevoRegistro = new Registro(format, text);


    // Se guardan los arreglos en el inicio del arreglo.
    this.guardados.unshift(nuevoRegistro);

    console.log(this.guardados);

    // Almacenamiento en el storage con la llave key llamada registros, almacenando el arreglo de guardados.
    this.storage.set('registros', this.guardados);

    this.abrirRegistro(nuevoRegistro);

  }

  abrirRegistro(registro: Registro) {

    this.navCtrl.navigateForward('/tabs/tab2');

    switch ( registro.type ) {

      case 'http':
        // Abrir el navegador por defecto
        this.inAppBrowser.create(registro.text, '_system');
      break;

      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        // Abrir el navegador por defecto
        // this.inAppBrowser.create(registro.text, '_system');
      break;

    }

  }


}
