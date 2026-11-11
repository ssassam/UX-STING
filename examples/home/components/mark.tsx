/** UX-STING mark: a check that ends in a sting point, on an amber tag. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="6" className="fill-primary" />
      <path
        d="M8 16.5l5 5L25.5 9"
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground"
      />
      <path
        d="M25.5 9l2.5-3"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-primary-foreground"
      />
    </svg>
  );
}
