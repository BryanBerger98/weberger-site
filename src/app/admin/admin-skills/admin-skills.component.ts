import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminSkillGroup } from 'src/app/models/AdminSkillGroup.model';
import { AdminSkillsService } from 'src/app/services/admin/admin-skills.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { AdminSkill } from 'src/app/models/AdminSkill.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrls: ['./admin-skills.component.css']
})
export class AdminSkillsComponent implements OnInit, OnDestroy {


  skillGroups: AdminSkillGroup[];
  skillGroupsSubscription: Subscription;

  skillGroupsIds: any[];

  // skills: Skill[];
  // skillsSubscription: Subscription;
  // addNewSkill: boolean = false;

  skillSectionDisplay = false;

  adminSkillGroupForm: FormGroup;
  adminSkillForm: FormGroup;
  adminDeleteSkillGroupForm: FormGroup;
  adminDeleteSkillForm: FormGroup;
  adminUpdateSkillGroupTitle: FormGroup;

  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;

  skilltoRemove: AdminSkill;

  constructor(
    private formBuilder: FormBuilder,
    private adminSkillsService: AdminSkillsService
  ) { }

  ngOnInit() {
    this.initSkillGroupForm();
    this.initSkillForm();
    this.initAdminDeleteSkillGroupForm();
    this.initAdminDeleteSkillForm();
    this.initAdminUpdateSkillGroupTitle();
    this.skillGroupsSubscription = this.adminSkillsService.skillGroupsSubject.subscribe(
      (skillGroups: AdminSkillGroup[]) => {
        this.skillGroups = skillGroups;
      }
    );
    this.adminSkillsService.getSkillGroups();
    this.adminSkillsService.emitSkillGroups();
    this.adminSkillsService.getSkillGroupsIds().then(
      (data: any[]) => {
        this.skillGroupsIds = data;
      }
    );
  }

  initSkillGroupForm() {
    this.adminSkillGroupForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  initSkillForm() {
    this.adminSkillForm = this.formBuilder.group({
      id: '',
      title: ['', Validators.required]
    })
  }

  initAdminDeleteSkillGroupForm() {
    this.adminDeleteSkillGroupForm = this.formBuilder.group({
      id: ''
    });
  }

  initAdminDeleteSkillForm() {
    this.adminDeleteSkillForm = this.formBuilder.group({
      id: ''
    });
  }

  initAdminUpdateSkillGroupTitle() {
    this.adminUpdateSkillGroupTitle = this.formBuilder.group({
      id: '',
      title : ''
    });
  }

  onSaveSkillGroup() {
    const title = this.adminSkillGroupForm.get('title').value;
    const skills = [];
    const uniqueId = Date.now().toString();
    const newSkillGroup = new AdminSkillGroup(uniqueId, title, skills);
    this.adminSkillsService.createNewSkillGroup(newSkillGroup);
    $('#addskillSectionModal').modal('hide');
    this.adminSkillGroupForm.reset();
  }

  onAddSkillToSkillGroup(id) {
    $('#addSkillModal').modal('show');
    this.adminSkillForm.get('id').setValue(id);
  }

  onSaveSkill() {
    const id = this.adminSkillForm.get('id').value;
    const title = this.adminSkillForm.get('title').value;
    const newSkill = new AdminSkill(title);
    if (this.fileUrl && this.fileUrl !== '') {
      newSkill.photo = this.fileUrl;
    }
    this.adminSkillsService.createNewSkill(id, newSkill);
    this.adminSkillForm.reset();
    $('#addSkillModal').modal('hide');
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.adminSkillsService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }

  onSkillDrop(event: CdkDragDrop<AdminSkill>, id) {
    const sourceIndex = this.skillGroups.findIndex(
      (skillEl) => {
        if (skillEl.id === event.previousContainer.id) {
          return true;
        }
      }
    );
    if (event.previousContainer === event.container) {
      moveItemInArray(this.skillGroups[id].skills, event.previousIndex, event.currentIndex);
      this.adminSkillsService.saveNewSkillGroup(id, this.skillGroups[id]);
    } else {
      if (this.skillGroups[id].skills) {
        transferArrayItem(this.skillGroups[sourceIndex].skills,
          this.skillGroups[id].skills,
          event.previousIndex,
          event.currentIndex);
      } else {
        this.skillGroups[id].skills = [];
        transferArrayItem(this.skillGroups[sourceIndex].skills,
          this.skillGroups[id].skills,
          event.previousIndex,
          event.currentIndex);
      }
    }
    this.adminSkillsService.updateSkillGroups(this.skillGroups);
  }

  openRemoveSkillGroupModal(i) {
    this.adminDeleteSkillGroupForm.get('id').setValue(i);
    $('#removeSkillGroupModal').modal('show');
  }

  onDeleteSkillGroup() {
    const id = this.adminDeleteSkillGroupForm.get('id').value;
    this.adminSkillsService.removeSkillGroupById(id);
    $('#removeSkillGroupModal').modal('hide');
    this.adminDeleteSkillGroupForm.reset();
  }

  openRemoveSkillModal(i, skill: AdminSkill) {
    $('#removeSkillModal').modal('show');
    this.skilltoRemove = skill;
    this.adminDeleteSkillForm.get('id').setValue(i);
  }

  onDeleteSkill() {
    const id = this.adminDeleteSkillForm.get('id').value;
    this.adminSkillsService.removeSkill(id, this.skilltoRemove);
    $('#removeSkillModal').modal('hide');
    this.adminDeleteSkillForm.reset();
  }

  onDropSkillGroup(event: CdkDragDrop<AdminSkillGroup[]>) {
    moveItemInArray(this.skillGroups, event.previousIndex, event.currentIndex);
    this.adminSkillsService.saveNewSkillGroupsArray(this.skillGroups);
  }

  onOpenUpdateSkillGroupTitleModal(i) {
    $('#updateSkillGroupTitleModal').modal('show');
    this.adminUpdateSkillGroupTitle.get('id').setValue(i);
  }

  onUpdateSkillGroupTitle() {
    const id = this.adminUpdateSkillGroupTitle.get('id').value;
    const title = this.adminUpdateSkillGroupTitle.get('title').value;
    this.adminSkillsService.updateSkillGroupTitle(id, title);
    $('#updateSkillGroupTitleModal').modal('hide');
    this.adminUpdateSkillGroupTitle.reset();
  }

  onDeploySkillSection() {
    if (this.skillSectionDisplay == false) {
      this.skillSectionDisplay = true;
    } else {
      this.skillSectionDisplay = false;
    }
  }

  ngOnDestroy() {
    this.skillGroupsSubscription.unsubscribe();
  }

}
