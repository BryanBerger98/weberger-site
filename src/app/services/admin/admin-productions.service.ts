import { Injectable } from '@angular/core';
import { AdminProduction } from 'src/app/models/AdminProduction.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AdminProductionsService {

  productions: AdminProduction[] = [];
  productionsSubject = new Subject<AdminProduction[]>();

  constructor() { }

  emitProductions() {
    this.productionsSubject.next(this.productions);
  }

  saveProductions() {
    firebase.database().ref('/productions').set(this.productions);
  }

  saveNewProductionsArray(productions: AdminProduction[]) {
    firebase.database().ref('/productions').set(productions);
  }

  getProductions() {
    firebase.database().ref('/productions').on('value', (data) => {
      this.productions = data.val() ? data.val() : [];
      this.emitProductions();
    });
  }

  getSingleProduction(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/productions/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewProduction(newProduction: AdminProduction) {
    this.productions.push(newProduction);
    this.saveProductions();
    this.emitProductions();
  }

  updateProduct(production: AdminProduction, id: number) {
    firebase.database().ref('/productions/' + id).update(production);
  }

  removeProduction(production: AdminProduction) {
    if (production.photos.length > 0) {
      production.photos.forEach(function (child) {
        const storageRef = firebase.storage().refFromURL(child);
        storageRef.delete().then(
          () => {
            console.log('photo supprimée');
          }
        ).catch(
          (error) => {
            console.log('fichier non trouvé : ' + error);
          }
        );
      });
    }
    const serviceIndexToRemove = this.productions.findIndex(
      (productionEl) => {
        if (productionEl === production) {
          return true;
        }
      }
    );
    this.productions.splice(serviceIndexToRemove, 1);
    this.saveProductions();
    this.emitProductions();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/productions/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            //resolve(upload.snapshot.downloadURL);
            upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              resolve(downloadURL);
            });
          }
        );
      }
    );
  }

  removeProductionPhoto(photoLink: string) {
    if (photoLink) {
      const storageRef = firebase.storage().refFromURL(photoLink);
      storageRef.delete().then(
        () => {
          console.log('File deleted');
        }
      ).catch(
        (error) => {
          console.log('File not found : ' + error);
        }
      );
    }
  }

}
