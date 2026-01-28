import React from 'react';

interface ProgressTrackerProps {
  currentDay: number;
  completedDays: number[];
  unlockInHours: Record<number, number>;
}

export function ProgressTracker({ currentDay, completedDays, unlockInHours }: ProgressTrackerProps) {
  const dayLabels = [
    { day: 1, label: 'Day 1' },
    { day: 2, label: 'Day 2' },
    { day: 3, label: 'Day 3' }
  ];

  const statusText = (day: number) => {
    if (completedDays.includes(day)) return 'Completed';
    if (day <= currentDay) return 'Unlocked';
    return `Unlocks in ${unlockInHours[day] ?? 0} hours`;
  };

  return (
    <div className="free-guide-progress">
      <div className="free-guide-progress-header">
        <div>
          <p className="free-guide-progress-title">Progress Tracker</p>
          <p className="free-guide-progress-count">{completedDays.length} of 3 days completed</p>
        </div>
        <p className="free-guide-progress-note">Small, loving moments shape your child’s growth.</p>
      </div>
      <div className="free-guide-day-grid">
        {dayLabels.map(({ day, label }) => {
          const isComplete = completedDays.includes(day);
          const isUnlocked = day <= currentDay;
          const status = isComplete ? 'Completed' : isUnlocked ? 'Unlocked' : 'Locked';
          return (
            <div
              key={day}
              className={`free-guide-day-card ${isComplete ? 'complete' : isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="free-guide-day-top">
                <div className="free-guide-day-number">{label}</div>
                <span className="free-guide-day-chip">{status}</span>
              </div>
              <div className="free-guide-day-meta">{statusText(day)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
