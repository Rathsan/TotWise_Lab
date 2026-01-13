/**
 * TotWise Lab — Weekly Reassurance Nudges
 * Lightweight, non-intrusive reassurance system
 * Shows once on Day 7, Day 15, and Day 30
 */

(function() {
    'use strict';

    // Inject CSS styles if not already present
    if (!document.getElementById('reassurance-nudges-styles')) {
        const style = document.createElement('style');
        style.id = 'reassurance-nudges-styles';
        style.textContent = `
            .reassurance-nudge-overlay {
                position: fixed;
                inset: 0;
                background: rgba(45, 59, 58, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
                z-index: 250;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .reassurance-nudge-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            .reassurance-nudge-modal {
                background: #FFFFFF;
                padding: 2rem;
                border-radius: 24px;
                text-align: center;
                max-width: 360px;
                width: 100%;
                transform: scale(0.95);
                transition: transform 0.3s ease;
                box-shadow: 0 20px 60px rgba(45, 59, 58, 0.15);
            }

            .reassurance-nudge-overlay.show .reassurance-nudge-modal {
                transform: scale(1);
            }

            .reassurance-nudge-title {
                font-family: 'Nunito', sans-serif;
                font-size: 1.4rem;
                font-weight: 700;
                color: #2D3B3A;
                margin-bottom: 1.5rem;
                line-height: 1.4;
            }

            .reassurance-nudge-body {
                text-align: left;
                margin-bottom: 2rem;
            }

            .reassurance-nudge-body p {
                font-family: 'DM Sans', sans-serif;
                font-size: 1rem;
                line-height: 1.7;
                color: #4A5857;
                margin-bottom: 1rem;
            }

            .reassurance-nudge-body p:last-child {
                margin-bottom: 0;
            }

            .reassurance-nudge-close {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.75rem 2rem;
                background: #A8C5A0;
                color: #FFFFFF;
                border: none;
                border-radius: 9999px;
                font-family: 'Nunito', sans-serif;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(168, 197, 160, 0.3);
            }

            .reassurance-nudge-close:hover {
                background: #7BA876;
                transform: translateY(-2px);
                box-shadow: 0 6px 24px rgba(168, 197, 160, 0.4);
            }

            .reassurance-nudge-close:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    // Nudge configuration
    const NUDGE_CONFIG = {
        7: {
            flag: 'week1NudgeShown',
            title: 'You didn't need to do it perfectly',
            body: 'This week wasn't about finishing activities.\nIt was about showing up calmly.\nIf your child watched, tried, or just stayed near you — that counted.\nYou're on the right track.'
        },
        15: {
            flag: 'week2NudgeShown',
            title: 'Learning is happening quietly',
            body: 'Repeating simple moments builds strong foundations.\nThere's nothing you need to add or fix.\nKeep going gently.'
        },
        30: {
            flag: 'week4NudgeShown',
            title: 'You already know how to continue',
            body: 'The last few weeks weren't about activities.\nThey were about confidence.\nThat stays with you.'
        }
    };

    /**
     * Check if nudge should be shown for a given day
     */
    function shouldShowNudge(day) {
        const config = NUDGE_CONFIG[day];
        if (!config) return false;

        const flag = localStorage.getItem(`totwise.nudges.${config.flag}`);
        return flag !== 'true';
    }

    /**
     * Mark nudge as shown
     */
    function markNudgeShown(day) {
        const config = NUDGE_CONFIG[day];
        if (!config) return;

        localStorage.setItem(`totwise.nudges.${config.flag}`, 'true');
    }

    /**
     * Create and show nudge modal
     */
    function showNudge(day, onClose) {
        const config = NUDGE_CONFIG[day];
        if (!config) return;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'reassurance-nudge-overlay';
        overlay.id = 'reassuranceNudgeOverlay';

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'reassurance-nudge-modal';

        // Title
        const title = document.createElement('h2');
        title.className = 'reassurance-nudge-title';
        title.textContent = config.title;

        // Body (split by newlines)
        const body = document.createElement('div');
        body.className = 'reassurance-nudge-body';
        const bodyLines = config.body.split('\n');
        bodyLines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line;
            body.appendChild(p);
        });

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'reassurance-nudge-close';
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', function() {
            overlay.classList.remove('show');
            markNudgeShown(day);
            setTimeout(() => {
                overlay.remove();
                if (onClose) onClose();
            }, 300);
        });

        // Assemble modal
        modal.appendChild(title);
        modal.appendChild(body);
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);

        // Add to body
        document.body.appendChild(overlay);

        // Show with animation
        setTimeout(() => {
            overlay.classList.add('show');
        }, 50);

        // Allow clicking outside to close
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeBtn.click();
            }
        });
    }

    /**
     * Initialize nudge system for a given day
     * Call this after completion is saved but before redirect
     */
    window.TotWiseNudges = {
        /**
         * Check and show nudge if needed
         * @param {number} day - Current day number
         * @param {function} onClose - Callback when nudge is dismissed (e.g., redirect)
         */
        checkAndShow: function(day, onClose) {
            if (shouldShowNudge(day)) {
                showNudge(day, onClose);
            } else {
                if (onClose) onClose();
            }
        }
    };
})();
