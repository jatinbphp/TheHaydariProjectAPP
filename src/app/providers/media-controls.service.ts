import { Injectable } from '@angular/core';
import { MediaData } from '../models/media-data.model';
import { Media, MEDIA_STATUS, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { BehaviorSubject, noop, Observable, of, Subscription, timer } from 'rxjs';
import { distinctUntilChanged, map, pluck, share, shareReplay, switchMap, tap } from 'rxjs/internal/operators';
import { Platform } from '@ionic/angular';
import { MusicControls, MusicControlsOptions } from '@awesome-cordova-plugins/music-controls/ngx';
import { Qbyte } from '../models/qbyte.interface';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';

const defaultMeta: MediaData = {
  qbyteId: null,
  status: MEDIA_STATUS.NONE,
  duration: 0,
  position: 0,
};

@Injectable({
  providedIn: 'root'
})

export class MediaControlsService 
{
  private readonly updateIntervalMilliseconds = 500;
  private readonly startStream: Observable<number> = timer(0, this.updateIntervalMilliseconds).pipe(tap(() => this.updateMediaMeta()));
  private readonly skipIntegerSeconds = 30;
  private readonly mediaData$ = new BehaviorSubject<MediaData>(defaultMeta);

  private nativeMedia: MediaObject;
  private sub: Subscription;

  constructor(private readonly media: Media, private readonly platform: Platform, private readonly musicControls: MusicControls, private offline: OfflineService, private client: ClientService) 
  { }

  private updateMediaMeta() 
  {
    this.nativeMedia.getCurrentPosition().then(position => 
    {
      this.updateMediaData({
        position: this.checkPosition(position),
        duration: this.nativeMedia.getDuration() > 0 ? this.nativeMedia.getDuration() : this.mediaData$.value.duration,
      });
    });
  }

  private updateMediaData(data: MediaData = defaultMeta) {
    this.mediaData$.next({
      ...this.mediaData$.value,
      ...data,
    });
  }

  private checkPosition(seekAmount: number, skipAmount = 0): number {
    const value = seekAmount + skipAmount;

    if (value < 0) {
      return 0;
    }

    if (value > this.mediaData$.value.duration) {
      return this.mediaData$.value.duration;
    }

    return value;
  }

  meta(): Observable<MediaData> {
    return this.mediaData$.asObservable();
  }

  play() {
    this.sub = this.startStream.subscribe();
    this.nativeMedia.play();
    this.updateLockScreenStatus(this.mediaData$.value.position, true);
    this.updateMediaData({ status: MEDIA_STATUS.RUNNING });
  }

  pause() {
    this.nativeMedia.pause();
    this.updateLockScreenStatus(this.mediaData$.value.position, false);
    this.updateMediaData({ status: MEDIA_STATUS.PAUSED });
    this.sub.unsubscribe();
  }

  playPause(qbyte: Qbyte) {
    this.create(qbyte).subscribe(() => {
      if (this.mediaData$.value.status === MEDIA_STATUS.RUNNING) {
        this.pause();
        localStorage.setItem('is_audio_played','true');        
      } else {
        this.play();
        localStorage.setItem('is_audio_played','true');        
      }
    });
  }

  stop() {
    if (this.sub && this.nativeMedia) {
      this.sub.unsubscribe();
      this.nativeMedia.pause();
      this.nativeMedia.release();
      this.musicControls.destroy();
      this.nativeMedia = null;
      //MAULIK::ADDED
      localStorage.removeItem('is_audio_played');
      this.client.publishSomeDataWhenAudioPlayed({
				is_audio_played: false
			});//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT
      //MAULIK::ADDED
    }
    this.updateMediaData();
  }

  private updateLockScreenStatus(elapsed: number, isPlaying: boolean) {    
    if (this.platform.is('android')) {
      this.musicControls.updateIsPlaying(isPlaying);
    } else {
      this.musicControls.updateElapsed({
        elapsed,
        isPlaying
      });
    }
  }

  private create(qbyte: Qbyte): Observable<boolean> {
    const sameTrack = qbyte.id === this.mediaData$.value.qbyteId;

    if (this.nativeMedia && sameTrack) {
      return of(true);
    }

    if (this.nativeMedia && !sameTrack) {
      this.stop();
    }

    this.updateMediaData({ qbyteId: qbyte.id });

    const nativeMedia$ = this.streamMedia(qbyte.id,qbyte.MP3Link);

    return nativeMedia$.pipe(
      tap(() => this.nativeMedia.onStatusUpdate
        .subscribe(status => this.onStatusUpdate(status))));
  }

  private streamMedia(qbyteId: number,MP3Link: string): Observable<boolean> {
    const streamUrl = MP3Link;
    if (this.nativeMedia) {
      this.stop();
    }

    return this.createMedia(streamUrl);
  }

  private createMedia(url: string): Observable<boolean> {
    return of(this.media.create(url))
      .pipe(
        tap(nativeMedia => nativeMedia.seekTo(this.mediaData$.value.position)),
        tap(nativeMedia => {
          this.nativeMedia = nativeMedia;
          this.platform.is('ios')
            ? noop()
            : this.nativeMedia.play();
        }),
        map(() => true)
      );
  }

  private onStatusUpdate(status: MEDIA_STATUS) {
    if (status === MEDIA_STATUS.STOPPED) {
      this.seekTo(0);
      this.updateMediaData({ status: MEDIA_STATUS.STOPPED });
      this.sub.unsubscribe();
    } else if (status === MEDIA_STATUS.RUNNING) {
      this.updateMediaData({ status: MEDIA_STATUS.RUNNING });
    }
  }

  seekTo(position: number) {
    if(position > 0)
    {
      const milliseconds = parseInt(position.toString(), 10) * 1000;
      this.nativeMedia.seekTo(milliseconds);
      this.updateMediaData({ position });
      this.updateLockScreenStatus(this.mediaData$.value.position, this.mediaData$.value.status === MEDIA_STATUS.RUNNING);
    }
  }
}
