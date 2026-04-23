export const SidebarToggleIcon = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <line x1="9" y1="6" x2="9" y2="18" />
    <line x1="12" y1="7" x2="18" y2="7" />
    <line x1="12" y1="12" x2="18" y2="12" />
    <line x1="12" y1="17" x2="18" y2="17" />
  </svg>
);