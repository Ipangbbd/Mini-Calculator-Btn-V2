// const or dom whatever Elements
const calcBtn = document.getElementById('calcBtn');
const calc = document.getElementById('calc');
const closeX = document.getElementById('closeX');
const modeBtn = document.getElementById('modeBtn');
const formulaBtn = document.getElementById('formulaBtn');
const result = document.getElementById('result');
const history = document.getElementById('history');
const scientificPanel = document.getElementById('scientificPanel');
const formulaPanel = document.getElementById('formulaPanel');

// State variables
let currentVal = '0';
let prevVal = '';
let op = null;
let reset = false;
let lastOperation = '';

// Toggle calculator
calcBtn.addEventListener('click', function () {
    calc.classList.toggle('visible');
    calcBtn.innerHTML = calc.classList.contains('visible')
        ? '<i class="fas fa-times"></i><span>Close</span>'
        : '<i class="fas fa-calculator"></i><span>Calculator</span>';
});

// Close calculator
closeX.addEventListener('click', function () {
    calc.classList.remove('visible');
    calcBtn.innerHTML = '<i class="fas fa-calculator"></i><span>Calculator</span>';
});

// Toggle scientific mode
modeBtn.addEventListener('click', function () {
    scientificPanel.classList.toggle('visible');
});

// Toggle formula panel
formulaBtn.addEventListener('click', function () {
    calc.classList.toggle('expanded');
    formulaPanel.classList.toggle('visible');
    formulaBtn.innerHTML = formulaPanel.classList.contains('visible')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-book"></i>';
});

// Add number
function addNum(num) {
    if (reset) {
        currentVal = num;
        reset = false;
    } else {
        if (num === '.' && currentVal.includes('.')) return;

        if (currentVal === '0' && num !== '.') {
            currentVal = num;
        } else {
            currentVal += num;
        }
    }
    updateDisplay();
}

// Add operator
function addOp(operator) {
    if (op !== null && !reset) {
        calculate();
    }

    prevVal = currentVal;
    op = operator;
    reset = true;

    // Update history display
    lastOperation = `${prevVal} ${op}`;
    history.textContent = lastOperation;
}

// Calculate result
function calculate() {
    if (op === null || reset) return;

    let num1 = parseFloat(prevVal);
    let num2 = parseFloat(currentVal);
    let answer;

    // Division by zero check
    if (op === '/' && num2 === 0) {
        showError("Can't divide by zero!");
        return;
    }

    // Do the math
    switch (op) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
        case '/':
            answer = num1 / num2;
            break;
        case '%':
            answer = num1 % num2;
            break;
    }

    // Update history
    lastOperation = `${prevVal} ${op} ${currentVal} =`;
    history.textContent = lastOperation;

    // Floating point precision
    if (answer !== undefined) {
        answer = Math.round(answer * 1000000) / 1000000;
        currentVal = answer.toString();
    }

    op = null;
    prevVal = '';
    reset = true;
    updateDisplay();
}

// Scientific operations
function scientificOp(operation) {
    let num = parseFloat(currentVal);
    let answer;

    switch (operation) {
        case 'sin':
            answer = Math.sin(num * Math.PI / 180); // Convert to radians if needed
            break;
        case 'cos':
            answer = Math.cos(num * Math.PI / 180);
            break;
        case 'tan':
            answer = Math.tan(num * Math.PI / 180);
            break;
        case 'sqrt':
            if (num < 0) {
                showError("Invalid input for square root");
                return;
            }
            answer = Math.sqrt(num);
            break;
        case 'pow':
            prevVal = currentVal;
            op = '^';
            reset = true;
            history.textContent = `${prevVal} ${op}`;
            return;
        case 'log':
            if (num <= 0) {
                showError("Invalid input for logarithm");
                return;
            }
            answer = Math.log10(num);
            break;
        case 'ln':
            if (num <= 0) {
                showError("Invalid input for natural log");
                return;
            }
            answer = Math.log(num);
            break;
        case 'pi':
            answer = Math.PI;
            break;
        case 'e':
            answer = Math.E;
            break;
        case 'fact':
            if (num < 0 || !Number.isInteger(num)) {
                showError("Factorial requires positive integer");
                return;
            }
            answer = factorial(num);
            break;
        case 'inv':
            if (num === 0) {
                showError("Can't divide by zero");
                return;
            }
            answer = 1 / num;
            break;
        case 'abs':
            answer = Math.abs(num);
            break;
    }

    if (answer !== undefined) {
        // Update history for scientific operations
        lastOperation = `${operation}(${num}) =`;
        history.textContent = lastOperation;

        answer = Math.round(answer * 1000000) / 1000000;
        currentVal = answer.toString();
        updateDisplay();
    }
}

// Factorial helper function
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Apply formula
function applyFormula(name, expression) {
    // In a real implementation, you would parse the formula and handle variables
    // For this demo, we'll just show the expression h3h3 (pls im not tht good in math :'( )
    currentVal = expression;
    updateDisplay();

    // Show a tooltip or something to indicate the formula was applied
    showTooltip(`Applied ${name} formula`);
}

// Clear everything
function clearAll() {
    currentVal = '0';
    prevVal = '';
    op = null;
    lastOperation = '';
    history.textContent = '';
    updateDisplay();
}

// Backspace
function backspace() {
    if (currentVal.length === 1) {
        currentVal = '0';
    } else {
        currentVal = currentVal.slice(0, -1);
    }
    updateDisplay();
}

// Update display
function updateDisplay() {
    let displayVal = currentVal;

    // Format large numbers with commas if it's a pure number
    if (!displayVal.includes('.') && !isNaN(displayVal)) {
        displayVal = parseInt(displayVal).toLocaleString();
    }

    result.textContent = displayVal;
}

// Show error message
function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.position = 'fixed';
    error.style.bottom = '80px';
    error.style.left = '50%';
    error.style.transform = 'translateX(-50%)';
    error.style.backgroundColor = 'var(--danger)';
    error.style.color = 'white';
    error.style.padding = '8px 16px';
    error.style.borderRadius = '4px';
    error.style.zIndex = '1000';
    error.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(error);

    setTimeout(() => {
        error.style.opacity = '0';
        setTimeout(() => document.body.removeChild(error), 300);
    }, 3000);
}

// Show tooltip
function showTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    tooltip.style.position = 'fixed';
    tooltip.style.bottom = '80px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.backgroundColor = 'var(--primary)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 16px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.zIndex = '1000';
    tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(tooltip);

    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => document.body.removeChild(tooltip), 300);
    }, 2000);
}

// Handle keyboard input
document.addEventListener('keydown', function (e) {
    if (!calc.classList.contains('visible')) return;

    const key = e.key;

    // Numbers and decimal
    if (/^[0-9.]$/.test(key)) {
        addNum(key);
    }
    // Operators
    else if (['+', '-', '*', '/', '%', '^'].includes(key)) {
        addOp(key);
    }
    // Equals
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Clear
    else if (key === 'Escape') {
        clearAll();
    }
    // Backspace
    else if (key === 'Backspace') {
        backspace();
    }
    // Scientific functions
    else if (key === 's' && e.ctrlKey) {
        scientificPanel.classList.toggle('visible');
    }
});