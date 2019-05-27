import { Component, ViewEncapsulation, OnInit, Renderer2, RendererFactory2, Inject, Input, OnChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/platform-browser';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  private renderer2: Renderer2;
  public drawImage: any;
  public menuList1 = [

  ];

  constructor(
    public toastr: ToastrService
  ) {
  }
  ngOnInit() {

    setTimeout(() => {
      this.initDraw();
      this.draw();
    }, 1000);
    setTimeout(() => { this.toastr.info('Click add', '', { timeOut : 5000 });
  }, 2000);
  }

  public drop($event) {
        this.menuList1.unshift($event);
  }

  public draw() {
    const divA: any = document.querySelector('#a');
    const divB: any = document.querySelector('#b');
    const arrowLeft = document.querySelector('#arrowLeft');
    const arrowRight = document.querySelector('#arrowRight');
    console.log({
      divA: divA,
      divB: divB,
      arrowLeft: arrowLeft,
      arrowRight: arrowRight
    });

    // const posnALeft = {
    //   x: divA.offsetLeft - 8,
    //   y: divA.offsetTop + 8
    // };
    // const posnARight = {
    //   x: divA.offsetLeft + divA.offsetWidth + 8,
    //   y: divA.offsetTop + divA.offsetHeight / 2
    // };
    // const posnBLeft = {
    //   x: divB.offsetLeft - 8,
    //   y: divB.offsetTop - 8
    // };
    // const posnBRight = {
    //   x: divB.offsetLeft + divB.offsetWidth + 8,
    //   y: divB.offsetTop + divA.offsetHeight / 2
    // };
    // const dStrLeft =
    //   'M' +
    //   (posnALeft.x + 55) + ',' + (posnALeft.y) + ' ' +
    //   'C' +
    //   (posnALeft.x + 55) + ',' + (posnALeft.y) + ' ' +
    //   (posnBLeft.x + 55) + ',' + (posnBLeft.y) + ' ' +
    //   (posnBLeft.x + 55) + ',' + (posnBLeft.y);
    // arrowLeft.setAttribute('d', dStrLeft);
    // const dStrRight =
    //   'M' +
    //   (posnBRight.x) + ',' + (posnBRight.y) + ' ' +
    //   'C' +
    //   (posnBRight.x + 100) + ',' + (posnBRight.y) + ' ' +
    //   (posnARight.x + 100) + ',' + (posnARight.y) + ' ' +
    //   (posnARight.x) + ',' + (posnARight.y);
    // arrowRight.setAttribute('d', dStrRight);




    const posnALeft = {
      x: divA.offsetLeft - 8,
      y: divA.offsetTop + 8
    };
    const posnARight = {
      x: divA.offsetLeft + divA.offsetWidth + 8,
      y: divA.offsetTop + divA.offsetHeight / 2
    };
    const posnBLeft = {
      x: divB.offsetLeft - 8,
      y: divB.offsetTop + divB.offsetHeight / 2
    };
    const posnBRight = {
      x: divB.offsetLeft + divB.offsetWidth + 8,
      y: divB.offsetTop + divA.offsetHeight / 2
    };
    const dStrLeft =
      'M' +
      (posnALeft.x ) + ',' + (posnALeft.y) + ' ' +
      'C' +
      (posnALeft.x - 100) + ',' + (posnALeft.y) + ' ' +
      (posnBLeft.x - 100) + ',' + (posnBLeft.y) + ' ' +
      (posnBLeft.x) + ',' + (posnBLeft.y);
    arrowLeft.setAttribute('d', dStrLeft);
    const dStrRight =
      'M' +
      (posnBRight.x) + ',' + (posnBRight.y) + ' ' +
      'C' +
      (posnBRight.x + 100) + ',' + (posnBRight.y) + ' ' +
      (posnARight.x + 100) + ',' + (posnARight.y) + ' ' +
      (posnARight.x) + ',' + (posnARight.y);
    arrowRight.setAttribute('d', dStrRight);

  }

  public initDraw() {
    const that = this;
    $('#a, #b').draggable({
      drag: function (event, ui) {
        that.draw();
      }
    });
  }

}
