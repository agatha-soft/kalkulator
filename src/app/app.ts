import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false // This is not a standalone component, so we set this to false
})
export class App implements OnInit {
  isDarkMode = false;
  
  isPaidUser = false; // This will be determined by Firebase Auth and Firestore
  

  ngOnInit() {
    // Check user's theme preference from storage
    if (localStorage.getItem('theme') === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }

    // TODO: Check user's payment status from Firebase
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleThemeTo(theme: 'light' | 'dark') {
    this.isDarkMode = (theme === 'dark');
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  
}
