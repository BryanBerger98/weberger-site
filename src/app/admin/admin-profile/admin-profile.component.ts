import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminProfile } from 'src/app/models/AdminProfile.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminProfileService } from 'src/app/services/admin/admin-profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit, OnDestroy {

  profile: AdminProfile;
  profileSubscription: Subscription;

  adminProfileForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;

  profileSectionDisplay: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private adminProfileService: AdminProfileService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.profileSubscription = this.adminProfileService.profileSubject.subscribe(
      (profile: AdminProfile) => {
        this.profile = profile;
        if (this.profile === undefined) {
          console.log('Wait a moment');
        } else {
          this.adminProfileForm.get('firstname').setValue(profile.firstname);
          this.adminProfileForm.get('lastname').setValue(profile.lastname);
          this.adminProfileForm.get('job').setValue(profile.job);
          this.adminProfileForm.get('description').setValue(profile.description);
        }
      }
    );
    this.adminProfileService.getProfile();
    this.adminProfileService.emitProfile();
  }

  ngOnDestroy() {
    this.profileSubscription.unsubscribe();
  }

  initForm() {
    this.adminProfileForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      job: ['', Validators.required],
      description: ''
    });
  }

  onSaveProfile() {
    const firstname = this.adminProfileForm.get('firstname').value;
    const lastname = this.adminProfileForm.get('lastname').value;
    const job = this.adminProfileForm.get('job').value;
    const description = this.adminProfileForm.get('description').value ? this.adminProfileForm.get('description').value : '';
    const newProfile = new AdminProfile(firstname, lastname, job, description);
    if (this.fileUrl && this.fileUrl !== '') {
      newProfile.photo = this.fileUrl;
    }
    this.adminProfileService.saveProfile(newProfile);
    // this.router.navigate(['/admin', 'dashboard']);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    if (this.profile.photo) {
      this.adminProfileService.removeAdminPhoto(this.profile.photo);
    }
    this.adminProfileService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
        this.onSaveProfile();
      }
    );
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }

  onDeployProfileSection() {
    if (this.profileSectionDisplay == false) {
      this.profileSectionDisplay = true;
    } else {
      this.profileSectionDisplay = false;
    }
  }

}
