import { Injectable } from '@angular/core';
import { AdminService } from 'src/app/models/AdminService.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AdminServicesService {

  services: AdminService[] = [];
  servicesSubject = new Subject<AdminService[]>();

  constructor() { }

  emitServices() {
    this.servicesSubject.next(this.services);
  }

  saveServices() {
    firebase.database().ref('/services').set(this.services);
  }

  saveNewServicesArray(services: AdminService[]) {
    firebase.database().ref('/services').set(services);
  }

  updateService(service: AdminService, id: number) {
    firebase.database().ref('/services/' + id).update(service);
  }

  getServices() {
    firebase.database().ref('/services').on('value', (data) => {
      this.services = data.val() ? data.val() : [];
      this.emitServices();
    });
  }

  getSingleService(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/services/' + id).once('value').then(
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

  createNewService(newService: AdminService) {
    this.services.push(newService);
    this.saveServices();
    this.emitServices();
  }

  removeService(service: AdminService) {
    if (service.photo) {
      const storageRef = firebase.storage().refFromURL(service.photo);
      storageRef.delete().then(
        () => {
          console.log('photo supprimée');
        }
      ).catch(
        (error) => {
          console.log('fichier non trouvé : ' + error);
        }
      );
    }
    const serviceIndexToRemove = this.services.findIndex(
      (serviceEl) => {
        if (serviceEl === service) {
          return true;
        }
      }
    );
    this.services.splice(serviceIndexToRemove, 1);
    this.saveServices();
    this.emitServices();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref().child('images/services/' + almostUniqueFileName + file.name).put(file);
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

  removeServicePhoto(photoLink: string) {
    if (photoLink) {
      const storageRef = firebase.storage().refFromURL(photoLink);
      storageRef.delete().then(
        () => {
          console.log('photo supprimée');
        }
      ).catch(
        (error) => {
          console.log('fichier non trouvé : ' + error);
        }
      );
    }
  }

}
