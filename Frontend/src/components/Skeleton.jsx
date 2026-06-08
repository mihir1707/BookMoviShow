import React from 'react';

export function Skeleton({ className }) {
    return (
        <div className={`animate-pulse bg-gray-800 rounded-md ${className}`}></div>
    );
}
