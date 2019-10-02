import { Injectable } from "@angular/core";
import { Registro } from "../models/registro.model";
import { Storage } from "@ionic/storage";
import { NavController } from "@ionic/angular";

import { File } from "@ionic-native/file/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Injectable({
  providedIn: "root"
})
export class DatalocalService {
  guardados: Registro[] = [];

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private inAppBrowser: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
  ) {
    // El get retorna una promesa el cual se ejecuta con el then donde vienen registros y se almacenan en un array vacio con modelo de registros y se evalua si vienen o no registros.
    // this.storage.get('registros').then( registros => {
    //   this.guardados = registros || [];
    //   console.log(registros);
    // });

    this.cargarStorage();
  }

  async cargarStorage() {
    this.guardados = (await this.storage.get("registros")) || [];
  }

  async guardarRegistro(format: string, text: string) {
    await this.cargarStorage();

    const nuevoRegistro = new Registro(format, text);

    // Se guardan los arreglos en el inicio del arreglo.
    this.guardados.unshift(nuevoRegistro);

    console.log(this.guardados);

    // Almacenamiento en el storage con la llave key llamada registros, almacenando el arreglo de guardados.
    this.storage.set("registros", this.guardados);

    this.abrirRegistro(nuevoRegistro);
  }

  abrirRegistro(registro: Registro) {
    this.navCtrl.navigateForward("/tabs/tab2");

    switch (registro.type) {
      case "http":
        // Abrir el navegador por defecto
        this.inAppBrowser.create(registro.text, "_system");
        break;

      case "geo":
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        // Abrir el navegador por defecto
        // this.inAppBrowser.create(registro.text, '_system');
        break;
    }
  }

  enviarCorreo() {
    const arrTemp = [];
    const titulos = "Tipo, Formato, Creador en, Texto\n";

    arrTemp.push(titulos);

    this.guardados.forEach(registro => {
      const linea = `${registro.type}, ${registro.format}, ${
        registro.created
      }, ${registro.text.replace(",", " ")}\n`;

      arrTemp.push(linea);
    });

    // console.log(arrTemp.join(''));

    this.crearArchivoFisico(arrTemp.join(""));
  }

  crearArchivoFisico(text: string) {
    this.file
      .checkFile(this.file.dataDirectory, "registros.csv")
      .then(existe => {
        console.log("Existe archivo?", existe);
        return this.escribirEnArchivo(text);
      })
      .catch(err => {
        return this.file
          .createFile(this.file.dataDirectory, "registros.csv", false)
          .then(creado => this.escribirEnArchivo(text))
          .catch(err2 => console.log("No se pudo crear el archivo", err2));
      });
  }

  async escribirEnArchivo(text: string) {
    await this.file.writeExistingFile(
      this.file.dataDirectory,
      "registros.csv",
      text
    );

    const archivo = `${this.file.dataDirectory}/registros.csv`

    console.log(this.file.dataDirectory + "registros.csv");

    let email = {
      to: "alexisnarvaez97@hotmail.com",
      // cc: "erika@mustermann.de",
      // bcc: ["john@doe.com", "jane@doe.com"],
      attachments: [
        archivo
        // "file://img/logo.png",
        // "res://icon.png",
        // "base64:icon.png//iVBORw0KGgoAAAANSUhEUg...",
        // "file://README.pdf"
      ],
      subject: "Backup de Scans",
      body: "Aqui tienen sus backups de cans - ScannerApp",
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
