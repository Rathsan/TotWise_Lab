/**
 * TotWise Lab — Core Logic (Progress + Cooldown + Soft Lock)
 * Single source of truth for progress state and day eligibility
 */
(function() {
    'use strict';

    const COMPLETED_DAYS_KEY = 'totwise.progress.completedDays';
    const LAST_COMPLETED_DATE_KEY = 'totwise.progress.lastCompletedDate';
    const TOTAL_DAYS = 30;

    /**
     * Returns local date in YYYY-MM-DD format (no time)
     */
    function getTodayDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Returns last completed date from storage
     */
    function getLastCompletedDate() {
        return localStorage.getItem(LAST_COMPLETED_DATE_KEY);
    }

    /**
     * Returns completed days array from storage
     */
    function getCompletedDays() {
        const raw = JSON.parse(localStorage.getItem(COMPLETED_DAYS_KEY) || '[]');
        return raw
            .map((day) => Number(day))
            .filter((day) => Number.isFinite(day) && day > 0)
            .sort((a, b) => a - b);
    }

    /**
     * Returns progress state derived from storage
     * {
     *   currentUnlockedDay,
     *   lastCompletedDate
     * }
     */
    function getProgressState() {
        const completedDays = getCompletedDays();
        const lastCompletedDate = getLastCompletedDate();

        if (completedDays.length === 0) {
            return {
                currentUnlockedDay: 1,
                lastCompletedDate
            };
        }

        const maxCompleted = Math.max(...completedDays);
        const canUnlock = canUnlockNextDay();
        const currentUnlockedDay = Math.min(canUnlock ? (maxCompleted + 1) : maxCompleted, TOTAL_DAYS);

        return {
            currentUnlockedDay,
            lastCompletedDate
        };
    }

    /**
     * Calendar-day cooldown check
     */
    function canUnlockNextDay() {
        const todayDate = getTodayDateString();
        const lastCompletedDate = getLastCompletedDate();
        return todayDate !== lastCompletedDate;
    }

    /**
     * Returns true if pageDay is in the future relative to currentUnlockedDay
     */
    function isFutureDay(pageDay) {
        const { currentUnlockedDay } = getProgressState();
        return pageDay > currentUnlockedDay;
    }

    /**
     * Mark today's day as complete and store lastCompletedDate
     * Does NOT unlock next day immediately.
     */
    function markTodayComplete(dayNum) {
        const normalizedDay = Number(dayNum);
        if (!Number.isFinite(normalizedDay)) return;
        const { currentUnlockedDay } = getProgressState();
        const completedDays = getCompletedDays();
        const isNewCompletion = !completedDays.includes(normalizedDay);
        if (isNewCompletion) {
            completedDays.push(normalizedDay);
            localStorage.setItem(COMPLETED_DAYS_KEY, JSON.stringify(completedDays));
        }
        if (normalizedDay === currentUnlockedDay) {
            localStorage.setItem(LAST_COMPLETED_DATE_KEY, getTodayDateString());
        }
    }

    window.TotWiseCore = {
        getProgressState,
        getTodayDateString,
        isFutureDay,
        canUnlockNextDay,
        markTodayComplete,
        getLastCompletedDate,
        getCompletedDays
    };
})();
