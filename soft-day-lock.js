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

            .soft-lock-button-secondary {
                display: inline-block;
                margin-top: 0.75rem;
                margin-left: 0.5rem;
                padding: 0.75rem 2rem;
                font-family: 'Nunito', sans-serif;
                font-size: 1rem;
                font-weight: 600;
                color: #2D3B3A;
                background: transparent;
                border: 2px solid #A8C5A0;
                border-radius: 9999px;
                text-decoration: none;
                transition: all 0.2s ease;
            }

            .soft-lock-button-secondary:hover {
                background: #F5F9F4;
                border-color: #7BA876;
            }

            .soft-lock-buttons {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                align-items: center;
                margin-top: 1rem;
            }

            @media (min-width: 480px) {
                .soft-lock-buttons {
                    flex-direction: row;
                    justify-content: center;
                }
            }

            /* Toast notification styles */
            .soft-lock-toast {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                max-width: 90%;
                width: 100%;
                max-width: 400px;
                padding: 1rem 1.25rem;
                background: #FFFFFF;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(45, 59, 58, 0.15);
                z-index: 10000;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }

            .soft-lock-toast.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
                pointer-events: auto;
            }

            .soft-lock-toast-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .soft-lock-toast-icon {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                color: #A8C5A0;
            }

            .soft-lock-toast-message {
                font-family: 'DM Sans', sans-serif;
                font-size: 0.95rem;
                color: #2D3B3A;
                line-height: 1.5;
            }

            /* Brand navigation styles */
            .brand {
                transition: opacity 0.2s ease;
            }

            .brand:hover {
                opacity: 0.7;
            }

            .brand:active {
                opacity: 0.5;
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
     * Show toast notification
     */
    function showToast(message) {
        console.log('[TotWiseSoftLock] Showing toast:', message);
        
        // Remove existing toast if any
        const existingToast = document.getElementById('soft-lock-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast
        const toast = document.createElement('div');
        toast.id = 'soft-lock-toast';
        toast.className = 'soft-lock-toast';
        toast.innerHTML = `
            <div class="soft-lock-toast-content">
                <svg class="soft-lock-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                </svg>
                <div class="soft-lock-toast-message">${message}</div>
            </div>
        `;
        document.body.appendChild(toast);
        console.log('[TotWiseSoftLock] Toast element created and added to DOM');

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
            console.log('[TotWiseSoftLock] Toast animation triggered');
        }, 10);

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
    }

    /**
     * Show soft lock notice on member day page
     * Disables all interactions and prevents progress updates
     */
    function showSoftLockNotice(currentDay) {
        console.log('[TotWiseSoftLock] showSoftLockNotice called for day:', currentDay);
        const currentUnlockedDay = getCurrentUnlockedDay();
        
        // Keep button visible but disabled - let click handlers show toast
        const completeBtn = document.getElementById('completeBtn');
        if (completeBtn) {
            console.log('[TotWiseSoftLock] Found completeBtn, styling it');
            // Don't hide - keep visible so users can click and see toast
            completeBtn.style.opacity = '0.6';
            completeBtn.style.cursor = 'not-allowed';
            completeBtn.style.pointerEvents = 'auto'; // Keep clickable for toast
        } else {
            console.warn('[TotWiseSoftLock] completeBtn not found!');
        }

        // Disable completion overlay interactions
        const completionOverlay = document.getElementById('completionOverlay');
        if (completionOverlay) {
            completionOverlay.style.pointerEvents = 'none';
        }

        // Prevent handleCompletion from being called
        // We'll override it if it exists
        if (window.handleCompletion) {
            const originalHandleCompletion = window.handleCompletion;
            window.handleCompletion = function() {
                // Check if still locked before allowing
                if (isDayLocked(currentDay)) {
                    const currentUnlockedDay = getCurrentUnlockedDay();
                    showToast(`You can mark this complete when it becomes today. Right now, Day ${currentUnlockedDay} is ready.`);
                    return false;
                }
                // If unlocked, call original
                return originalHandleCompletion.apply(this, arguments);
            };
        }

        // Create soft lock notice
        const notice = document.createElement('div');
        notice.className = 'soft-lock-notice';
        
        // Get the correct paths for navigation buttons
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;
        let backToTodayPath = '/Dashboard/dashboard.html';
        let dashboardPath = '/Dashboard/dashboard.html';
        
        if (protocol === 'http:' || protocol === 'https:') {
            const basePath = pathname.split('/member_Day')[0];
            backToTodayPath = `${basePath}/member_Day${currentUnlockedDay}/member-day${currentUnlockedDay}.html`;
            dashboardPath = `${basePath}/Dashboard/dashboard.html`;
        } else {
            backToTodayPath = `../member_Day${currentUnlockedDay}/member-day${currentUnlockedDay}.html`;
            dashboardPath = '../Dashboard/dashboard.html';
        }
        
        notice.innerHTML = `
            <div class="soft-lock-content">
                <h3 class="soft-lock-title">This will be ready tomorrow</h3>
                <p class="soft-lock-text">Today is about one calm moment.</p>
                <p class="soft-lock-text">You don't need to rush ahead.</p>
                <div class="soft-lock-buttons">
                    <a href="${backToTodayPath}" class="soft-lock-button">Back to Today</a>
                    <a href="${dashboardPath}" class="soft-lock-button-secondary">Back to Dashboard</a>
                </div>
            </div>
        `;

        // Insert after completion section or before it if section not found
        const completionSection = document.querySelector('.completion-section');
        console.log('[TotWiseSoftLock] completionSection found:', !!completionSection);
        
        if (completionSection) {
            // Insert after the button, inside the completion section
            completionSection.appendChild(notice);
            console.log('[TotWiseSoftLock] Notice appended to completionSection');
        } else {
            // Fallback: insert after completion button or at end of main content
            const completeBtn = document.getElementById('completeBtn');
            if (completeBtn && completeBtn.parentNode) {
                // Insert after the button
                if (completeBtn.nextSibling) {
                    completeBtn.parentNode.insertBefore(notice, completeBtn.nextSibling);
                } else {
                    completeBtn.parentNode.appendChild(notice);
                }
                console.log('[TotWiseSoftLock] Notice inserted after completeBtn');
            } else {
                const mainContent = document.querySelector('main.content') || document.querySelector('main') || document.body;
                if (mainContent) {
                    mainContent.appendChild(notice);
                    console.log('[TotWiseSoftLock] Notice appended to mainContent');
                }
            }
        }
        
        // Ensure notice is visible
        notice.style.display = 'block';
        notice.style.visibility = 'visible';
        console.log('[TotWiseSoftLock] Notice should be visible now');

        // Optionally add a subtle overlay to dim the page slightly
        const existingOverlay = document.getElementById('soft-lock-overlay');
        if (!existingOverlay) {
            const overlay = document.createElement('div');
            overlay.id = 'soft-lock-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.3);
                pointer-events: none;
                z-index: 100;
            `;
            document.body.appendChild(overlay);
        }
    }

    /**
     * Prevent completion for locked days
     * This function should be called before any completion handlers are set up
     */
    function preventCompletionForLockedDay(dayNum) {
        if (!isDayLocked(dayNum)) return false;

        // Prevent completion button clicks
        const completeBtn = document.getElementById('completeBtn');
        if (completeBtn) {
            // Keep button visible but show toast when clicked
            // Don't disable it completely - let the click handler show feedback
            
            // Add a click handler to show informative toast
            completeBtn.addEventListener('click', function(e) {
                // Check if day is still locked
                if (isDayLocked(dayNum)) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    // Show informative toast
                    const currentUnlockedDay = getCurrentUnlockedDay();
                    showToast(`You can mark this complete when it becomes today. Right now, Day ${currentUnlockedDay} is ready.`);
                    
                    return false;
                }
            }, true); // Use capture phase to intercept early
        }

        // Prevent handleCompletion from executing
        // Wrap it if it exists
        const originalHandleCompletion = window.handleCompletion;
        if (typeof originalHandleCompletion === 'function') {
            window.handleCompletion = function() {
                // Check if day is still locked before allowing completion
                if (isDayLocked(dayNum)) {
                    const currentUnlockedDay = getCurrentUnlockedDay();
                    showToast(`You can mark this complete when it becomes today. Right now, Day ${currentUnlockedDay} is ready.`);
                    return false;
                }
                // If day became unlocked, call original
                return originalHandleCompletion.apply(this, arguments);
            };
        }

        return true;
    }

    /**
     * Make brand logo clickable to navigate to dashboard
     */
    function setupBrandNavigation() {
        const brandElement = document.querySelector('.brand');
        if (brandElement && !brandElement.dataset.navigationSetup) {
            brandElement.style.cursor = 'pointer';
            brandElement.addEventListener('click', function() {
                const protocol = window.location.protocol;
                const pathname = window.location.pathname;
                let dashboardPath = '/Dashboard/dashboard.html';
                
                if (protocol === 'http:' || protocol === 'https:') {
                    const basePath = pathname.split('/member_Day')[0];
                    dashboardPath = `${basePath}/Dashboard/dashboard.html`;
                } else {
                    dashboardPath = '../Dashboard/dashboard.html';
                }
                
                window.location.href = dashboardPath;
            });
            brandElement.dataset.navigationSetup = 'true';
        }
    }

    // Setup brand navigation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupBrandNavigation);
    } else {
        setupBrandNavigation();
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
            console.log('[TotWiseSoftLock] Checking day:', dayNum);
            const currentUnlockedDay = getCurrentUnlockedDay();
            console.log('[TotWiseSoftLock] Current unlocked day:', currentUnlockedDay);
            
            if (isDayLocked(dayNum)) {
                console.log('[TotWiseSoftLock] Day is locked, applying soft lock');
                // Prevent all completion logic first
                preventCompletionForLockedDay(dayNum);
                // Then show the soft lock notice (with a small delay to ensure DOM is ready)
                setTimeout(() => {
                    console.log('[TotWiseSoftLock] Showing soft lock notice');
                    showSoftLockNotice(dayNum);
                }, 100);
                return true; // Day is locked
            }
            console.log('[TotWiseSoftLock] Day is not locked');
            return false; // Day is not locked
        },
        
        /**
         * Get current unlocked day (exposed for use in day pages)
         */
        getCurrentUnlockedDay: getCurrentUnlockedDay,
        
        /**
         * Check if a day is locked (exposed for use in day pages)
         */
        isDayLocked: isDayLocked,
        
        /**
         * Show toast notification (exposed for use in day pages)
         */
        showToast: showToast
    };
})();
