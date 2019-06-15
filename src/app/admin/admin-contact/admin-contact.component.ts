import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminContact } from 'src/app/models/AdminContact.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminContactService } from 'src/app/services/admin/admin-contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-contact',
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.css']
})
export class AdminContactComponent implements OnInit, OnDestroy {

  contactSectionDisplay: boolean = false;
  contact: AdminContact;
  contactSubscription: Subscription;

  adminContactForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private adminContactService: AdminContactService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.contactSubscription = this.adminContactService.contactSubject.subscribe(
      (contact: AdminContact) => {
        this.contact = contact;
        if (this.contact === undefined) {
          console.log('Wait a moment');
        } else {
          this.adminContactForm.get('email').setValue(this.contact.email);
          this.adminContactForm.get('phone').setValue(this.contact.phone);
          this.adminContactForm.get('address').setValue(this.contact.address);
          this.adminContactForm.get('zip').setValue(this.contact.zip);
          this.adminContactForm.get('city').setValue(this.contact.city);
          this.adminContactForm.get('country').setValue(this.contact.country);
          this.adminContactForm.get('linkedInLink').setValue(this.contact.linkedInLink);
          this.adminContactForm.get('facebookLink').setValue(this.contact.facebookLink);
          this.adminContactForm.get('instagramLink').setValue(this.contact.instagramLink);
          this.adminContactForm.get('twitterLink').setValue(this.contact.twitterLink);
          this.adminContactForm.get('githubLink').setValue(this.contact.githubLink);
          this.adminContactForm.get('youtubeLink').setValue(this.contact.youtubeLink);
        }
      }
    );
    this.adminContactService.getContact();
    this.adminContactService.emitContact();
  }

  ngOnDestroy() {
    this.contactSubscription.unsubscribe();
  }

  initForm() {
    this.adminContactForm = this.formBuilder.group({
      email: '',
      phone: '',
      address: '',
      zip: '',
      city: '',
      country: '',
      linkedInLink: '',
      facebookLink: '',
      instagramLink: '',
      twitterLink: '',
      githubLink: '',
      youtubeLink: ''
    });
  }

  onSaveContact() {
    const email = this.adminContactForm.get('email').value ? this.adminContactForm.get('email').value : '';
    const phone = this.adminContactForm.get('phone').value ? this.adminContactForm.get('phone').value : '';
    const address = this.adminContactForm.get('address').value ? this.adminContactForm.get('address').value : '';
    const zip = this.adminContactForm.get('zip').value ? this.adminContactForm.get('zip').value : '';
    const city = this.adminContactForm.get('city').value ? this.adminContactForm.get('city').value : '';
    const country = this.adminContactForm.get('country').value ? this.adminContactForm.get('country').value : '';
    const linkedInLink = this.adminContactForm.get('linkedInLink').value ? this.adminContactForm.get('linkedInLink').value : '';
    const facebookLink = this.adminContactForm.get('facebookLink').value ? this.adminContactForm.get('facebookLink').value : '';
    const instagramLink = this.adminContactForm.get('instagramLink').value ? this.adminContactForm.get('instagramLink').value : '';
    const twitterLink = this.adminContactForm.get('twitterLink').value ? this.adminContactForm.get('twitterLink').value : '';
    const githubLink = this.adminContactForm.get('githubLink').value ? this.adminContactForm.get('githubLink').value : '';
    const youtubeLink = this.adminContactForm.get('youtubeLink').value ? this.adminContactForm.get('youtubeLink').value : '';
    const newContact = new AdminContact(email, phone, address, zip, city, country, linkedInLink, facebookLink, instagramLink, twitterLink, githubLink, youtubeLink);
    this.adminContactService.saveContact(newContact);
    this.router.navigate(['/admin', 'dashboard']);
  }

  onDeployContactSection() {
    if (this.contactSectionDisplay == false) {
      this.contactSectionDisplay = true;
    } else {
      this.contactSectionDisplay = false;
    }
  }

}
