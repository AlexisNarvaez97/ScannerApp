import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DatalocalService } from 'src/app/services/datalocal.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private barcodeScanner: BarcodeScanner, private datalocal: DatalocalService) {}

  // swiperOpts = {
  //   allowSlidePrev: false,
  //   allowSlideNext: false,
  // };

  ionViewWillEnter () {  // Se dispara cuando la pagina va a cargar pero aun no ha cargado.
    console.log('ionViewWillEnter');
    this.scan();
  }

  ionViewDidEnter () {   // Se dispara cuando la pagina o la vista es cargada. (Totalmente cargada)
    console.log('ionViewDidEnter');
  }

  ionViewWillLeave () {  // Se dispara como una alerta de que se va a ir de la vista.
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave () {  // Se dispara cuando dejas la pagina y entras a otra. 
    console.log('ionViewDidLeave');
  }

  scan() {

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      if ( !barcodeData.cancelled) {
        this.datalocal.guardarRegistro(barcodeData.format, barcodeData.text);
      }


     }).catch(err => {
         console.log('Error', err);

         this.datalocal.guardarRegistro('QRCODE','https://www.facebook.com');

     });

  }

}
