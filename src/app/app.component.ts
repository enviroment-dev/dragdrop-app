import { Component, ViewEncapsulation, OnInit, Renderer2, RendererFactory2, Inject, Input, OnChanges, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/platform-browser';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import { interval } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  public isLoading = true;
  public drawImage: any;
  public subHeight = 0;
  public heightSVG = '100vh';

  public subClass1 = [];
  public subClass = [];
  public classQuerySelector = [];

  public listClass = [];
  public menuList1 = [];
  public listArrow = [];
  public listdivA = [];
  public listdivB = [];

  public posnALeft = [];
  public posnBLeft = [];

  public arrowLeft = [];

  constructor(
    public toastr: ToastrService
  ) {
  }
  ngOnInit() {
    setTimeout(() =>  {this.isLoading = false;
    this.showMessage();
    }, 3000);
  }

  public showMessage() {
    setTimeout(() => {
      this.toastr.info('Click hình để thêm', '', { timeOut: 5000 });
    }, 1000);
  }

  public dropImage(item) {
    this.subClass.push(item.id);
    if (this.subClass.length > 1) {
      this.listClass.push({
        idDiv: this.subClass,
        idArrow: 'arrow' + this.listClass.length
      });
    }

  }

  public drop(event) {
    this.subClass1.push(JSON.parse(JSON.stringify(event.class)));
    const subEvent = event;
    const count = this.menuList1.length;
    subEvent.id = 'a' + count;
    this.menuList1.unshift(JSON.parse(JSON.stringify(subEvent)));
    if (this.menuList1.length < 2) {
      this.toastr.info('Di chuyển hình !!', '', { timeOut: 5000 });
      setTimeout(() => {
        this.toastr.info('Nhấn delete để xóa !!', '', { timeOut: 5000 });
      }, 2000);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 46) {
      this.menuList1.pop();
    }
  }

}
