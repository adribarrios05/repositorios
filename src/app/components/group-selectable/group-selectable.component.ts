import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonInput, IonPopover } from '@ionic/angular';
import { BehaviorSubject, Subscription, last, lastValueFrom } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { GroupsService } from 'src/app/core/services/impl/groups.service';


@Component({
  selector: 'app-group-selectable',
  templateUrl: './group-selectable.component.html',
  styleUrls: ['./group-selectable.component.scss'],
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GroupSelectableComponent),
    multi: true
  }]
})
export class GroupSelectableComponent  implements OnInit, ControlValueAccessor, OnDestroy {

  groupSelected:Group | null = null;
  disabled:boolean = true;
  private _groups:BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  public groups$ = this._groups.asObservable();

  propagateChange = (obj: any) => {}

  @ViewChild('popover', { read: IonPopover }) popover: IonPopover | undefined;

  page:number = 1;
  pageSize:number = 25;
  pages:number = 0;
  constructor(
    public groupsSvc:GroupsService
  ) { 
  }
  ngOnDestroy(): void {
    this.popover?.dismiss();
  }
  
  onLoadGroups(){
    this.loadGroups("");
  }

  

  private async loadGroups(filter:string){
    this.page = 1;
    this.groupsSvc.getAll(this.page, this.pageSize).subscribe({
      next:response=>{
        this._groups.next([...response.data]);
        this.page++;
        this.pages = response.pages;
      },
      error:err=>{}
    }) 
  }


  loadMoreGroups(notify:HTMLIonInfiniteScrollElement | null = null) {
    if(this.page<=this.pages){
      this.groupsSvc.getAll(this.page, this.pageSize).subscribe({
        next:(response:Paginated<Group>)=>{
          this._groups.next([...this._groups.value, ...response.data]);
          this.page++;
          notify?.complete();
        }
      });
    }
    else{
      notify?.complete();
    }
  }
  
  onMoreGroups(ev:InfiniteScrollCustomEvent){
    this.loadMoreGroups(ev.target);
  }

  private async selectGroup(id:string|undefined, propagate:boolean=false){
    if(id){
      this.groupSelected  = await lastValueFrom(this.groupsSvc.getById(id));
    }
    else
      this.groupSelected = null;
    if(propagate && this.groupSelected)
      this.propagateChange(this.groupSelected.id);
  }
  
  writeValue(obj: any): void {
    this.selectGroup(obj);
      
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {}

  private async filter(filtering:string){
    this.loadGroups(filtering);
  }

  onFilter(evt:any){
    this.filter(evt.detail.value);
  }

  onGroupClicked(popover:IonPopover, group:Group){
    this.selectGroup(group.id, true);
    popover.dismiss();
  }

  clearSearch(input:IonInput){
    input.value = "";
    this.filter("");
  }

  deselect(popover:IonPopover|null=null){
    this.selectGroup(undefined, true);
    if(popover)
      popover.dismiss();
  }
}
