import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, iif, Observable, of } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/internal/operators';
import { Qbyte } from '../../models/qbyte.interface';
import { MediaControlsService } from '../../providers/media-controls.service';
import { MEDIA_STATUS } from '@awesome-cordova-plugins/media/ngx';
import { MediaData } from '../../models/media-data.model';
@Component({
  selector: 'app-qbyte-card',
  templateUrl: './playmusic.component.html',
  styleUrls: ['./playmusic.component.scss'],
})

export class PlaymusicComponent implements OnInit 
{
  @Input() qbyte: Qbyte;
  @Input() isDisabled = false;

  @Output() detail = new EventEmitter<Qbyte>();
  @Output() play = new EventEmitter<Qbyte>();
  @Output() remove = new EventEmitter<Qbyte>();

  mediaStatus = MEDIA_STATUS;
  status$: Observable<MEDIA_STATUS>;
  hasPlayed$ = new BehaviorSubject<boolean>(false);
  mediaStream$: Observable<MediaData>;
  constructor(private readonly mediaControllerService: MediaControlsService)
  {}

  async ngOnInit()
  {
    if(this.qbyte!=undefined)
    {
      this.status$ = this.mediaControllerService.meta().pipe(
      switchMap(m => iif(
        () => m.qbyteId === this.qbyte.id,
        of(m.status),
        of(MEDIA_STATUS.STOPPED)
      )),
      distinctUntilChanged());
    }
  }

  setHasPlayedTrue() {
    this.hasPlayed$.next(true);
  }

  StopMedia(){
    this.mediaControllerService.stop();
    this.setHasPlayedFalse();
  }

  setHasPlayedFalse() {
    this.hasPlayed$.next(false);
  }
}
