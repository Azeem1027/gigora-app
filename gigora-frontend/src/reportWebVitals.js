const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals')
      .then((vitals) => {
        // Modern web-vitals API (v3+)
        if (vitals.onCLS) {
          const { onCLS, onFCP, onLCP, onTTFB, onINP } = vitals;
          onCLS(onPerfEntry);
          onFCP(onPerfEntry);
          onLCP(onPerfEntry);
          onTTFB(onPerfEntry);
          if (onINP) onINP(onPerfEntry); // Replaced legacy FID metric
        } else {
          // Legacy fallback for web-vitals (v1 / v2)
          const { getCLS, getFID, getFCP, getLCP, getTTFB } = vitals;
          getCLS(onPerfEntry);
          getFID(onPerfEntry);
          getFCP(onPerfEntry);
          getLCP(onPerfEntry);
          getTTFB(onPerfEntry);
        }
      })
      .catch((err) => {
        // Silent failure if web-vitals package is optional or unavailable
        console.debug('web-vitals module failed to load:', err);
      });
  }
};

export default reportWebVitals;