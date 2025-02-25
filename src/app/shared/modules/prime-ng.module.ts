import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
// import { DrawerModule } from 'primeng/drawer';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputMaskModule } from 'primeng/inputmask';
import { SplitterModule } from 'primeng/splitter';
import { BlockUIModule } from 'primeng/blockui';
import { OverlayModule } from 'primeng/overlay';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TreeTableModule } from 'primeng/treetable';
import { TimelineModule } from 'primeng/timeline';
import { FieldsetModule } from 'primeng/fieldset';
import { AccordionModule } from 'primeng/accordion';
import { RatingModule } from 'primeng/rating';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
// import { Popover } from 'primeng/popover';

const modules = [
  TagModule,
  IconFieldModule,
  InputIconModule,
  MultiSelectModule,
  CommonModule,
  ButtonModule,
  CardModule,
  TooltipModule,
  MenuModule,
  MenubarModule,
  ToolbarModule,
  SplitButtonModule,
  InputTextModule,
  CarouselModule,
  DividerModule,
  DropdownModule,
  // DrawerModule,
  SelectButtonModule,
  DynamicDialogModule,
  AutoCompleteModule,
  CalendarModule,
  TableModule,
  SpeedDialModule,
  ToastModule,
  MessagesModule,
  CheckboxModule,
  PanelMenuModule,
  ProgressSpinnerModule,
  InputMaskModule,
  SplitterModule,
  BlockUIModule,
  OverlayModule,
  SidebarModule,
  RippleModule,
  ConfirmDialogModule,
  DialogModule,
  ConfirmPopupModule,
  PasswordModule,
  RadioButtonModule,
  OverlayPanelModule,
  BreadcrumbModule,
  TreeTableModule,
  TimelineModule,
  FieldsetModule,
  AccordionModule,
  RatingModule,
  TabViewModule,
  // Popover
]


@NgModule({
  declarations: [],
  imports: [modules],
  exports: [modules]
})
export class PrimeNgModule { }
