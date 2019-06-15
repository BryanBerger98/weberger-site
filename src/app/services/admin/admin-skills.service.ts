import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { AdminSkillGroup } from 'src/app/models/AdminSkillGroup.model';
import { AdminSkill } from 'src/app/models/AdminSkill.model';

@Injectable({
  providedIn: 'root'
})
export class AdminSkillsService {

  skillGroups: AdminSkillGroup[] = [];
  skillGroupsSubject = new Subject<AdminSkillGroup[]>();

  constructor() { }

  emitSkillGroups() {
    this.skillGroupsSubject.next(this.skillGroups);
  }

  saveSkillGroups() {
    firebase.database().ref('/skillGroups').set(this.skillGroups);
  }

  saveNewSkillGroup(id, skillGroup) {
    firebase.database().ref('/skillGroups/' + id).set(skillGroup);
  }

  updateSkillGroups(skillGroups: AdminSkillGroup[]) {
    firebase.database().ref('/skillGroups').set(skillGroups);
  }

  getSkillGroupsIds() {
    return new Promise (
      (resolve, reject) => {
        firebase.database().ref('/skillGroups').once('value').then(
          (data) => {
            var skillGroupsIds = [];
            data.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
              skillGroupsIds.push(childData.id);
            });
            resolve(skillGroupsIds);
          },
          (error) => {
            reject(error);
          }
        )
      }
    )
  }

  getSkillGroups() {
    firebase.database().ref('/skillGroups').on('value', (data) => {
      this.skillGroups = data.val() ? data.val() : [];
      this.emitSkillGroups();
    });
  }

  getSingleSkill(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/skillGroups/' + id).once('value').then(
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

  createNewSkillGroup(newSkillGroup: AdminSkillGroup) {
    this.skillGroups.push(newSkillGroup);
    this.saveSkillGroups();
    this.emitSkillGroups();
  }

  updateSkillGroup(skillGroup: AdminSkillGroup, id: number) {
    firebase.database().ref('/skillGroups/' + id).update(skillGroup);
  }

  createNewSkill(id, newSkill: AdminSkill) {
    let skills;
    if (this.skillGroups[id].skills === undefined) {
      skills = [];
    } else {
      skills = this.skillGroups[id].skills;
    }
    skills.push(newSkill);
    const newSkillGroup = new AdminSkillGroup(this.skillGroups[id].id, this.skillGroups[id].title, skills);
    console.log(newSkillGroup);
    firebase.database().ref('/skillGroups/' + id).update(newSkillGroup);
  }

  removeSkillGroup(skillGroup: AdminSkillGroup) {
    const serviceIndexToRemove = this.skillGroups.findIndex(
      (skillEl) => {
        if (skillEl === skillGroup) {
          return true;
        }
      }
    );
    this.skillGroups.splice(serviceIndexToRemove, 1);
    this.saveSkillGroups();
    this.emitSkillGroups();
  }

  removeSkillGroupById(id) {
    firebase.database().ref('/skillGroups/' + id).once('value', function (snapshot) {
      var skills = snapshot.val().skills
      skills.forEach(function(childSnapshot) {
        if (childSnapshot.photo) {
          const storageRef = firebase.storage().refFromURL(childSnapshot.photo);
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
      });
    });
    this.skillGroups.splice(id, 1);
    this.saveSkillGroups();
    this.emitSkillGroups();
  }

  removeSkill(skillGroupId, skill) {
    const skillIndexToRemove = this.skillGroups[skillGroupId].skills.findIndex(
      (skillEl) => {
        if (skillEl === skill) {
          return true;
        }
      }
    );
    if (this.skillGroups[skillGroupId].skills[skillIndexToRemove].photo) {
      const storageRef = firebase.storage().refFromURL(this.skillGroups[skillGroupId].skills[skillIndexToRemove].photo);
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

    this.skillGroups[skillGroupId].skills.splice(skillIndexToRemove, 1);
    this.saveSkillGroups();
    this.emitSkillGroups();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/skills/' + almostUniqueFileName + file.name).put(file);
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
}
