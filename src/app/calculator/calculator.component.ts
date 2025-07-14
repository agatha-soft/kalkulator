import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
  standalone: false
})
export class CalculatorComponent {
  inputs: string[] = ['0'];
  oldInputs: string[][] = [];
  lastTypedChar: string = '';
  @Output()
  changeMode = new EventEmitter<'light' | 'dark'>();
  private numberFormatter!: Intl.NumberFormat;
  private lastTypedCommand: 'digit' | 'point' | 'operator' | 'equal' | 'clear' | '' | 'other' = '';
  constructor() { }

  ngOnInit(): void {
    this.numberFormatter = new Intl.NumberFormat(navigator.language);
  }

  get formattedDisplay(): string {
    const lastInput = this.inputs[this.inputs.length - 1];
    const numValue = parseFloat(lastInput);

    // Handle cases where display might be an operator or an empty string
    if (isNaN(numValue)) {
      return lastInput;
    }

    let formatted = this.numberFormatter.format(numValue);
    let digitsOnly = formatted.replace(/[^0-9]/g, '');

    // If the number of digits exceeds 12, adjust the number itself
    if (digitsOnly.length > 12) {
      // Limit the number to 12 significant digits
      const preciseNum = numValue.toPrecision(12);
      formatted = this.numberFormatter.format(parseFloat(preciseNum));
      digitsOnly = formatted.replace(/[^0-9]/g, '');

      // If after toPrecision and re-formatting, the string is still too long
      // (e.g., due to scientific notation or locale-specific formatting that adds characters),
      // then truncate the string itself.
      if (digitsOnly.length > 12) {
        // Fallback to scientific notation if it fits within a reasonable length
        if (numValue.toExponential().length <= 12) {
          formatted = numValue.toExponential();
        } else {
          // As a last resort, just truncate the string representation
          formatted = formatted.substring(0, 12);
        }
      }
    }
    return formatted;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    let valueToProcess: string = '';

    if (key === 'l') {
      this.lastTypedCommand = 'other';
      this.changeMode.emit('light');
      return;
    }
    if (key === 'd') {
      this.lastTypedCommand = 'other';
      this.changeMode.emit('dark');
      return;
    }

    if (/[0-9]/.test(key) && !Number.isNaN(parseInt(key))) {
      if (this.lastTypedCommand === 'equal') {
        this.handleButtonClick('AC'); // Reset if last command was equal
      }
      this.lastTypedCommand = 'digit';
      valueToProcess = key;
    } else if (key === '.') {
      this.lastTypedCommand = 'point';
      valueToProcess = '.';
    } else if (['+', '-', '*', '/'].includes(key)) {
      this.lastTypedCommand = 'operator';
      valueToProcess = key;
    } else if (key === 'Enter') {
      this.lastTypedCommand = 'equal';
      valueToProcess = '=';
    } else if (key === 'Escape' || key === 'c' || key === 'C' || key === 'space' || key === 'a' || key === 'A') {
      this.lastTypedCommand = 'clear';
      valueToProcess = 'AC';
    } else if (key === 'Backspace') {
      this.lastTypedCommand = 'other';
      // Handle backspace directly
      if (this.inputs.length > 0) {
        let lastInput = this.inputs[this.inputs.length - 1];
        if (lastInput.length > 1) {
          this.inputs[this.inputs.length - 1] = lastInput.slice(0, -1);
        } else {
          this.inputs.pop();
          if (this.inputs.length === 0) {
            this.inputs = ['0'];
          }
        }
      }
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

    const lastInput = this.inputs[this.inputs.length - 1];
    const isLastInputOperator = this.isOperator(lastInput);

    if (value === 'AC') {
      if (this.inputs.length > 0 && !(this.inputs.length === 1 && this.inputs[0] === '0')) {
        this.oldInputs.push([...this.inputs]); // Archive current inputs
      }
      this.inputs = ['0'];
      return;
    }

    if (value === '=') {
      if (this.inputs.length === 0 || isLastInputOperator) {
        return; // Cannot calculate if no input or ends with operator
      }
      this.oldInputs.push([...this.inputs]); // Archive before calculation
      const result = this.evaluateExpression(this.inputs);
      this.inputs = [result.toString()];
      return;
    }

    if (this.isDigit(value) || value === '.') {
      if (isLastInputOperator || (this.inputs.length === 1 && lastInput === '0' && value !== '.')) {
        // Start a new number
        if (value === '.' && (this.inputs.length === 0 || isLastInputOperator)) {
          this.inputs.push('0.');
        } else if (this.inputs.length === 1 && lastInput === '0' && value !== '.') {
          this.inputs[this.inputs.length - 1] = value;
        } else {
          this.inputs.push(value);
        }
      } else {
        // Append to current number
        if (value === '.' && lastInput.includes('.')) {
          return; // Prevent multiple decimals
        }
        // Limit digit input to 12 (excluding decimal point for count)
        const currentNumberDigits = lastInput.replace(/[^0-9]/g, '').length;
        if (currentNumberDigits >= 12) {
          return;
        }
        this.inputs[this.inputs.length - 1] += value;
      }
    } else if (this.isOperator(value)) {
      if (this.inputs.length === 0) {
        return; // Cannot start with an operator
      }
      if (isLastInputOperator) {
        // Replace last operator
        this.inputs[this.inputs.length - 1] = value;
      } else {
        // Add new operator
        this.inputs.push(value);
      }
    }
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private isOperator(char: string): boolean {
    return ['+', '-', '*', '/'].includes(char);
  }

  private evaluateExpression(expression: string[]): number {
    // Simple left-to-right evaluation
    if (expression.length === 0) return 0;
    if (expression.length === 1) return parseFloat(expression[0]);

    let result = parseFloat(expression[0]);
    for (let i = 1; i < expression.length; i += 2) {
      const operator = expression[i];
      const nextOperand = parseFloat(expression[i + 1]);

      switch (operator) {
        case '+':
          result = this.calculate(result, nextOperand, '+');
          break;
        case '-':
          result = this.calculate(result, nextOperand, '-');
          break;
        case '*':
          result = this.calculate(result, nextOperand, '*');
          break;
        case '/':
          result = this.calculate(result, nextOperand, '/');
          break;
      }
    }
    return result;
  }

  private calculate(num1: number, num2: number, operator: string): number {
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

    return result;
  }
}



