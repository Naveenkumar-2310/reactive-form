import { Component, OnInit } from '@angular/core';
import { AppModule } from './module/module.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [AppModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'reactive-form';

  reactiveForm!: FormGroup;
  submittedData: any[] = [];
  editIndex: null | number = null;
  comAddressError: boolean = false;

  ngOnInit() {
    this.submittedData = this.getFromLocalStorage();

    this.reactiveForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      organization: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      gender: new FormControl('male'),
      mobileNo: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      pincode: new FormControl(null, Validators.required),
      comAddress: new FormControl(null, Validators.required),
      permanentAddress: new FormControl(null, Validators.required),
      sameAddress: new FormControl(false),
    });
  }

  saveToLocalStorage(data: any[]) {
    localStorage.setItem('userData', JSON.stringify(data));
  }

  getFromLocalStorage(): any[] {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : [];
  }

  handleAddressChange(event: any) {
    const isChecked = event.checked;

    const comAddress = this.reactiveForm.get('comAddress')?.value;
    const permanentCtrl = this.reactiveForm.get('permanentAddress');

    if (isChecked) {
      if (!comAddress || comAddress.trim() === '') {
        this.comAddressError = true;
        this.reactiveForm.get('sameAddress').setValue(false);
        permanentCtrl?.reset();
      } else {
        this.comAddressError = false;
        permanentCtrl?.setValue(comAddress);
      }
    } else {
      this.comAddressError = false;
      permanentCtrl?.reset();
    }
  }

  onSubmit() {
    if (this.reactiveForm.invalid) {
      return;
    }
    console.log(this.reactiveForm);

    const formData = { ...this.reactiveForm.value };

    if (this.editIndex !== null) {
      this.submittedData[this.editIndex] = formData;
      this.editIndex = null;
    } else {
      // Create new
      this.submittedData.push(formData);
    }

    this.saveToLocalStorage(this.submittedData);
    this.reactiveForm.reset({
        firstName: null,
        lastName: null,
        organization: null,
        date: null,
        gender: 'male',
        mobileNo: null,
        email: null,
        pincode: null,
        comAddress: null,
        permanentAddress: null,
        sameAddress: false,
    });


Object.keys(this.reactiveForm.controls).forEach(key => {
  const control = this.reactiveForm.get(key);
  console.log(control)
  control?.setErrors(null);  
  control?.markAsPristine();
  control?.markAsUntouched();
});

    // this.reactiveForm.reset({
    //   gender: 'male',
    //   sameAddress: false,
    // });
  }

  onEdit(index: number) {
    const stored = this.submittedData[index];
    this.reactiveForm.patchValue(stored);

    this.editIndex = index;
  }

  onDelete(index: number) {
    this.submittedData.splice(index, 1);
    this.saveToLocalStorage(this.submittedData);

    if (this.editIndex === index) {
      this.reactiveForm.reset({
        firstName: null,
        lastName: null,
        organization: null,
        date: null,
        gender: 'male',
        mobileNo: null,
        email: null,
        pincode: null,
        comAddress: null,
        permanentAddress: null,
        sameAddress: false,
      });
      this.editIndex = null;
    }
  }
}
