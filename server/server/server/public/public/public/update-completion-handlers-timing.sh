#!/bin/bash
# Update all completion handlers to wait for script load

for i in {1..30}; do
  file="member_Day$i/member-day$i.html"
  if [ -f "$file" ]; then
    # Check if file already has the new pattern
    if ! grep -q "attachCompletionHandler" "$file"; then
      echo "Updating Day $i..."
      # This is a complex replacement - we'll do it manually for key files
      # For now, just verify the hard guard exists
      if grep -q "showCompletionBlockedPopup" "$file"; then
        echo "  ✓ Hard guard exists"
      else
        echo "  ✗ Missing hard guard!"
      fi
    else
      echo "Day $i already updated"
    fi
  fi
done
