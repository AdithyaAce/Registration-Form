// ─── Utility ───────────────────────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

// ─── Validation Rules ───────────────────────────────────────────────────────

const rules = {
    name: {
        validate: v => v.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(v.trim()),
        message: '⚠️ Name must be at least 3 characters (letters only).'
    },
    email: {
        validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        message: '⚠️ Please enter a valid email address.'
    },
    pass: {
        validate: v => v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v),
        message: '⚠️ Password must be 8+ chars, include a number and uppercase letter.'
    },
    cpass: {
        validate: (v) => v === $('pass').value,
        message: '⚠️ Passwords do not match.'
    }
};

// ─── Show / Hide Error ──────────────────────────────────────────────────────

function showError(msg) {
    const el = $('error_message');
    el.textContent = msg;
    el.style.animation = 'none';
    requestAnimationFrame(() => {
        el.style.animation = 'shake 0.4s ease';
    });
}

function clearError() {
    $('error_message').textContent = '';
}

// ─── Field State Helpers ────────────────────────────────────────────────────

function setFieldState(input, state) {
    // Remove existing state classes
    input.classList.remove('field-valid', 'field-invalid');

    const wrapper = input.closest('.input_field');
    wrapper.querySelector('.field-icon')?.remove();

    if (state === 'valid') {
        input.classList.add('field-valid');
        appendIcon(wrapper, '✔', 'field-icon icon-valid');
    } else if (state === 'invalid') {
        input.classList.add('field-invalid');
        appendIcon(wrapper, '✖', 'field-icon icon-invalid');
    } else {
        // neutral — remove classes
    }
}

function appendIcon(wrapper, symbol, className) {
    const icon = document.createElement('span');
    icon.className = className;
    icon.textContent = symbol;
    wrapper.appendChild(icon);
}

// ─── Password Strength ──────────────────────────────────────────────────────

function getStrength(pass) {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0–5
}

function updateStrengthBar(pass) {
    const bar = document.querySelector('.strength-fill');
    const label = document.querySelector('.strength-label');
    if (!bar || !label) return;

    const score = getStrength(pass);
    const levels = [
        { label: '', color: 'transparent', width: '0%' },
        { label: 'Weak', color: '#ff6b6b', width: '20%' },
        { label: 'Fair', color: '#feca57', width: '50%' },
        { label: 'Good', color: '#48dbfb', width: '75%' },
        { label: 'Strong', color: '#1dd1a1', width: '90%' },
        { label: 'Perfect', color: '#00d2d3', width: '100%' },
    ];
    const lvl = levels[score] || levels[0];
    bar.style.width = pass.length === 0 ? '0%' : lvl.width;
    bar.style.background = lvl.color;
    bar.style.boxShadow = pass.length ? `0 0 10px ${lvl.color}88` : 'none';
    label.textContent = pass.length ? lvl.label : '';
    label.style.color = lvl.color;
}

// ─── Toggle Password Visibility ─────────────────────────────────────────────

function addToggle(inputId) {
    const input = $(inputId);
    const wrapper = input.closest('.input_field');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toggle-pass';
    btn.setAttribute('aria-label', 'Toggle password visibility');
    btn.innerHTML = eyeIcon(false);

    btn.addEventListener('click', () => {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.innerHTML = eyeIcon(isHidden);
    });

    wrapper.appendChild(btn);
}

function eyeIcon(visible) {
    return visible
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

// ─── Inject Strength Bar ─────────────────────────────────────────────────────

function injectStrengthBar() {
    const passWrapper = $('pass').closest('.input_field');
    const bar = document.createElement('div');
    bar.className = 'strength-bar';
    bar.innerHTML = `
    <div class="strength-track">
      <div class="strength-fill"></div>
    </div>
    <span class="strength-label"></span>
  `;
    passWrapper.insertAdjacentElement('afterend', bar);
}

// ─── Inject Styles ───────────────────────────────────────────────────────────

function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
    /* Field validation states */
    .input_field input.field-valid {
      border-color: #1dd1a1 !important;
      box-shadow: 0 0 0 4px rgba(29, 209, 161, 0.15), 0 4px 20px rgba(29, 209, 161, 0.1) !important;
    }
    .input_field input.field-invalid {
      border-color: #ff6b6b !important;
      box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.15), 0 4px 20px rgba(255, 107, 107, 0.1) !important;
    }

    /* Validation icons */
    .field-icon {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.85rem;
      font-weight: 700;
      pointer-events: none;
      animation: iconPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .icon-valid   { color: #1dd1a1; }
    .icon-invalid { color: #ff6b6b; }

    @keyframes iconPop {
      from { transform: translateY(-50%) scale(0); opacity: 0; }
      to   { transform: translateY(-50%) scale(1); opacity: 1; }
    }

    /* Password toggle button */
    .toggle-pass {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      padding: 4px;
      display: flex;
      align-items: center;
      transition: color 0.2s;
      z-index: 2;
    }
    .toggle-pass:hover { color: rgba(255,255,255,0.9); }
    .toggle-pass svg   { width: 18px; height: 18px; }

    /* Password inputs with toggle — extra right padding */
    #pass, #cpass { padding-right: 46px; }

    /* Strength bar */
    .strength-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: -8px;
      margin-bottom: 16px;
      padding: 0 2px;
    }
    .strength-track {
      flex: 1;
      height: 5px;
      background: rgba(255,255,255,0.12);
      border-radius: 99px;
      overflow: hidden;
    }
    .strength-fill {
      height: 100%;
      width: 0%;
      border-radius: 99px;
      transition: width 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
    }
    .strength-label {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      min-width: 46px;
      text-align: right;
      transition: color 0.4s;
      font-family: 'Nunito', sans-serif;
    }

    /* Shake animation for error */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }

    /* Submit loading state */
    input[type="submit"].loading {
      pointer-events: none;
      opacity: 0.8;
      letter-spacing: 0.15em;
    }

    /* Success pulse */
    @keyframes successPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(29, 209, 161, 0.4); }
      50%       { box-shadow: 0 0 0 12px rgba(29, 209, 161, 0); }
    }
    #success.suc.show {
      display: block;
      animation: successPulse 1.5s ease 2;
    }

    /* Confetti particle */
    .confetti {
      position: fixed;
      width: 10px; height: 10px;
      border-radius: 2px;
      pointer-events: none;
      animation: confettiFall linear forwards;
      z-index: 9999;
    }
    @keyframes confettiFall {
      0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
  `;
    document.head.appendChild(style);
}

// ─── Confetti ────────────────────────────────────────────────────────────────

function launchConfetti() {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#f093fb', '#1dd1a1', '#667eea', '#ff9ff3'];
    for (let i = 0; i < 60; i++) {
        const el = document.createElement('div');
        el.className = 'confetti';
        el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    }
}

// ─── Main Validation Function ────────────────────────────────────────────────

function val() {
    clearError();

    const fields = ['name', 'email', 'pass', 'cpass'];
    for (const id of fields) {
        const input = $(id);
        const value = input.value;
        const rule = rules[id];

        if (!value.trim()) {
            showError(`⚠️ Please fill in the ${id === 'cpass' ? 'Confirm Password' : id.charAt(0).toUpperCase() + id.slice(1)} field.`);
            setFieldState(input, 'invalid');
            input.focus();
            return false;
        }

        if (!rule.validate(value)) {
            showError(rule.message);
            setFieldState(input, 'invalid');
            input.focus();
            return false;
        }
    }

    // All good — show success
    const btn = document.querySelector('input[type="submit"]');
    btn.value = 'Submitting...';
    btn.classList.add('loading');

    setTimeout(() => {
        $('myform').style.display = 'none';
        $('hid').style.display = 'none';
        clearError();

        const suc = $('success');
        suc.classList.add('show');
        suc.innerHTML = `<h2>🎉 Welcome aboard!<br><small style="font-size:0.75rem;opacity:0.8;">Your registration was successful.</small></h2>`;

        launchConfetti();
    }, 900);

    return false;
}

// ─── Live Validation (on blur + input) ──────────────────────────────────────

function attachLiveValidation() {
    const fields = ['name', 'email', 'pass', 'cpass'];

    fields.forEach(id => {
        const input = $(id);

        // Validate on blur
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                setFieldState(input, 'neutral');
                return;
            }
            const valid = rules[id].validate(input.value);
            setFieldState(input, valid ? 'valid' : 'invalid');
        });

        // Clear state on focus
        input.addEventListener('focus', () => {
            setFieldState(input, 'neutral');
            clearError();
        });
    });

    // Live password strength
    $('pass').addEventListener('input', () => {
        updateStrengthBar($('pass').value);
    });

    // Live confirm password check
    $('cpass').addEventListener('input', () => {
        if ($('cpass').value && $('pass').value) {
            const match = $('cpass').value === $('pass').value;
            setFieldState($('cpass'), match ? 'valid' : 'invalid');
        }
    });
}

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    injectDynamicStyles();
    injectStrengthBar();
    addToggle('pass');
    addToggle('cpass');
    attachLiveValidation();
});