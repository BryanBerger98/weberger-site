import { Injectable } from '@angular/core';
import { AdminContact } from 'src/app/models/AdminContact.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AdminContactService {

  contact: AdminContact;
  contactSubject = new Subject<AdminContact>();

  constructor() { }

  emitContact() {
    this.contactSubject.next(this.contact);
  }

  saveContact(newContact) {
    this.contact = newContact;
    firebase.database().ref('/contact').update(this.contact);
  }

  getContact() {
    firebase.database().ref('/contact').on('value', (data) => {
      this.contact = data.val() ? data.val() : [];
      this.emitContact();
    });
  }

}
