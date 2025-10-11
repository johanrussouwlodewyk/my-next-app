"use client";

import { useState } from "react";

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function runSeed() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) setMessage(data.message || 'Seed success');
      else setMessage(data.message || 'Seed failed');
    } catch (e) {
      setMessage(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={runSeed} disabled={loading} style={{ padding: '8px 12px' }}>
        {loading ? 'Seeding…' : 'Run Seed'}
      </button>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </div>
  );
}
