// src/components/Home.js
import React from 'react';

export default function Home({ onLogout }) {
  return (
    <div>
      {/* Top Navbar with Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
        <h2>Gigora</h2>
        <button onClick={onLogout} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
          Log Out
        </button>
      </div>

      {/* PASTE YOUR ORIGINAL MAIN PAGE COMPONENT / JSX HERE */}
      <div className="main-content">
        {/* Tumhara original layout, feed, sidebar, tables, etc. */}
      </div>
    </div>
  );
}