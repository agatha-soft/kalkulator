import { Component, EventEmitter, HostListener, Output } from '@angular/core';

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
  lastTypedChar: string = '';
  @Output()
  changeMode = new EventEmitter<'light' | 'dark'>();
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    let valueToProcess: string = '';
    if (key === 'l') {
      this.changeMode.emit('light');
      return;
    }
    if (key === 'd') {
      this.changeMode.emit('dark');
      return;
    }
    if (/[0-9]/.test(key)) {
      valueToProcess = key;
    } else if (key === '.') {
      valueToProcess = '.';
    } else if (['+', '-', '*', '/'].includes(key)) {
      valueToProcess = key;
    } else if (key === 'Enter') {
      valueToProcess = '=';
    } else if (key === 'Escape') {
      valueToProcess = 'AC';
    } else if (key === 'Backspace') {
      this.display = this.display.slice(0, -1) || '0';
      this.currentValue = this.display;
      return;
    }

    if (valueToProcess) {
      this.handleButtonClick(valueToProcess);
    }
  }

  handleButtonClick(value: string) {
    this.lastTypedChar = value;
    setTimeout(() => {
      this.lastTypedChar = '';
    }, 250);

    switch (value) {
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        this.appendNumber(value);
        break;
      case '.':
        this.appendDecimal();
        break;
      case '+': case '-': case '*': case '/':
        this.setOperator(value);
        break;
      case '=':
        this.calculateResult();
        break;
      case 'AC':
        this.clear();
        break;
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
    const getDecimalPlaces = (num: number): number => {
      const str = num.toString();
      const match = str.match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) {
        return 0;
      }
      return Math.max(
        0,
        (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
      );
    };

    let result: number;

    switch (operator) {
      case '+':
      case '-':
        const decimalPlaces1 = getDecimalPlaces(num1);
        const decimalPlaces2 = getDecimalPlaces(num2);
        const maxDecimalPlaces = Math.max(decimalPlaces1, decimalPlaces2);
        const multiplier = Math.pow(10, maxDecimalPlaces);
        if (operator === '+') {
          result = (num1 * multiplier + num2 * multiplier) / multiplier;
        } else {
          result = (num1 * multiplier - num2 * multiplier) / multiplier;
        }
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        result = num1 / num2;
        break;
      default:
        return num2;
    }

    return parseFloat(result.toFixed(14));
  }

  clear() {
    this.display = '0';
    this.currentValue = '';
    this.operator = null;
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
  }
}


