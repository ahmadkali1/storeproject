import { AlertCircle, PackageOpen, RotateCcw, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid" aria-label="Loading products" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="product-skeleton" key={index}>
          <div className="skeleton-image shimmer" />
          <div className="skeleton-line shimmer w-2/3" />
          <div className="skeleton-line shimmer w-5/6" />
          <div className="skeleton-line shimmer w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state-panel" role="alert">
      <AlertCircle aria-hidden="true" />
      <h2>That page didn’t load</h2>
      <p>{message}</p>
      <Button variant="outline" onClick={onRetry}>
        <RotateCcw /> Try again
      </Button>
    </div>
  );
}

export function EmptyState({
  title = "Nothing to show yet",
  description = "Try changing your search or removing a filter.",
  action,
  search = false,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  search?: boolean;
}) {
  const Icon = search ? SearchX : PackageOpen;
  return (
    <div className="state-panel">
      <Icon aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
