import { Component, OnInit } from '@angular/core';
import { ProgessService } from './progess.service';

@Component({
  selector: 'app-progess-bar',
  template: `<div class="progress" [hidden]="!progress.isShow" style="position: relative;">
  <div class="progress-bar progress-bar-striped indeterminate"></div>
</div>`,
  styleUrls: ['./progess-bar.component.scss']
})
export class ProgessBarComponent implements OnInit {

  constructor(
    public progress: ProgessService
  ) { }

  ngOnInit() {
  }

}
