import { Routes } from '@angular/router';
import { Settings } from './settings';
import { SettingCategoryComponent } from './setting-category/setting-category';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: Settings,
    children: [
      { path: '', redirectTo: 'authentication', pathMatch: 'full' },
      { path: ':category', component: SettingCategoryComponent },
    ],
  },
];
