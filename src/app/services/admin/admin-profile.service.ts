import { Injectable } from '@angular/core';
import { AdminProfile } from 'src/app/models/AdminProfile.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AdminProfileService {

  profile: AdminProfile;
  profileSubject = new Subject<AdminProfile>();

  constructor() { }

  emitProfile() {
    this.profileSubject.next(this.profile);
  }

  saveProfile(newProfile) {
    this.profile = newProfile;
    firebase.database().ref('/admin').update(this.profile);
  }

  getProfile() {
    firebase.database().ref('/admin').on('value', (data) => {
      this.profile = data.val() ? data.val() : [];
      this.emitProfile();
    });
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/admin/' + almostUniqueFileName + file.name).put(file);
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

  removeAdminPhoto(photoLink: string) {
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
