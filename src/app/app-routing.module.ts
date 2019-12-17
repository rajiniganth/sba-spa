import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { TaskComponent } from './task/task.component';
import { ViewTaskComponent } from './task/view-task.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/project', pathMatch: 'full' },
  { path: 'project', component: ProjectComponent },
  { path: 'task', component: TaskComponent },
  { path: 'user', component: UserComponent },
  { path: 'view-task', component: ViewTaskComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ProjectComponent, PageNotFoundComponent, TaskComponent, ViewTaskComponent, UserComponent]
