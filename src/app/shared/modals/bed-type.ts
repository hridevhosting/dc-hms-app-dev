import { inject } from "@angular/core";
import { CommonService } from "src/app/@core/services/common.service";

export class BedType {
  BedTypeId: number = 0;
  Description: string = '';
  Charges: number = 0;
  Active: number = 1;
  CreatedBy: number = getUserId();
  CreatedAt: string = getDateTime() || '';
}


function getUserId() {
  return inject(CommonService).getCurrentSessionUserId();
}

function getDateTime() {
  return inject(CommonService).trasformDateTimeByFormat();
}
