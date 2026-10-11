import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';   // 👈 keep this
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseChartComponent } from './expense-chart/expense-chart.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { LogoutComponent } from './logout/logout.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'add-expense', component: ExpenseFormComponent },   // 👈 route points to ExpenseFormComponent
      { path: 'expenses', component: ExpenseListComponent },
      { path: 'chart', component: ExpenseChartComponent },
      { path: 'suggestions', component: SuggestionsComponent }
    ]
  },
  { path: 'logout', component: LogoutComponent }
];
