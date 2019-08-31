import { Injectable } from '@angular/core';
import { Training } from 'src/app/models/Training.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {

  trainings: Training[] = [];
  trainingsSubject = new Subject<Training[]>();

  constructor() { }

  emitTrainings() {
    this.trainingsSubject.next(this.trainings);
  }

  saveTrainings() {
    firebase.database().ref('/trainings/trainings').set(this.trainings);
  }

  getTrainings() {
    firebase.database().ref('/trainings/trainings').on('value', (data) => {
      this.trainings = data.val() ? data.val() : [];
      this.emitTrainings();
    });
  }

  getSingleTraining(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/trainings/trainings/' + id).once('value').then(
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

  createNewTraining(newTraining: Training) {
    this.trainings.push(newTraining);
    this.saveTrainings();
    this.emitTrainings();
  }

  removeTraining(id) {
    this.trainings.splice(id, 1);
    this.saveTrainings();
    this.emitTrainings();
  }

  updateTraining(training: Training, id: number) {
    firebase.database().ref('/trainings/trainings/' + id).update(training);
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/trainings/' + almostUniqueFileName + file.name).put(file);
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
            upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      }
    );
  }

  deleteFile(url) {
    if (url) {
      const storageRef = firebase.storage().refFromURL(url);
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
