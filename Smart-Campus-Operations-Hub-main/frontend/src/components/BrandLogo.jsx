import React from 'react';

const brandLogoStyles = `
.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.brand-logo-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  display: block;
}

.brand-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  min-width: 0;
}

.brand-logo-title {
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
}

.brand-logo-subtitle {
  font-size: 12px;
  color: rgba(233, 238, 255, 0.82);
  white-space: nowrap;
}

.brand-logo-compact .brand-logo-title {
  font-size: 15px;
}

.brand-logo-compact .brand-logo-subtitle {
  display: none;
}
`;

const BrandLogo = ({ compact = false }) => {
  return (
    <div className={`brand-logo ${compact ? 'brand-logo-compact' : ''}`}>
      <style>{brandLogoStyles}</style>
      <svg className="brand-logo-icon" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="#eaf2ff" />
        <rect x="18" y="24" width="28" height="18" rx="2" fill="#2457a6" />
        <rect x="15" y="20" width="34" height="4" rx="2" fill="#ffffff" />
        <rect x="22" y="27" width="4" height="15" fill="#dce9ff" />
        <rect x="30" y="27" width="4" height="15" fill="#dce9ff" />
        <rect x="38" y="27" width="4" height="15" fill="#dce9ff" />
        <rect x="26" y="18" width="12" height="4" rx="2" fill="#2457a6" />
      </svg>
      <div className="brand-logo-text">
        <span className="brand-logo-title">Facilities</span>
        {!compact && <span className="brand-logo-subtitle">Management</span>}
      </div>
    </div>
  );
};

export default BrandLogo;
