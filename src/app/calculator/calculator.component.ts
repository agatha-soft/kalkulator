import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
  standalone: false
})
export class CalculatorComponent {
  display: string = '0';
  currentValue: string = '';
  operator: string | null = null;
  firstOperand: number | null = null;
  waitingForSecondOperand: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (/[0-9]/.test(key)) {
      this.appendNumber(key);
    } else if (key === '.') {
      this.appendDecimal();
    } else if (['+', '-', '*', '/'].includes(key)) {
      this.setOperator(key);
    } else if (key === 'Enter') {
      this.calculateResult();
    } else if (key === 'Escape') {
      this.clear();
    } else if (key === 'Backspace') {
      this.display = this.display.slice(0, -1) || '0';
      this.currentValue = this.display;
    }
  }

  appendNumber(num: string) {
    if (this.waitingForSecondOperand) {
      this.display = num;
      this.waitingForSecondOperand = false;
    } else {
      this.display = this.display === '0' ? num : this.display + num;
    }
    this.currentValue = this.display;
  }

  appendDecimal() {
    if (this.waitingForSecondOperand) {
      this.display = '0.';
      this.waitingForSecondOperand = false;
    } else if (!this.display.includes('.')) {
      this.display += '.';
    }
    this.currentValue = this.display;
  }

  setOperator(op: string) {
    if (this.firstOperand === null) {
      this.firstOperand = parseFloat(this.currentValue);
    } else if (this.operator) {
      const result = this.calculate(this.firstOperand, parseFloat(this.currentValue), this.operator);
      this.display = result.toString();
      this.firstOperand = result;
    }
    this.operator = op;
    this.waitingForSecondOperand = true;
  }

  calculateResult() {
    if (this.firstOperand !== null && this.operator !== null && !this.waitingForSecondOperand) {
      const result = this.calculate(this.firstOperand, parseFloat(this.currentValue), this.operator);
      this.display = result.toString();
      this.firstOperand = result;
      this.operator = null;
      this.waitingForSecondOperand = false;
    }
  }

  calculate(num1: number, num2: number, operator: string): number {
    switch (operator) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      case '/':
        return num1 / num2;
      default:
        return num2;
    }
  }

  clear() {
    this.display = '0';
    this.currentValue = '';
    this.operator = null;
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
  }
}

