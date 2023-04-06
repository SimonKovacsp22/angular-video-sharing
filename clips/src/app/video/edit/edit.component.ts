import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  constructor(private modal: ModalService, private clipService: ClipService) {}
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  clipId = new FormControl('', {
    nonNullable: true,
  });
  editForm = new FormGroup({
    title: this.title,
    id: this.clipId,
  });
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Clip is being updated.';
  @Output() update = new EventEmitter();
  ngOnInit(): void {
    this.modal.register('editClip');
  }
  ngOnDestroy() {
    this.modal.unregister('editClip');
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipId.setValue(this.activeClip.docId as string);
    this.title.setValue(this.activeClip.title);
  }
  async submit() {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Clip is being updated.';
    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong.';
      return;
    }
    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Clip updated successfuly';
  }
}
