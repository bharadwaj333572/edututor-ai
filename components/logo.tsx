export function EduTutorLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      {/* Main brain/education shape */}
      <circle cx="50" cy="35" r="25" fill="url(#logoGradient)" opacity="0.9" />

      {/* Learning connections */}
      <path
        d="M30 45 Q40 55 50 45 Q60 35 70 45"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M25 50 Q35 60 45 50 Q55 40 65 50"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />

      {/* Book/education element */}
      <rect x="35" y="65" width="30" height="20" rx="2" fill="url(#accentGradient)" />
      <rect x="37" y="67" width="26" height="2" fill="white" opacity="0.8" />
      <rect x="37" y="71" width="20" height="2" fill="white" opacity="0.6" />
      <rect x="37" y="75" width="24" height="2" fill="white" opacity="0.6" />
      <rect x="37" y="79" width="18" height="2" fill="white" opacity="0.6" />

      {/* Smart learning nodes */}
      <circle cx="25" cy="25" r="3" fill="url(#accentGradient)" />
      <circle cx="75" cy="25" r="3" fill="url(#accentGradient)" />
      <circle cx="20" cy="40" r="2" fill="url(#accentGradient)" opacity="0.8" />
      <circle cx="80" cy="40" r="2" fill="url(#accentGradient)" opacity="0.8" />
    </svg>
  )
}
