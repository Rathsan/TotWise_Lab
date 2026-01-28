import React from 'react';

interface ProgressTrackerProps {
  currentDay: number;
  completedDays: number[];
}

export function ProgressTracker({ currentDay, completedDays }: ProgressTrackerProps) {
  return (
    <div className="progress-section">
      <div className="progress-content">
        <div className="progress-icon">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#A8C5A0" opacity="0.2" />
            <path d="M10 16l4 4 8-8" stroke="#7BA876" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="progress-text">
          <p className="progress-count">{completedDays.length} of 3 days completed</p>
          <p className="progress-note">One calm day at a time.</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {[1, 2, 3].map((day) => {
          const isComplete = completedDays.includes(day);
          const isUnlocked = day <= currentDay;
          return (
            <div
              key={day}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isComplete ? '#A8C5A0' : '#FFF8F5',
                color: isComplete ? '#FFFFFF' : '#2D3B3A',
                border: isUnlocked ? '1px solid #E8B4A0' : '1px dashed #E1E6E4',
                fontWeight: 700
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
