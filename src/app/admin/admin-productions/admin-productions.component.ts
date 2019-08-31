import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminCategory } from 'src/app/models/AdminCategory.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCategoriesService } from 'src/app/services/admin/admin-categories.service';
import { AdminSkillsService } from 'src/app/services/admin/admin-skills.service';
import { AdminSkillGroup } from 'src/app/models/AdminSkillGroup.model';
import { AdminSkill } from 'src/app/models/AdminSkill.model';
import { AdminProductionsService } from 'src/app/services/admin/admin-productions.service';
import { AdminProduction } from 'src/app/models/AdminProduction.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-productions',
  templateUrl: './admin-productions.component.html',
  styleUrls: ['./admin-productions.component.css']
})
export class AdminProductionsComponent implements OnInit, OnDestroy {

  productionsSectionDisplay: boolean = false;

  categories: AdminCategory[];
  categorySubscription: Subscription;

  skillGroups: AdminSkillGroup[];
  skillGroupsSubscription: Subscription;

  productions: AdminProduction[];
  productionsSubscription: Subscription;

  allSkills: AdminSkill[] = [];

  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  technologiesAdded: any[] = [];
  photosAdded: any[]= [];

  adminProcutionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private adminCategoriesService: AdminCategoriesService,
    private adminSkillsService: AdminSkillsService,
    private adminProductionService: AdminProductionsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initProductions();
    this.initCategories();
    this.initSkills();
    this.initAdminProcutionForm();
  }

  initProductions() {
    this.productionsSubscription = this.adminProductionService.productionsSubject.subscribe(
      (productions: AdminProduction[]) => {
        this.productions = productions;
      }
    );
    this.adminProductionService.getProductions();
    this.adminProductionService.emitProductions();
  }

  initCategories() {
    this.categorySubscription = this.adminCategoriesService.categoriesSubject.subscribe(
      (categories: AdminCategory[]) => {
        this.categories = categories;
      }
    );
    this.adminCategoriesService.getCategories();
    this.adminCategoriesService.emitCategories();
  }

  initSkills() {
    this.skillGroupsSubscription = this.adminSkillsService.skillGroupsSubject.subscribe(
      (skillGroups: AdminSkillGroup[]) => {
        this.skillGroups = skillGroups;
        if (skillGroups !== undefined) {
          skillGroups.forEach(function(child) {
            let skills = child.skills;
            skills.forEach(function (childSkills) {
              this.allSkills.push(childSkills);
            }.bind(this));
          }.bind(this));
        }
      }
    );
    this.adminSkillsService.getSkillGroups();
    this.adminSkillsService.emitSkillGroups();
  }

  initAdminProcutionForm() {
    this.adminProcutionForm = this.formBuilder.group({
      title: ['', Validators.required],
      url: '',
      category: '',
      technologies: '',
      description: ''
    });
  }

  onDropProduction(event: CdkDragDrop<AdminProduction[]>) {
    moveItemInArray(this.productions, event.previousIndex, event.currentIndex);
    this.adminProductionService.saveNewProductionsArray(this.productions);
  }

  onAddTechnology() {
    const newTechnology = this.adminProcutionForm.get('technologies').value;
    this.technologiesAdded.push(newTechnology);
  }

  onRemoveAddedTechno(id: number) {
    this.technologiesAdded.splice(id, 1);
  }

  detectFiles(event) {
    this.fileUploaded = false;
    this.fileIsUploading = true;
    this.adminProductionService.uploadFile(event.target.files[0]).then(
      (url: string) => {
        this.onAddPhoto(url);
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

  onAddPhoto(url) {
    this.photosAdded.push(url);
  }

  onRemoveAddedPhoto(id: number) {
    this.adminProductionService.removeProductionPhoto(this.photosAdded[id]);
    this.photosAdded.splice(id, 1);
  }

  onDropPhoto(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.photosAdded, event.previousIndex, event.currentIndex);
  }

  onSaveProduction() {
    const title = this.adminProcutionForm.get('title').value;
    const url = this.adminProcutionForm.get('url').value;
    const category = this.adminProcutionForm.get('category').value;
    const technologies = this.technologiesAdded ? this.technologiesAdded : [];
    const photos = this.photosAdded ? this.photosAdded : [];
    const description = this.adminProcutionForm.get('description').value;    
    const newProduct = new AdminProduction(title, url, category, technologies, photos, description);
    this.adminProductionService.createNewProduction(newProduct);
    $('#addProductionModal').modal('hide');
    this.adminProcutionForm.reset();
    this.photosAdded = [];
    this.technologiesAdded = [];
  }

  onEditProduction(i) {
    this.router.navigate(['/admin', 'productions', 'edit', i]);
  }

  onDeleteProduction(production: AdminProduction) {
    this.adminProductionService.removeProduction(production);
  }

  onDeployProductionsSection() {
    if (this.productionsSectionDisplay == false) {
      this.productionsSectionDisplay = true;
    } else {
      this.productionsSectionDisplay = false;
    }
  }

  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
    this.productionsSubscription.unsubscribe();
    this.skillGroupsSubscription.unsubscribe();
  }

}
