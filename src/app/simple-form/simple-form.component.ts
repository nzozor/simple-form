import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '../title.model';
import { TitleService } from '../title.service';
import { map, tap } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss']
})
export class SimpleFormComponent implements OnInit {

  myFormGroup: FormGroup;
  constructor(private titleService: TitleService, private fb: FormBuilder) { }

  titles$: Observable<Title[]> = this.titleService.getTitles().pipe(
  map(titles => { 
      return titles.filter(title => title.name !== '!').sort( (a,b) => {
        if(a.name < b.name) { return -1};
        if(a.name > b.name)  {}
        return 0;
      })}
  ),
  tap((titles) => titles.map((title) => { 
    if (title.isDefault) { 
      this.myFormGroup.get('title')?.setValue(title.name)
    }
  })));

  get isTermsAndCondAcpt(): boolean { return this.myFormGroup.get('acceptTerms')?.value === true }
  
  get isLastNameValid(): boolean { 
    const lastName = this.myFormGroup.get('lastName') as AbstractControl;
    return !lastName.errors?.required || !lastName.touched
  }

  ngOnInit(): void {
    this.myFormGroup = this.fb.group({
      title: '', 
      firstName: '',
      lastName: ['', Validators.required], 
      acceptTerms: ''
    });
  }

  onSubmit(): void {
    this.displayFormData();
    this.triggerValidation();
  }

  private displayFormData(): void {
    const valToDisplay:any = {};
    for(let key in this.myFormGroup.controls) {
      valToDisplay[key] = this.myFormGroup.controls[key].value;
    }
    console.log(valToDisplay);
  }

  private triggerValidation(): void {
    for(let key in this.myFormGroup.controls) {
      const control = this.myFormGroup.get(key) as AbstractControl;        
      control.markAsTouched({ onlySelf: true }); 
    }
  }
}
