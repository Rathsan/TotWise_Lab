/**
 * TotWise Lab - Centralized Authentication Logic
 * 
 * This file contains all authentication-related functions to avoid duplication.
 * Import this file in all pages that require authentication.
 */

(function() {
    'use strict';

    /**
     * Get the login page path based on current location
     * @returns {string} Path to login page
     */
    function getLoginPath() {
        const protocol = window.location.protocol;
        const pathname = window.location.pathname;
        
        // If running on a web server (http/https), use absolute path from root
        if (protocol === 'http:' || protocol === 'https:') {
            // Extract the base path (everything before current directory)
            let basePath = pathname;
            
            // Remove current directory from path
            if (pathname.includes('/Dashboard/')) {
                basePath = pathname.split('/Dashboard')[0];
            } else if (pathname.includes('/member_Day')) {
                basePath = pathname.split('/member_Day')[0];
            } else if (pathname.includes('/login/')) {
                basePath = pathname.split('/login')[0];
            }
            
            return basePath + '/login/login.html';
        }
        
        // For file:// protocol, use relative path
        return '../login/login.html';
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated, false otherwise
     */
    function isAuthenticated() {
        const token = sessionStorage.getItem('loginToken');
        return !!token; // Convert to boolean
    }

    /**
     * Verify authentication and redirect to login if not authenticated
     * Call this at the start of any protected page
     * @param {boolean} allowRedirect - Whether to redirect if not authenticated (default: true)
     * @returns {boolean} True if authenticated, false otherwise
     */
    function requireAuth(allowRedirect = true) {
        if (!isAuthenticated()) {
            if (allowRedirect) {
                console.log('❌ Not authenticated, redirecting to login');
                window.location.href = getLoginPath();
            }
            return false;
        }
        return true;
    }

    /**
     * Handle logout - clears session and redirects to login
     */
    function logout() {
        // Clear session storage
        sessionStorage.removeItem('loginToken');
        sessionStorage.removeItem('userEmail');
        
        // Clear any progress data if needed (optional - you might want to keep progress)
        // localStorage.removeItem('totwise.progress.completedDays');
        
        console.log('Logged out successfully');
        
        // Redirect to login
        window.location.href = getLoginPath();
    }

    /**
     * Verify token from URL parameters (for email links)
     * Call this when page loads with token in URL
     * @returns {boolean} True if token was valid and stored, false otherwise
     */
    function verifyTokenFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        
        if (token && email && token.length >= 16) {
            // Basic validation: token should be reasonable length
            // Decode email in case it's URL encoded
            const decodedEmail = decodeURIComponent(email);
            
            // Store token and email in sessionStorage
            sessionStorage.setItem('loginToken', token);
            sessionStorage.setItem('userEmail', decodedEmail);
            
            // Clear token from URL for security
            if (window.history.replaceState) {
                const cleanUrl = window.location.pathname + '?email=' + encodeURIComponent(decodedEmail);
                window.history.replaceState({}, document.title, cleanUrl);
            }
            
            console.log('✅ Token verified and stored from URL');
            return true;
        }
        
        return false;
    }

    /**
     * Initialize authentication check on page load
     * Call this at the start of protected pages
     * @param {Object} options - Configuration options
     * @param {boolean} options.checkURLToken - Check for token in URL (default: true)
     * @param {boolean} options.requireAuth - Require authentication (default: true)
     */
    function initAuth(options = {}) {
        const {
            checkURLToken = true,
            requireAuth: requireAuthFlag = true
        } = options;

        // First, check if token exists in URL (from email link)
        if (checkURLToken) {
            const tokenInURL = verifyTokenFromURL();
            if (tokenInURL) {
                // Token was in URL and is now stored, allow access
                return true;
            }
        }

        // If no token in URL, check sessionStorage
        if (requireAuthFlag) {
            return requireAuth(true);
        }

        return isAuthenticated();
    }

    // Export functions to window object for global access
    window.TotWiseAuth = {
        isAuthenticated,
        requireAuth,
        logout,
        verifyTokenFromURL,
        initAuth,
        getLoginPath
    };

    console.log('TotWise Auth module loaded');
})();
