// Simple calculator logic with basic sanitization and keyboard support
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');

function append(value) {
  if (display.value === 'Error') display.value = '';
  display.value += value;
}

function clearDisplay() {
  display.value = '';
}

function backspace() {
  if (display.value === 'Error') { display.value = ''; return; }
  display.value = display.value.slice(0, -1);
}

function sanitizeExpression(expr) {
  // allow digits, whitespace, parentheses, decimal point and basic operators
  const allowed = /^[0-9+\-*/().\s%]+$/;
  return allowed.test(expr);
}

function calculate() {
  let expr = display.value.trim();
  if (!expr) return;
  // Replace any full-width or alternate symbols if present (defensive)
  expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  // Quick sanitization — prevents letters and other characters from being evaluated
  if (!sanitizeExpression(expr)) {
    display.value = 'Error';
    return;
  }

  try {
    // Use Function constructor in strict mode for evaluation
    // Note: This is still executing dynamic code — keep input sanitization above.
    // Avoid allowing names (letters) so it's reasonably safe for this simple calculator.
    const result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result === 'number' && isFinite(result)) {
      // Trim trailing .0 for integers and limit floating precision
      display.value = String(Math.round((result + Number.EPSILON) * 1e12) / 1e12);
    } else {
      display.value = 'Error';
    }
  } catch (e) {
    display.value = 'Error';
  }
}

// Button click handling
buttons.forEach(btn => {
  const action = btn.dataset.action;
  const text = btn.textContent.trim();

  btn.addEventListener('click', () => {
    if (action === 'digit') append(text);
    else if (action === 'operator') append(text);
    else if (action === 'decimal') append('.');
    else if (action === 'equals') calculate();
    else if (action === 'clear') clearDisplay();
    else if (action === 'backspace') backspace();
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  // allow: digits, operators, parentheses, decimal point, Enter, Backspace, Delete
  if ((e.key >= '0' && e.key <= '9') || ['+','-','*','/','(',')','.','%'].includes(e.key)) {
    append(e.key);
    e.preventDefault();
  } else if (e.key === 'Enter' || e.key === '=') {
    calculate();
    e.preventDefault();
  } else if (e.key === 'Backspace') {
    backspace();
    e.preventDefault();
  } else if (e.key === 'Delete' || e.key.toLowerCase() === 'c') {
    clearDisplay();
    e.preventDefault();
  }
});
