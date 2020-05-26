import { Employee } from 'src/app/models/employee.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  public user: any;
  private emitChangeSource = new Subject<any>();

  constructor() {}

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(data) {
    this.emitChangeSource.next(data);
  }
}
