"use client";

import { useState, useEffect } from 'react';
import SeedButton from '@/components/SeedButton';

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome to your dashboard!</p>
        </div>
        <div>
          <SeedButton />
        </div>
      </div>
    </div>
  );
}
//edited page 10:30