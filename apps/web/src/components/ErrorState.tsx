import { Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const ErrorState = ({
  title,
  description,
  onRetry,
  isRetrying = false,
}: ErrorStateProps) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-12 text-center shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <TriangleAlert className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      <Button
        variant="destructive"
        onClick={handleRetry}
        className="mt-4 text-white bg-destructive hover:bg-destructive/90"
        disabled={isRetrying}
      >
        {isRetrying ? (
          <>
            <Loader2 className="mr- h-4 w-4 animate-spin" /> Retrying...
          </>
        ) : (
          <>
            <RefreshCw className="mr-1 h-4 w-4" /> Retry
          </>
        )}
      </Button>
    </div>
  );
};

export default ErrorState;
