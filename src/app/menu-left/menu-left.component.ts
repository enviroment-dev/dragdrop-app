import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnInit {

  @Output() draw = new EventEmitter<any[]>();

  public menuList = [
    {
      class: 'example-box aqua-gradient',
      idInput: 'input1',
      idText: 'form1',
    },
    {
      class: 'example-box1 purple-gradient',
      idInput: 'input2',
      idText: 'form2'
    },
    {
      class: 'example-box2 peach-gradient',
      idInput: 'input3',
      idText: 'form3'
    },
    {
      class: 'example-box3 blue-gradient',
      idInput: 'input4',
      idText: 'form4'
    },
  ];
  constructor() { }

  ngOnInit() {
  }

  public drop(event: any) {
    console.log(event);
   this.draw.emit(event);
  }

}
