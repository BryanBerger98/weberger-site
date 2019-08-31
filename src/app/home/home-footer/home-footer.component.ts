import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminContact } from 'src/app/models/AdminContact.model';
import { Subscription } from 'rxjs';
import { AdminContactService } from 'src/app/services/admin/admin-contact.service';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css']
})
export class HomeFooterComponent implements OnInit, OnDestroy {

  adminContact: AdminContact;
  adminContactSubscription: Subscription;

  constructor(
    private adminContactService: AdminContactService
  ) { }

  ngOnInit() {
    this.initAdminContact();
  }

  initAdminContact() {
    this.adminContactSubscription = this.adminContactService.contactSubject.subscribe(
      (contact: AdminContact) => {
        this.adminContact = contact;
      }
    );
    this.adminContactService.getContact();
    this.adminContactService.emitContact();
  }

  ngOnDestroy() {
    this.adminContactSubscription.unsubscribe();
  }

}
