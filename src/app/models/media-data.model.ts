import { MEDIA_STATUS } from '@awesome-cordova-plugins/media/ngx';

export interface MediaData {
  qbyteId?: number;
  status?: MEDIA_STATUS;
  duration?: number;
  position?: number;
}
