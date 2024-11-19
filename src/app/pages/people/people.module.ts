import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PeoplePage } from './people.page';
import { PeoplePageRoutingModule } from './people-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PeoplePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PeoplePage]
})
export class PeoplePageModule { }
