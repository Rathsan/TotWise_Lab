/**
 * TotWise Lab — Core Logic (Progress + Cooldown + Soft Lock)
 * Single source of truth for progress state and day eligibility.
 * Month-aware: handles Month 1–12 with separate localStorage keys per month.
 */
(function() {
    'use strict';

    // ── Month detection ────────────────────────────────────────────────────
    // Month 1 pages: /member_Day{n}/member-day{n}.html
    // Month 2+ pages: /member_Month{m}_Day{n}/member-day{n}.html
    function getCurrentPageMonth() {
        const path = window.location.pathname;
        const match = path.match(/\/member_Month(\d+)_Day/);
        if (match) return parseInt(match[1], 10);
        if (path.includes('/member_Day')) return 1;
        // Dashboard and other pages — use the user's active month from sessionStorage
        const stored = parseInt(sessionStorage.getItem('totwiseCurrentMonth') || '1', 10);
        return Number.isFinite(stored) && stored >= 1 ? stored : 1;
    }

    // ── localStorage key routing ───────────────────────────────────────────
    // Month 1 uses the original keys for backward compatibility with existing data.
    function storageKey(month, suffix) {
        if (month === 1) {
            const legacyMap = {
                completedDays:     'totwise.progress.completedDays',
                lastCompletedDate: 'totwise.progress.lastCompletedDate',
            };
            return legacyMap[suffix] || `totwise.m1.${suffix}`;
        }
        return `totwise.m${month}.${suffix}`;
    }

    const TOTAL_DAYS = 30;

    // ── Date helpers ───────────────────────────────────────────────────────
    function getTodayDateString() {
        const d = new Date();
        const year  = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day   = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getLastCompletedDate(month) {
        const m = month || getCurrentPageMonth();
        return localStorage.getItem(storageKey(m, 'lastCompletedDate'));
    }

    function getCompletedDays(month) {
        const m = month || getCurrentPageMonth();
        const raw = JSON.parse(localStorage.getItem(storageKey(m, 'completedDays')) || '[]');
        return raw
            .map((day) => Number(day))
            .filter((day) => Number.isFinite(day) && day > 0)
            .sort((a, b) => a - b);
    }

    // ── Progress state ─────────────────────────────────────────────────────
    function getProgressState(month) {
        const m = month || getCurrentPageMonth();
        const completedDays     = getCompletedDays(m);
        const lastCompletedDate = getLastCompletedDate(m);

        if (completedDays.length === 0) {
            return { currentUnlockedDay: 1, lastCompletedDate };
        }

        const maxCompleted     = Math.max(...completedDays);
        const canUnlock        = canUnlockNextDay(m);
        const currentUnlockedDay = Math.min(
            canUnlock ? maxCompleted + 1 : maxCompleted,
            TOTAL_DAYS
        );

        return { currentUnlockedDay, lastCompletedDate };
    }

    function canUnlockNextDay(month) {
        const m = month || getCurrentPageMonth();
        return getTodayDateString() !== getLastCompletedDate(m);
    }

    // ── Month-access check ─────────────────────────────────────────────────
    /**
     * Returns the number of months the user has unlocked.
     * Read from sessionStorage (populated by auth.js after session check).
     */
    function getMonthsUnlocked() {
        const stored = parseInt(sessionStorage.getItem('totwiseMonthsUnlocked') || '1', 10);
        return Number.isFinite(stored) && stored >= 1 ? stored : 1;
    }

    /**
     * Returns true if the user has unlocked the given month.
     */
    function isMonthAccessible(month) {
        return month <= getMonthsUnlocked();
    }

    // ── Day-lock check ─────────────────────────────────────────────────────
    /**
     * Returns true if the page day is ahead of the user's current progress
     * OR if the user hasn't unlocked this month yet.
     */
    function isFutureDay(pageDay, month) {
        const m = month || getCurrentPageMonth();
        if (!isMonthAccessible(m)) return true;
        const { currentUnlockedDay } = getProgressState(m);
        return pageDay > currentUnlockedDay;
    }

    // ── Mark complete ──────────────────────────────────────────────────────
    function markTodayComplete(dayNum, month) {
        const m = month || getCurrentPageMonth();
        const normalizedDay = Number(dayNum);
        if (!Number.isFinite(normalizedDay)) return;

        const { currentUnlockedDay } = getProgressState(m);
        const completedDays          = getCompletedDays(m);
        const isNewCompletion        = !completedDays.includes(normalizedDay);

        if (isNewCompletion) {
            completedDays.push(normalizedDay);
            localStorage.setItem(storageKey(m, 'completedDays'), JSON.stringify(completedDays));
        }
        if (normalizedDay === currentUnlockedDay) {
            localStorage.setItem(storageKey(m, 'lastCompletedDate'), getTodayDateString());
        }
    }

    // ── Public API ─────────────────────────────────────────────────────────
    window.TotWiseCore = {
        getProgressState,
        getTodayDateString,
        isFutureDay,
        canUnlockNextDay,
        markTodayComplete,
        getLastCompletedDate,
        getCompletedDays,
        isMonthAccessible,
        getMonthsUnlocked,
        getCurrentPageMonth,
    };
})();
