import type { ReactNode } from 'react';

export function KrakenHeader({
  title,
  onBack,
  className = 'kraken-header',
}: {
  title?: ReactNode;
  onBack?: () => void;
  className?: string;
}) {
  return (
    <header className={className}>
      <button
        className="kraken-back"
        aria-label="返回"
        type="button"
        onClick={onBack}
      />
      {title && <h1>{title}</h1>}
    </header>
  );
}

export default KrakenHeader;
