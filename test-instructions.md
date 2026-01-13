# Testing Soft Day-Locking

## Quick Test Steps:

1. **Clear Browser Cache:**
   - Chrome/Edge: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"
   - OR use Hard Refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

2. **Open Browser Console:**
   - Press `F12` or `Right-click > Inspect > Console tab`
   - Look for `[TotWiseSoftLock]` log messages

3. **Test Scenarios:**

   **Scenario A: Test on a Future Day**
   - Navigate to a day page that's locked (e.g., if you've completed Day 1, try Day 20)
   - URL: `member_Day20/member-day20.html`
   - Check console for logs
   - You should see:
     - `[TotWiseSoftLock] Checking day: 20`
     - `[TotWiseSoftLock] Current unlocked day: X`
     - `[TotWiseSoftLock] Day is locked, applying soft lock`
     - `[TotWiseSoftLock] Showing soft lock notice`
   
   **Scenario B: Test Toast on Button Click**
   - On a locked day page, click "Mark Today as Complete"
   - Check console for: `[TotWiseSoftLock] Showing toast: ...`
   - Toast should appear at bottom of screen

   **Scenario C: Test Navigation**
   - Click the brand logo (TotWise Lab) in header → should go to dashboard
   - Click "Back to Dashboard" button in soft lock notice → should go to dashboard

4. **Verify Script Loading:**
   - Open browser DevTools > Network tab
   - Refresh page
   - Look for `soft-day-lock.js` in the network requests
   - Check if it loads successfully (status 200)

5. **Check for Errors:**
   - Look in Console for any red error messages
   - Common issues:
     - 404 error on soft-day-lock.js → Check file path
     - Script syntax error → Check console for details
     - TotWiseSoftLock undefined → Script not loading

## Debug Commands (run in browser console):

```javascript
// Check if script loaded
typeof TotWiseSoftLock

// Check current unlocked day
TotWiseSoftLock.getCurrentUnlockedDay()

// Check if day 20 is locked
TotWiseSoftLock.isDayLocked(20)

// Manually trigger toast
TotWiseSoftLock.showToast('Test message')

// Check if button exists
document.getElementById('completeBtn')

// Check if notice exists
document.querySelector('.soft-lock-notice')
```

## Common Issues & Fixes:

1. **Script not loading:**
   - Check file path: Should be `/soft-day-lock.js` (root level)
   - Verify file exists: `ls -la soft-day-lock.js`
   - Check browser console for 404 errors

2. **Changes not reflecting:**
   - Hard refresh browser (Ctrl+F5 / Cmd+Shift+R)
   - Clear browser cache
   - Check if file was actually saved

3. **Toast not showing:**
   - Check console for errors
   - Verify `showToast` function is called (check logs)
   - Check if toast element is created in DOM

4. **Notice not showing:**
   - Check console logs for `showSoftLockNotice`
   - Verify `.completion-section` exists in HTML
   - Check if notice element is in DOM: `document.querySelector('.soft-lock-notice')`
