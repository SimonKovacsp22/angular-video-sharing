import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clip.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  activeClip: IClip | null = null;
  clips: IClip[] = [];
  sort$: BehaviorSubject<string>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
      this.sort$.next(this.videoOrder);
    });
    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = [];

      docs.forEach((doc) => {
        this.clips.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
    });
  }
  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }
  openModal($event: Event, clip: IClip) {
    $event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModal('editClip');
  }
  update($event: IClip) {
    this.clips.forEach((element, idx) => {
      if (element.docId == $event.docId) {
        this.clips[idx].title = $event.title;
      }
    });
  }
  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this.clipService.deleteClip(clip);

    this.clips.forEach((element, idx) => {
      if (element.docId == clip.docId) {
        this.clips.splice(idx, 1);
      }
    });
  }

  async copyToClipboard($event: Event, clipId: string | undefined) {
    $event.preventDefault();

    if (!clipId) {
      return;
    }

    const url = `${location.origin}/clip/${clipId}`;

    await navigator.clipboard.writeText(url);

    alert('Link Copied!');
  }
}
