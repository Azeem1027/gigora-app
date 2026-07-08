import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div style={{ width: '200px', background: '#f0f0f0', padding: '20px', minHeight: '100vh' }}>
      <button onClick={() => setActiveTab('profile')} style={{ display: 'block', margin: '10px 0' }}>
        Profile Analyzer
      </button>
      <button onClick={() => setActiveTab('seo')} style={{ display: 'block', margin: '10px 0' }}>
        Gig SEO
      </button>
      <button onClick={() => setActiveTab('proposal')} style={{ display: 'block', margin: '10px 0' }}>
        Proposal Generator
      </button>
    </div>
  );
}