import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';

@Component({
  selector: 'app-group-selectable',
  templateUrl: './group-selectable.component.html',
  styleUrls: ['./group-selectable.component.scss'],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=>GroupSelectableComponent),
      multi:true
    }
  ]
})
export class GroupSelectableComponent  implements OnInit, ControlValueAccessor {

  private _groups:BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  public groups$:Observable<Group[]> = this._groups.asObservable();

  @Input() set groups(groups:Group[]){
      this._groups.next(groups);
  }

  selectedGroupId:string|null = null;
  onChanged:any;
  onTouched:any;
  disabled:boolean = false;

  constructor() { }
  writeValue(obj: string): void {
    this.selectedGroupId = obj;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {}

  onSelectionChange(event:any){
    this.selectedGroupId = event.detail.value;
    this.onChanged(this.selectedGroupId);
    this.onTouched();
  }

}
