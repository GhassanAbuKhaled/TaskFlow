interface LoadingScreenProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen = ({ size = 'lg', message = 'Loading...', fullScreen = true }: LoadingScreenProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-background'
    : 'flex items-center justify-center h-full';

  return (
    <div className={containerClasses}>
      {fullScreen ? (
        <div className="text-center">
          <div className={`animate-spin rounded-full border-b-2 border-primary mx-auto mb-2 ${sizeClasses[size]}`}></div>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
      ) : (
        <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
      )}
    </div>
  );
};