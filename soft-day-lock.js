/**
 * TotWise Lab — Soft Day-Locking
 * Prevents completion of future days while allowing visibility
 * Gentle pacing without time-based locks
 */

(function() {
    'use strict';

    // Inject CSS styles if not already present
    if (!document.getElementById('soft-day-lock-styles')) {
        const style = document.createElement('style');
        style.id = 'soft-day-lock-styles';
        style.textContent = `
            .soft-lock-notice {
                width: 100%;
                max-width: 480px;
                margin: 0 auto;
                padding: 1.5rem;
                background: #FFFFFF;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(45, 59, 58, 0.08);
            }

            .soft-lock-content {
                text-align: center;
            }

            .soft-lock-title {
                font-family: 'Nunito', sans-serif;
                font-size: 1.3rem;
                font-weight: 700;
                color: #2D3B3A;
                margin-bottom: 1rem;
                line-height: 1.4;
            }

            .soft-lock-text {
                font-family: 'DM Sans', sans-serif;
                font-size: 1rem;
                color: #2D3B3A;
                margin-bottom: 0.375rem;
                line-height: 1.6;
            }

            .soft-lock-button {
                display: inline-block;
                margin-top: 1rem;
                padding: 0.75rem 2rem;
                font-family: 'Nunito', sans-serif;
                font-size: 1rem;
                font-weight: 700;
                color: #FFFFFF;
                background: #A8C5A0;
                border-radius: 9999px;
                text-decoration: none;
                transition: all 0.2s ease;
                box-shadow: 0 4px 20px rgba(168, 197, 160, 0.3);
            }

            .soft-lock-button:hover {
                background: #7BA876;
                transform: translateY(-1px);
                box-shadow: 0 6px 24px rgba(168, 197, 160, 0.4);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Get current unlocked day based on progress
     */
    function getCurrentUnlockedDay() {
        const completedDays = JSON.parse(localStorage.getItem('totwise.progress.completedDays') || '[]');
        const currentDay = completedDays.length > 0 ? Math.max(...completedDays) + 1 : 1;
        return Math.min(currentDay, 30); // Cap at 30
    }

    /**
     * Check if a day is locked (future day)
     */
    function isDayLocked(dayNum) {
        const currentUnlockedDay = getCurrentUnlockedDay();
        return dayNum > currentUnlockedDay;
    }

    /**
     * Show soft lock notice on member day page
     */
    function showSoftLockNotice(currentDay) {
        const completeBtn = document.getElementById('completeBtn');
        if (!completeBtn) return;

        // Hide the completion button
        completeBtn.style.display = 'none';

        // Create soft lock notice
        const notice = document.createElement('div');
        notice.className = 'soft-lock-notice';
        notice.innerHTML = `
            <div class="soft-lock-content">
                <h3 class="soft-lock-title">This will be ready tomorrow</h3>
                <p class="soft-lock-text">Today is about one calm moment.</p>
                <p class="soft-lock-text">You don't need to rush ahead.</p>
                <a href="/Dashboard/dashboard.html" class="soft-lock-button">Back to Today</a>
            </div>
        `;

        // Insert after completion section
        const completionSection = document.querySelector('.completion-section');
        if (completionSection) {
            completionSection.appendChild(notice);
        }
    }

    /**
     * Initialize soft day-locking for member day pages
     */
    window.TotWiseSoftLock = {
        /**
         * Check and apply soft lock if needed
         * @param {number} dayNum - Current day number being viewed
         */
        checkAndApply: function(dayNum) {
            if (isDayLocked(dayNum)) {
                showSoftLockNotice(dayNum);
            }
        }
    };
})();
