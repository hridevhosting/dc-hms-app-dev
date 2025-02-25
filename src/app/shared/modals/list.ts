export class List {

  constructor(_listType: string) {
    this.ListType = _listType
  }

  ListItemId: number = -1;
  ListType: string = '';
  ListItem: string = '';
  Active: number = 1;
  CreatedBy: number = 0;
  // CreatedAt: string = '';
  ListParam: any = "";
  // IsSync: number = 0;
  SeqNo: number = 0;
  // UseCount: number = 0;
  userid: number = 0;
  department: string = '';
}


