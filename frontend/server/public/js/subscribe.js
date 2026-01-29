/* TotWise Lab subscription flow: email capture -> Razorpay checkout */
(function() {
    'use strict';

    const API_BASE = window.TOTWISE_API_BASE || '';
    const SUBSCRIBE_SELECTOR = '[data-subscribe="age_2_3"]';

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    }

    function promptForEmail() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'totwise-email-modal';
            overlay.innerHTML = `
                <div class="totwise-email-card" role="dialog" aria-modal="true" aria-labelledby="totwiseEmailTitle">
                    <h2 class="totwise-email-title" id="totwiseEmailTitle">Enter your email address</h2>
                    <p class="totwise-email-subtitle">We’ll send your secure login link here after payment is confirmed.</p>
                    <div class="totwise-email-field">
                        <label class="totwise-email-label" for="totwiseEmailInput">Email address</label>
                        <input class="totwise-email-input" id="totwiseEmailInput" type="email" placeholder="you@email.com" autocomplete="email" />
                        <p class="totwise-email-hint">Please type carefully. Copy is disabled for safety.</p>
                    </div>
                    <div class="totwise-email-field">
                        <label class="totwise-email-label" for="totwiseEmailConfirmInput">Confirm email address</label>
                        <input class="totwise-email-input" id="totwiseEmailConfirmInput" type="email" placeholder="you@email.com" autocomplete="email" />
                        <p class="totwise-email-hint">Paste is disabled. Please retype to confirm.</p>
                    </div>
                    <div class="totwise-email-error" id="totwiseEmailError"></div>
                    <div class="totwise-email-actions">
                        <button class="totwise-email-btn totwise-email-btn-secondary" data-action="cancel">Cancel</button>
                        <button class="totwise-email-btn totwise-email-btn-primary" data-action="continue">Continue</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const emailInput = overlay.querySelector('#totwiseEmailInput');
            const confirmInput = overlay.querySelector('#totwiseEmailConfirmInput');
            const errorEl = overlay.querySelector('#totwiseEmailError');

            function close(value) {
                overlay.remove();
                resolve(value || null);
            }

            function showError(message) {
                errorEl.textContent = message;
                errorEl.style.display = 'block';
            }

            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    close(null);
                }
            });

            overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                close(null);
            });

            overlay.querySelector('[data-action="continue"]').addEventListener('click', () => {
                const email = emailInput.value.trim();
                const confirm = confirmInput.value.trim();

                if (!email || !confirm) {
                    showError('Please enter and confirm your email address.');
                    return;
                }
                if (!isValidEmail(email)) {
                    showError('Please enter a valid email address.');
                    return;
                }
                if (email.toLowerCase() !== confirm.toLowerCase()) {
                    showError('Email addresses do not match. Please try again.');
                    return;
                }
                close(email);
            });

            emailInput.focus();

            emailInput.addEventListener('copy', (event) => event.preventDefault());
            emailInput.addEventListener('cut', (event) => event.preventDefault());
            confirmInput.addEventListener('paste', (event) => event.preventDefault());
        });
    }

    async function createOrder(email) {
        const response = await fetch(`${API_BASE}/api/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.error || 'Unable to start checkout.');
        }

        return response.json();
    }

    function openRazorpayCheckout(orderData) {
        if (typeof Razorpay === 'undefined') {
            alert('Payment service is unavailable. Please try again.');
            return;
        }

        const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.orderId,
            name: 'TotWise Lab',
            description: 'TotWise 2–3 Years Growth Toolkit',
            prefill: {
                email: orderData.email
            },
            notes: {
                email: orderData.email,
                plan: orderData.plan,
                amount: String(orderData.amount)
            },
            handler: function() {
                const successUrl = `/payment-success.html?email=${encodeURIComponent(orderData.email)}`;
                window.location.href = successUrl;
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    async function handleSubscribeClick(event) {
        event.preventDefault();
        const email = await promptForEmail();
        if (!email) return;

        try {
            const orderData = await createOrder(email);
            openRazorpayCheckout(orderData);
        } catch (error) {
            alert(error.message || 'Unable to start checkout.');
        }
    }

    function init() {
        const buttons = document.querySelectorAll(SUBSCRIBE_SELECTOR);
        if (!buttons.length) return;
        buttons.forEach((btn) => {
            btn.addEventListener('click', handleSubscribeClick);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
