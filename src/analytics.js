// Vercel Web Analytics initialization
// This script initializes Vercel Analytics for the PacSun Home project
(function() {
  'use strict';
  
  // Initialize the queue for analytics events
  if (!window.va) {
    window.va = function() {
      (window.vaq = window.vaq || []).push(arguments);
    };
  }

  // Detect environment (development vs production)
  function isDevelopment() {
    // In development, we use localhost or preview URLs
    return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  }

  // Get the appropriate script source
  function getScriptSrc() {
    if (isDevelopment()) {
      return 'https://va.vercel-scripts.com/v1/script.debug.js';
    }
    return '/_vercel/insights/script.js';
  }

  // Check if script is already loaded
  const src = getScriptSrc();
  if (document.head.querySelector('script[src*="' + src + '"]')) {
    return;
  }

  // Create and inject the analytics script
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.dataset.sdkn = '@vercel/analytics';
  script.dataset.sdkv = '1.6.1';

  script.onerror = function() {
    const errorMessage = isDevelopment() 
      ? 'Analytics: Please check if any ad blockers are enabled and try again.'
      : 'Analytics: Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.';
    console.log(errorMessage);
  };

  // Append script to document head
  if (document.head) {
    document.head.appendChild(script);
  } else {
    // If head is not ready, wait for DOM to load
    document.addEventListener('DOMContentLoaded', function() {
      document.head.appendChild(script);
    });
  }
})();
