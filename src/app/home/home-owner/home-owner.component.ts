import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminProfile } from 'src/app/models/AdminProfile.model';
import { Subscription } from 'rxjs';
import { AdminProfileService } from 'src/app/services/admin/admin-profile.service';
import { AdminContact } from 'src/app/models/AdminContact.model';
import { AdminContactService } from 'src/app/services/admin/admin-contact.service';

@Component({
  selector: 'app-home-owner',
  templateUrl: './home-owner.component.html',
  styleUrls: ['./home-owner.component.css']
})
export class HomeOwnerComponent implements OnInit, OnDestroy {

  adminProfile: AdminProfile;
  adminProfileSubscription: Subscription;

  adminContact: AdminContact;
  adminContactSubscription: Subscription;

  constructor(
    private adminProfileService: AdminProfileService,
    private adminContactService: AdminContactService
  ) { }

  ngOnInit() {
    this.initAdminProfile();
    this.initAdminContact();
  }

  initAdminProfile() {
    this.adminProfileSubscription = this.adminProfileService.profileSubject.subscribe(
      (profile: AdminProfile) => {
        this.adminProfile = profile;
      }
    );
    this.adminProfileService.getProfile();
    this.adminProfileService.emitProfile();
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
    this.adminProfileSubscription.unsubscribe();
    this.adminContactSubscription.unsubscribe();
  }

}
