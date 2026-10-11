import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { Expense, ExpenseService } from '../expense.service';

interface UserProfile {
  fullname: string;
  email: string;
  

}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('expenseCanvas') private expenseCanvas?: ElementRef<HTMLCanvasElement>;

  expenses: Expense[] = [];
  user: UserProfile = { fullname: 'My profile', email: '' };
  startDate = '';
  endDate = '';
  errorMessage = '';
  suggestion: string = '';

  private chart?: Chart<'doughnut', number[], string>;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly expenseService: ExpenseService,
    private readonly http: HttpClient
  ) {}

  get filteredExpenses(): Expense[] {
    const start = this.startDate ? new Date(this.startDate + 'T00:00:00') : null;
    const end = this.endDate ? new Date(this.endDate + 'T23:59:59.999') : null;
    return this.expenses.filter((expense) => {
      const date = new Date(expense.date);
      return (!start || date >= start) && (!end || date <= end);
    });
  }

  get totalExpense(): number {
    return this.filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  }

  get transactionCount(): number {
    return this.filteredExpenses.length;
  }

  get topCategory(): string {
    const totals = this.categoryTotals();
    return Object.entries(totals).sort((first, second) => second[1] - first[1])[0]?.[0] ?? '—';
  }

  ngOnInit(): void {
    this.loadExpenses();
    this.subscriptions.add(this.expenseService.expenseAdded$.subscribe(() => this.loadExpenses()));

    const token = localStorage.getItem('authToken');
    if (token) {
      this.http.get<UserProfile>('http://localhost:3000/api/users/me', {
        headers: { Authorization: 'Bearer ' + token }
      }).subscribe({
        next: (profile) => this.user = profile,
        error: (error) => console.error('Unable to load dashboard profile:', error)
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.expenseCanvas) {
      this.chart = new Chart(this.expenseCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: ['#2878e8', '#21a179', '#f4a340', '#e65b70', '#8064c8', '#30a9b7', '#8993a4']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
      this.updateChart();
    }
  }
  private generateSuggestions(): void {
  const totals: Record<string, number> = {};
  this.filteredExpenses.forEach(e => {
    totals[e.category] = (totals[e.category] ?? 0) + e.amount;
  });

  if (Object.keys(totals).length === 0) {
    this.suggestion = 'No expenses found for the selected period.';
    return;
  }

  const topCategory = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])[0][0];

  this.suggestion = `You are spending most on ${topCategory}. Try reducing it.`;
}

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.subscriptions.unsubscribe();
  }

  applyFilter(): void {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.errorMessage = 'The start date must be on or before the end date.';
      return;
    }
    this.errorMessage = '';
    this.updateChart();
    this.generateSuggestions();

  }

  clearFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.errorMessage = '';
    this.updateChart();
    this.generateSuggestions();

  }

  private loadExpenses(): void {
    this.subscriptions.add(this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.updateChart();
        this.generateSuggestions();

      },
      error: (error) => {
        console.error('Unable to load dashboard expenses:', error);
        this.errorMessage = 'Could not load expenses. Check that the API and database are running.';
      }
    }));
  }

  private categoryTotals(): Record<string, number> {
    return this.filteredExpenses.reduce<Record<string, number>>((totals, expense) => {
      totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
      return totals;
    }, {});
  }

  private updateChart(): void {
    if (!this.chart) {
      return;
    }

    const totals = this.categoryTotals();
    this.chart.data.labels = Object.keys(totals);
    this.chart.data.datasets[0].data = Object.values(totals);
    this.chart.update();
  }
}
