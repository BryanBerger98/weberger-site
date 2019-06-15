import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin/admin-services.service';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/models/AdminService.model';
import * as $ from 'jquery';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.css']
})
export class AdminServicesComponent implements OnInit, OnDestroy {

  servicesSectionDisplay: boolean = false;

  adminServiceForm: FormGroup;

  services: AdminService[];
  servicesSubscription: Subscription;
  addNewService: boolean = true;

  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminServicesService: AdminServicesService
  ) { }

  ngOnInit() {
    this.initAdminServiceForm();
    this.servicesSubscription = this.adminServicesService.servicesSubject.subscribe(
      (services: AdminService[]) => {
        this.services = services;
      }
    );
    this.adminServicesService.getServices();
    this.adminServicesService.emitServices();
  }

  initAdminServiceForm() {
    this.adminServiceForm = this.formBuilder.group({
      id: '',
      title: '',
      description: ''
    });
  }

  onAddService() {
    this.adminServiceForm.reset();
  }

  onSaveService() {
    const id = this.adminServiceForm.get('id').value;
    const title = this.adminServiceForm.get('title').value;
    const description = this.adminServiceForm.get('description').value;
    const newService = new AdminService(title, description);
    if (this.fileUrl && this.fileUrl !== '') {
      newService.photo = this.fileUrl;
    }
    if (this.addNewService == true) {
      this.adminServicesService.createNewService(newService);
    } else {
      this.adminServicesService.updateService(newService, id);
    }
    this.adminServiceForm.reset();
    $('#addServiceModal').modal('hide');
    this.addNewService = true;
  }

  onEditService(id) {
    this.addNewService = false;
    this.adminServiceForm.reset();
    this.adminServicesService.getSingleService(id).then(
      (data: any) => {
        this.adminServiceForm.get('id').setValue(id);
        this.adminServiceForm.get('title').setValue(data.title);
        this.adminServiceForm.get('description').setValue(data.description);
      }
    );
    $('#addServiceModal').modal('show');
  }

  onDeleteService(service: AdminService) {
    this.adminServicesService.removeService(service);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.adminServicesService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

  detectFiles(event) {
    const id = this.adminServiceForm.get('id').value;
    if (id !== null) {
      this.adminServicesService.getSingleService(id).then(
        (data: any) => {
          if (data.photo) {
            this.adminServicesService.removeServicePhoto(data.photo);
          }
        }
      )
    }
    this.onUploadFile(event.target.files[0]);
  }

  onDeployServicesSection() {
    if (this.servicesSectionDisplay == false) {
      this.servicesSectionDisplay = true;
    } else {
      this.servicesSectionDisplay = false;
    }
  }

  onDropService(event: CdkDragDrop<AdminService[]>) {
    moveItemInArray(this.services, event.previousIndex, event.currentIndex);
    this.adminServicesService.saveNewServicesArray(this.services);
  }

  ngOnDestroy() {
    this.servicesSubscription.unsubscribe();
  }

}
