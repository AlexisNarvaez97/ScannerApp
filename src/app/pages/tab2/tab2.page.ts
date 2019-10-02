import { Component } from '@angular/core';
import { DatalocalService } from '../../services/datalocal.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {


  constructor(public dataLocal: DatalocalService) {

  }

  enviarCorreo() {
    // console.log('HOLA');
    this.dataLocal.enviarCorreo();
  }

  abrirRegistro(registro) {

    this.dataLocal.abrirRegistro(registro);
    console.log(registro);
    
  }

}
