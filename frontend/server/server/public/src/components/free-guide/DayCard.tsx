import Link from 'next/link';
import React from 'react';

interface DayCardProps {
  day: number;
  title: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
}

export function DayCard({ day, title, description, unlocked, completed }: DayCardProps) {
  return (
    <div className="journey-section" style={{ marginBottom: '16px' }}>
      <div className="journey-header" style={{ alignItems: 'center', justifyContent: 'space-between', display: 'flex' }}>
        <h2>Day {day}</h2>
        {completed ? <span style={{ color: '#7BA876', fontWeight: 700 }}>Completed</span> : null}
      </div>
      <p className="journey-subtitle">{title}</p>
      <p style={{ color: '#4A5857', marginBottom: '12px' }}>{description}</p>
      {unlocked ? (
        <Link href={`/free-guide/day${day}`} className="btn btn-primary">
          Start Day {day}
        </Link>
      ) : (
        <button className="btn btn-outline" style={{ cursor: 'not-allowed' }} disabled>
          Locked
        </button>
      )}
    </div>
  );
}
