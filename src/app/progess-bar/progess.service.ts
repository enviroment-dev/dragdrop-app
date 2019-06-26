import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgessService {
  isShow = false;
  constructor() { }

  show() {
    this.isShow = true;
  }

  hide() {
    this.isShow = false;
  }
}
