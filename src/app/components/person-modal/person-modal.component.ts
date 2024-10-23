import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Person } from 'src/app/core/models/person.model';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.scss'],
})
export class PersonModalComponent  implements OnInit {
  genders:string[] = ['Masculino', 'Femenino', 'Otros'];
  formGroup:FormGroup;
  @Input() person:Person|undefined;

  constructor(
    private fb:FormBuilder,
    private modalCtrl:ModalController
  ) { 
    this.formGroup = this.fb.group({
      name:['', [Validators.required, Validators.minLength(2)]],
      surname:['', [Validators.required, Validators.minLength(2)]],
      email:['', [Validators.required, Validators.email]],
      gender:['', [Validators.required]],
      age:['', [Validators.pattern("/\d/g")]]
    });
  }

  ngOnInit() {}

  get name(){
    return this.formGroup.controls['name'];
  }

  get surname(){
    return this.formGroup.controls['surname'];
  }

  get age(){
    return this.formGroup.controls['age'];
  }

  get email(){
    return this.formGroup.controls['email'];
  }

  get gender(){
    return this.formGroup.controls['gender'];
  }
  
  onSubmit(){
    if (this.formGroup.valid) {
      console.log('Formulario enviado:', this.formGroup.value);
      // Pasar los datos al cerrar el modal
      this.modalCtrl.dismiss(this.formGroup.value);
    } else {
      console.log('Formulario inválido');
    }

  }



}
