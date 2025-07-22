import Spinner from "./spinner";

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay = ({ message = "Loading..." }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-2xl shadow-lg border border-border/50">
        <Spinner size="lg" />
        <p className="text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;