#!/bin/bash
# Update all completion handlers with hard guard

for i in {2..6} {8..14} {16..29}; do
  file="member_Day$i/member-day$i.html"
  if [ -f "$file" ]; then
    # Update completeBtn click handler
    sed -i '' 's|// Prevent completion if day is locked and show informative toast|// HARD GUARD: Prevent completion if day is not today (MUST BE FIRST CHECK)|g' "$file"
    sed -i '' 's|if (typeof TotWiseSoftLock !== '\''undefined'\'' && TotWiseSoftLock.isDayLocked(currentDay)) {|if (typeof TotWiseSoftLock !== '\''undefined'\'') {\
                const currentUnlockedDay = TotWiseSoftLock.getCurrentUnlockedDay();\
                if (currentDay !== currentUnlockedDay) {\
                    // Block completion - show popup and return early\
                    TotWiseSoftLock.showCompletionBlockedPopup(currentDay);\
                    return false; // STOP execution - no progress update, no unlock, no nudge\
                }\
            }|g' "$file"
    
    # Remove old toast code
    sed -i '' '/const currentUnlockedDay = TotWiseSoftLock.getCurrentUnlockedDay();/d' "$file"
    sed -i '' '/TotWiseSoftLock.showToast/d' "$file"
    
    echo "Updated Day $i"
  fi
done
