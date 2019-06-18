import { Component, ViewEncapsulation, OnInit, Renderer2, RendererFactory2, Inject, Input, OnChanges, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/platform-browser';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import { interval } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import * as moment from 'moment-timezone';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

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
  // Tạo height động cho thẻ svg
  public heightSVG = '100vh';

  public subClass = [];
  public classQuerySelector = [];

  public listClass: any = [];


  public menuList1 = [];
  public subMenu = [];

  public listArrow = [];
  public listdivA = [];
  public listdivB = [];

  public posnALeft = [];
  public posnBLeft = [];

  public arrowLeft = [];

  public listInput = [];

  public fileContent: any;
  public positionTop: any;
  public positionLeft: any;
  public enableDeleteArrow = false;

  constructor(
    public toastr: ToastrService,
    public dialog: MatDialog
  ) {
  }
  ngOnInit() {
    // Show loading
    setTimeout(() => {
      this.isLoading = false;
      this.showMessage();
    }, 3000);
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // Show Message
  public showMessage() {
    setTimeout(() => {
      this.toastr.info('Click hình để thêm', '', { timeOut: 5000 });
    }, 1000);
  }

  // Push hai hình trước khi vẽ
  public dropImageBottom(item) {
    this.subClass.push(item.id);
    if (this.subClass.length > 1) {
      let count: any;
      if (this.listArrow.length <= 0) {
        count = 0;
        this.listClass.push({
          idDiv: this.subClass,
          idArrow: 'arrow' + count
        });
      } else {
        const subCount = this.listArrow[this.listArrow.length - 1];
        count = subCount.split('arrow');
        this.listClass.push({
          // idDiv: 2 id của hai điểm
          idDiv: this.subClass,
          // idArrow: 2 điểm có một mủi tên
          // idArrow: 'arrow' + this.listClass.length
          idArrow: 'arrow' + (+count[1] + 1)
        });
      }
      // Gọi hàm vẽ mủi tên
      this.draw('bottom');
    }
  }

  public drop(event) {
    const subEvent = event;
    const count = this.menuList1.length;
    // Tạo id động cho từng hình
    subEvent.id = 'a' + count;
    subEvent.idText = 'form' + count;
    this.menuList1.push(JSON.parse(JSON.stringify(subEvent)));
    this.subMenu.push(JSON.parse(JSON.stringify(subEvent)));
    // Delay để gọi hàm Drag của Jquery
    setTimeout(() => {
      this.initDraw();
    }, 500);
    // Show message
    if (this.menuList1.length < 2) {
      this.toastr.info('Di chuyển hình !!', '', { timeOut: 5000 });
      setTimeout(() => {
        this.toastr.info('Nhấn delete để xóa !!', '', { timeOut: 5000 });
      }, 2000);
    }
  }

  public importJson(fileList: FileList): void {
    const file = fileList[0];
    if (file.type !== 'application/json') {
      this.toastr.error('Lỗi định dạng !!');
    } else {
      this.menuList1 = [];
      this.listArrow = [];
      const fileReader: FileReader = new FileReader();
      const that = this;
      fileReader.onloadend = function (x) {
        that.fileContent = fileReader.result;
        that.addImportEnd(JSON.parse(that.fileContent));
      };
      fileReader.readAsText(file);
    }
  }

  public addImportEnd(data) {
    this.openDialog(data);
    const subData = [];
    if (data.length <= 0) {
      this.toastr.error('Lỗi định dạng !!');
    } else {
      for (let i = 0; i < (data.length - 1); i++) {
        const exitKey = this.isExistImport(subData, data[i].key[0][0].id);
        if (exitKey === -1) {
          subData.push(data[i].key[0][0]);
        }
        for (let e = 0; e < data[i].option.length; e++) {
          const exitOption = this.isExistImport(subData, data[i].option[e][0].id);
          if (exitOption === -1) {
            subData.push(data[i].option[e][0]);
          }
        }
      }
    }

    this.menuList1 = subData;
    this.listClass = data[data.length - 1];
    if (this.menuList1.length <= 0) {
      this.toastr.error('Lỗi định dạng !!');
    } else {
      setTimeout(() => {
        this.initDraw();
        this.draw('importJSON');
      }, 500);
    }
  }

  public exportJson() {
    let dataKey: any;
    let dataOption: any;
    let positionKey: any;
    let positionOption: any;

    let classKey: any;
    let classOption: any;

    const exportJson = [];
    for (let i = 0; i < this.listClass.length; i++) {
      let obj;
      // Lấy value từ id input tag
      dataKey = $('#' + this.listClass[i].idDiv[0].replace('a', 'form').toString())[0].value;
      positionKey = $('#' + this.listClass[i].idDiv[0]);
      classKey = this.menuList1.filter(item => item.id === this.listClass[i].idDiv[0]);
      classKey[0].positionTop = positionKey.position().top;
      classKey[0].positionLeft = positionKey.position().left;
      classKey[0].value = dataKey;
      dataOption = $('#' + this.listClass[i].idDiv[1].replace('a', 'form').toString())[0].value;
      positionOption = $('#' + this.listClass[i].idDiv[1]);
      classOption = this.menuList1.filter(item => item.id === this.listClass[i].idDiv[1]);
      classOption[0].positionTop = positionOption.position().top;
      classOption[0].positionLeft = positionOption.position().left;
      classOption[0].value = dataOption;
      const index = this.isExist(exportJson, dataKey);
      if (index === -1) {
        obj = {
          key: [
            classKey.concat(dataKey)
          ],
          option: [
            classOption.concat(dataOption)
          ]
        };
      } else {
        (exportJson[index].option).push(classOption.concat(dataOption)
        );
      }
      if (obj) {
        exportJson.push(obj);
      }
    }
    if (exportJson.length <= 0) {
      this.toastr.error('Chưa có dữ liệu !!');
    } else if (dataKey === '' || dataOption === '') {
      this.toastr.error('Vui lòng nhập dữ liệu !!');
    } else {
      exportJson.push(this.listClass);
      // const subArr = Object.assign({}, exportJson);
      const json = JSON.stringify(exportJson);
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, 'data' + this.convertDateFileName(new Date()) + '.json');
    }
  }

  isExistImport(exportJson, key) {
    let index = 0;
    for (const item of exportJson) {
      if (item && item.id === key.toString()) {
        return index;
      }
      index++;
    }
    return -1;
  }

  // Kiếm tra tồn tại của key
  isExist(exportJson, key) {
    let index = 0;
    for (const item of exportJson) {
      if (item && item.key[0][1] === key.toString()) {
        return index;
      }
      index++;
    }
    return -1;
  }

  // Lấy tên file theo ngày giờ
  public convertDateFileName(date: Date): string {
    const value = moment(date);
    return value.format('_YYYYMMDD' + 'hhmmss');
  }

  public draw(location) {
    // Có đủ hai điểm để vẽ mủi tên
    if (this.subClass.length > 1) {
      this.subClass = [];
      this.classQuerySelector = [];
      this.listArrow = [];
      this.posnALeft = [];
      this.posnBLeft = [];
      for (let i = 0; i < this.listClass.length; i++) {
        this.listArrow.push(this.listClass[i].idArrow);
        const subClassQuerySelector = [];
        for (let e = 0; e < this.listClass[i].idDiv.length; e++) {
          // Push querySelector id của hai hình để lấy vị trí
          subClassQuerySelector.push(document.querySelector('#' + this.listClass[i].idDiv[e]));
        }
        this.classQuerySelector.push(subClassQuerySelector);
      }
      // Chạy for lấy 2 vị trí x và y của hai hình để xác định vị trí vẽ mủi tên
      for (let i = 0; i < this.classQuerySelector.length; i++) {
        for (let e = 0; e < this.classQuerySelector[i].length; e++) {
          if (e === 0) {
            // Vị trí x, y hình 1
            this.posnALeft.push({
              x: this.classQuerySelector[i][e].offsetLeft - 5,
              y: this.classQuerySelector[i][e].offsetTop + (this.classQuerySelector[i][e].offsetHeight / 2)
            });
          } else {
            // Vị trí x, y hình 2
            this.posnBLeft.push({
              x: this.classQuerySelector[i][e].offsetLeft - 5,
              y: this.classQuerySelector[i][e].offsetTop + (this.classQuerySelector[i][e].offsetHeight / 2)
            });
          }
        }
      }
      this.arrowLeft = [];
      // Chạy for cho nhiều mủi tên của nhiều cặp hình
      for (let i = 0; i < this.listArrow.length; i++) {
        let subArrow: any;
        // interval 0,5s để html kịp zen mủi tên
        const source = interval(500).subscribe(() => {
          // lấy querySelector của mủi tên
          subArrow = document.querySelector('#' + this.listArrow[i]);
          if (subArrow) {
            this.arrowLeft.push(document.querySelector('#' + this.listArrow[i]));
            source.unsubscribe();
            for (let e = 0; e < this.arrowLeft.length; e++) {
              // Tạo vị trí của mủi tên
              const dStrLeft =
                // 'M' bắt đầu vị trí mủi tên là vị trí x, y của hình 1
                // https://www.w3.org/TR/SVG/paths.html
                'M' +
                (this.posnALeft[e].x + 55) + ',' + (this.posnALeft[e].y) + ' ' +
                // 'L' vẽ một đường thắng bắt đầu từ điểm 'M' đến điểm x, y của 'L'
                'L' +
                (this.posnBLeft[e].x + 55) + ',' + (this.posnBLeft[e].y);
              // setAttribute để vẽ mủi tên
              this.arrowLeft[e].setAttribute('d', dStrLeft);
            }
          }
        });
      }
    } else if (location === 'importJSON') {
      this.subClass = [];
      this.classQuerySelector = [];
      this.listArrow = [];
      this.posnALeft = [];
      this.posnBLeft = [];
      for (let i = 0; i < this.listClass.length; i++) {
        this.listArrow.push(this.listClass[i].idArrow);
        const subClassQuerySelector = [];
        for (let e = 0; e < this.listClass[i].idDiv.length; e++) {
          // Push querySelector id của hai hình để lấy vị trí
          subClassQuerySelector.push(document.querySelector('#' + this.listClass[i].idDiv[e]));
        }
        this.classQuerySelector.push(subClassQuerySelector);
      }
      // Chạy for lấy 2 vị trí x và y của hai hình để xác định vị trí vẽ mủi tên
      for (let i = 0; i < this.classQuerySelector.length; i++) {
        for (let e = 0; e < this.classQuerySelector[i].length; e++) {
          if (e === 0) {
            // Vị trí x, y hình 1
            this.posnALeft.push({
              x: this.classQuerySelector[i][e].offsetLeft - 5,
              y: this.classQuerySelector[i][e].offsetTop + (this.classQuerySelector[i][e].offsetHeight / 2)
            });
          } else {
            // Vị trí x, y hình 2
            this.posnBLeft.push({
              x: this.classQuerySelector[i][e].offsetLeft - 5,
              y: this.classQuerySelector[i][e].offsetTop + (this.classQuerySelector[i][e].offsetHeight / 2)
            });
          }
        }
      }
      this.arrowLeft = [];
      // Chạy for cho nhiều mủi tên của nhiều cặp hình
      for (let i = 0; i < this.listArrow.length; i++) {
        let subArrow: any;
        // interval 0,5s để html kịp zen mủi tên
        const source = interval(500).subscribe(() => {
          // lấy querySelector của mủi tên
          subArrow = document.querySelector('#' + this.listArrow[i]);
          if (subArrow) {
            this.arrowLeft.push(document.querySelector('#' + this.listArrow[i]));
            source.unsubscribe();
            for (let e = 0; e < this.arrowLeft.length; e++) {
              // Tạo vị trí của mủi tên
              const dStrLeft =
                // 'M' bắt đầu vị trí mủi tên là vị trí x, y của hình 1
                // https://www.w3.org/TR/SVG/paths.html
                'M' +
                (this.posnALeft[e].x + 55) + ',' + (this.posnALeft[e].y) + ' ' +
                // 'L' vẽ một đường thắng bắt đầu từ điểm 'M' đến điểm x, y của 'L'
                'L' +
                (this.posnBLeft[e].x + 55) + ',' + (this.posnBLeft[e].y);
              // setAttribute để vẽ mủi tên
              this.arrowLeft[e].setAttribute('d', dStrLeft);
            }
          }
        });
      }
    }
  }

  // Function vẽ lại hình khi drag khi đã vẽ mủi tên
  public subDrag(id) {
    const subListClass = [];
    const subOffsetTop = [];
    if (this.listArrow.length > 0) {
      for (let i = 0; i < this.listClass.length; i++) {
        for (let e = 0; e < this.listClass[i].idDiv.length; e++) {
          const isExit = subListClass.includes(this.listClass[i].idDiv[e]);
          if (!isExit) {
            subListClass.push(this.listClass[i].idDiv[e]);
            const offsetTop: any = document.querySelector('#' + this.listClass[i].idDiv[e]);
            subOffsetTop.push(offsetTop.offsetTop);
          }
        }
      }
      const subHeightSVG = subOffsetTop.sort((a, b) => a > b ? -1 : 1);
      this.heightSVG = subHeightSVG[0] + 100 + 'px';
    }

    const subData = $('#' + id);
    this.positionTop = subData.position().top;
    this.positionLeft = subData.position().left;
    if (this.listArrow.length > 0) {
      const avgDiv = [];
      const subArrow = [];
      this.listClass.forEach(element => {
        element.idDiv.filter(item => {
          if (item === id) {
            subArrow.push(element.idArrow);
            avgDiv.push(element.idDiv);
          }
        });
      });
      const arrowLeft = [];
      for (let i = 0; i < subArrow.length; i++) {
        const divA: any = document.querySelector('#' + avgDiv[i][0]);
        const divB: any = document.querySelector('#' + avgDiv[i][1]);
        let subArrow1: any;
        const source = interval(500).subscribe(() => {
          subArrow1 = document.querySelector('#' + subArrow[i]);
          if (subArrow1) {
            arrowLeft.push(document.querySelector('#' + subArrow[i]));
            source.unsubscribe();
            const posnALeft = {
              x: divA.offsetLeft - 5,
              y: divA.offsetTop + (divA.offsetHeight / 2)
            };
            const posnBLeft = {
              x: divB.offsetLeft - 5,
              y: divB.offsetTop + (divB.offsetHeight / 2)
            };
            const dStrLeft =
              'M' +
              (posnALeft.x + 55) + ',' + (posnALeft.y) + ' ' +
              'L' +
              (posnBLeft.x + 55) + ',' + (posnBLeft.y);
            arrowLeft[i].setAttribute('d', dStrLeft);
          }
        });
      }
    }
  }

  // Function apply draggable cho tất cả hình
  public initDraw() {
    const that = this;
    const id = [];
    let subId = '';
    // Push từng id riêng biệt cho hình
    for (let i = 0; i < this.menuList1.length; i++) {
      id.push('#' + this.menuList1[i].id);
    }
    for (let e = 0; e < id.length; e++) {
      (e + 1) === id.length ? subId += id[e] : subId += id[e] + ',';
    }
    $(subId).draggable({
      drag: function (event, ui) {
        const idDrag = event.target.id;
        that.subDrag(idDrag);
      }
    });
  }

  public clearAll() {
    try {
      this.menuList1 = [];
      this.listArrow = [];
      this.listClass = [];
      this.enableDeleteArrow = false;
      this.toastr.success('Xóa tất cả thành công !!');
    } catch (error) {
      this.toastr.error('Xóa tất cả thất bại !!');
    }
  }

  public clearArrow(params) {
    this.toastr.info('Click vào mủi tên muốn xóa !!');
    this.enableDeleteArrow = true;
    console.log({
      0: this.listArrow,
      1: this.menuList1,
      2: this.listClass
    });
  }

  public clickArrow(item) {
    if (this.enableDeleteArrow === true) {
      for (let i = 0; i < this.listArrow.length; i++) {
        if (this.listArrow[i] === item) {
          this.listArrow.splice(i, 1);
          this.listClass.splice(i, 1);
        }
      }
    }
  }

  // Bắt sự kiện nút delete để xóa hình
  // Sẽ bắt sự kiện xóa mủi tên sau
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 46) {
      this.menuList1.pop();
      this.listArrow.pop();
      this.listClass.pop();
    }
  }

}
