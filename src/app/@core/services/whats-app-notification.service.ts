import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WhatsAppCred } from 'src/app/shared/modals/whatsAppCred';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppNotificationService {

  constructor(
    private _httpServices: HttpClient
  ) { }

  private _formData: FormData = new FormData();

  setFormData(_message: string, _receiverId: string, _uploadingFilePath?: string) {
    let _formData: FormData = new FormData();
    _formData.append('senderId=', WhatsAppCred.senderId);
    _formData.append('authToken=', WhatsAppCred.authToken);
    _formData.append('messageText=', _message);
    _formData.append('receiverId=', _receiverId);
    _formData.append('uploadFile=@', _uploadingFilePath || '');
    return _formData;
  }

  sendNotification(_message: string, _receiverId: string, _uploadingFilePath?: string) {
    let _res = this.setFormData(_message, _receiverId, _uploadingFilePath || '');
    return this._httpServices.post(WhatsAppCred.whatAppURL, _res);
    // this._formData.append()
  }


}
