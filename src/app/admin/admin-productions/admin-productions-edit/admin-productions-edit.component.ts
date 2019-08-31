import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminCategory } from 'src/app/models/AdminCategory.model';
import { Subscription } from 'rxjs';
import { AdminSkillGroup } from 'src/app/models/AdminSkillGroup.model';
import { AdminProduction } from 'src/app/models/AdminProduction.model';
import { AdminSkill } from 'src/app/models/AdminSkill.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminCategoriesService } from 'src/app/services/admin/admin-categories.service';
import { AdminSkillsService } from 'src/app/services/admin/admin-skills.service';
import { AdminProductionsService } from 'src/app/services/admin/admin-productions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-productions-edit',
  templateUrl: './admin-productions-edit.component.html',
  styleUrls: ['./admin-productions-edit.component.css']
})
export class AdminProductionsEditComponent implements OnInit, OnDestroy {

  categories: AdminCategory[];
  categorySubscription: Subscription;

  skillGroups: AdminSkillGroup[];
  skillGroupsSubscription: Subscription;

  production: AdminProduction;

  allSkills: AdminSkill[] = [];

  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  technologiesAdded: any[] = [];
  photosAdded: any[]= [];

  editProcutionForm: FormGroup;

  msg: string = '';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private adminCategoriesService: AdminCategoriesService,
    private adminSkillsService: AdminSkillsService,
    private adminProductionService: AdminProductionsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initProduction();
    this.initSkills();
    this.initCategories();
    this.initEditProcutionForm();
  }

  initProduction() {
    this.production = new AdminProduction('', '', '', [], [], '');
    const id = this.route.snapshot.params['id'];
    this.adminProductionService.getSingleProduction(+id).then(
      (production: AdminProduction) => {
        this.production = production;
        this.technologiesAdded = this.production.technologies ? this.production.technologies : [];
        this.photosAdded = this.production.photos ? this.production.photos : [];
        if (this.production !== undefined) {
          this.editProcutionForm.get('title').setValue(this.production.title);
          this.editProcutionForm.get('url').setValue(this.production.url);
          this.editProcutionForm.get('category').setValue(this.production.category);
          this.editProcutionForm.get('description').setValue(this.production.description);
        }
      }
    );
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

  initEditProcutionForm() {
    this.editProcutionForm = this.formBuilder.group({
      title: ['', Validators.required],
      url: '',
      category: '',
      technologies: '',
      description: ''
    });
  }

  onAddTechnology() {
    const newTechnology = this.editProcutionForm.get('technologies').value;
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
    const id = this.route.snapshot.params['id'];
    const title = this.editProcutionForm.get('title').value;
    const url = this.editProcutionForm.get('url').value;
    const category = this.editProcutionForm.get('category').value;
    const technologies = this.technologiesAdded ? this.technologiesAdded : [];
    const photos = this.photosAdded ? this.photosAdded : [];
    const description = this.editProcutionForm.get('description').value;    
    const newProduct = new AdminProduction(title, url, category, technologies, photos, description);
    this.adminProductionService.updateProduct(newProduct, id);
    this.msg = 'Enregistrement effectué';
  }

  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
    this.skillGroupsSubscription.unsubscribe();
  }

}
