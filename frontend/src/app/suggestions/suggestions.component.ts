import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent {
  // Sample suggestions — later replace with backend/AI-driven logic
  tips = [
    "Track your daily food expenses to identify savings opportunities.",
    "Consider using public transport to reduce travel costs.",
    "Set a monthly budget for books and stick to it.",
    "Review 'Other' category expenses to avoid hidden spending."
  ];
}

