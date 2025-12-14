import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="bg-destructive/5 rounded-2xl border border-destructive/20 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
        </div>
        <p className="text-foreground mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
