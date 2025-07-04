import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Upgrade } from './upgrade/upgrade';

const routes: Routes = [
  { path: 'upgrade', component: Upgrade }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
