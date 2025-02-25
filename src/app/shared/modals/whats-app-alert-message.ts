export class WhatsAppAlertMessage {

  constructor(_whatsAppMsgType: string) {
    this.WhatsAppType = _whatsAppMsgType.toUpperCase();
  }

  WhatsAppId: number = 0;
  SchDate: string = '';
  WhatsAppType: string = '';
  MobileNo: string = '';
  WhatsAppText: string = '';
  FilePath: string = '';
  Sent: string = '';
  Active: number = 1;
  SentAt: string = '';
  EntityId: number = 0;
  AppointmentId: number = 0;
  IsSync: number = 0;
  PersonName: string = '';
  url: string = '';
  response: string = '';
  noOfAttempt: number = 0;
  tableName: string = '';
  id: number = 0;

}
