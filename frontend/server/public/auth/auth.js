/**
 * TotWise Lab - Centralized Authentication Logic
 * Backend-verified session + subscription enforcement.
 */

(function() {
    'use strict';

    const API_BASE = window.TOTWISE_API_BASE || '';

    function getBasePath() {
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;

        if (protocol === 'http:' || protocol === 'https:') {
            if (pathname.includes('/Dashboard/')) {
                return pathname.split('/Dashboard')[0];
            }
            // Month 2+ pages: /member_Month2_Day{n}/
            if (pathname.includes('/member_Month')) {
                return pathname.split('/member_Month')[0];
            }
            // Month 1 pages: /member_Day{n}/
            if (pathname.includes('/member_Day')) {
                return pathname.split('/member_Day')[0];
            }
            if (pathname.includes('/login/')) {
                return pathname.split('/login')[0];
            }
            return '';
        }

        return '..';
    }

    function getLoginPath() {
        const basePath = getBasePath();
        if (basePath === '') {
            return '/login/login.html';
        }
        return basePath + '/login/login.html';
    }

    function getSubscribePath() {
        const basePath = getBasePath();
        if (basePath === '') {
            return '/index.html#pricing';
        }
        return basePath + '/index.html#pricing';
    }

    async function getSessionStatus() {
        try {
            const response = await fetch(`${API_BASE}/api/auth/session`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.status === 200) {
                try {
                    const data = await response.json();
                    // Persist month access info so TotWiseCore can use it without
                    // an extra API call on every page load.
                    if (data.currentMonth)   sessionStorage.setItem('totwiseCurrentMonth',   String(data.currentMonth));
                    if (data.monthsUnlocked) sessionStorage.setItem('totwiseMonthsUnlocked', String(data.monthsUnlocked));
                    if (data.subscriptionId) sessionStorage.setItem('totwiseSubscriptionId', String(data.subscriptionId));
                } catch (_) {
                    // Non-fatal: session data unavailable, defaults will be used
                }
                return { ok: true };
            }

            if (response.status === 403) {
                return { ok: false, reason: 'inactive' };
            }

            return { ok: false, reason: 'unauthenticated' };
        } catch (error) {
            return { ok: false, reason: 'unauthenticated' };
        }
    }

    async function requireAuth() {
        const status = await getSessionStatus();
        if (status.ok) {
            return true;
        }

        if (status.reason === 'inactive') {
            window.location.href = getSubscribePath();
            return false;
        }

        window.location.href = getLoginPath();
        return false;
    }

    async function initAuth(options = {}) {
        const {
            checkURLToken = true,
            requireAuth: requireAuthFlag = true
        } = options;

        if (checkURLToken) {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const email = params.get('email');
            if (token && email) {
                return true;
            }
        }

        if (requireAuthFlag) {
            return requireAuth();
        }

        return true;
    }

    async function logout() {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.warn('Logout request failed', error);
        }

        // Clear month-access data from session storage
        sessionStorage.removeItem('totwiseCurrentMonth');
        sessionStorage.removeItem('totwiseMonthsUnlocked');
        sessionStorage.removeItem('totwiseSubscriptionId');

        window.location.href = getLoginPath();
    }

    window.TotWiseAuth = {
        logout,
        initAuth,
        getLoginPath,
        getSubscribePath
    };

    console.log('TotWise Auth module loaded');
})();
