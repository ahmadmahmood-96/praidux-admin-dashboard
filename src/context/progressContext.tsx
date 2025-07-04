import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Progress, notification } from "antd"; // Ant Design components
import "./global-progress-bar-styles.less"; // Your CSS for the bar

// 1. Define the interface for the context value (the functions provided)
interface ProgressContextType {
  startProgress: () => void;
  updateProgress: (newPercent: number) => void;
  completeProgress: (message: string) => void;
  errorProgress: (message: string) => void;
}

// 2. Create the Context with a default null value, typed with ProgressContextType
//    We assert it as ProgressContextType | null because it will be null initially
const ProgressContext = createContext<ProgressContextType | null>(null);

// 3. Create a Custom Hook for easy consumption
export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    // This error will be thrown if useProgress is called outside of ProgressProvider
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};

// 4. Define the props for the ProgressProvider component
interface ProgressProviderProps {
  children: ReactNode; // children can be any valid React node
}

// 5. Create the Provider Component
export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
}) => {
  const [percent, setPercent] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  // Status can be 'active', 'success', 'exception', or 'normal' (Ant Design Progress status types)
  const [status, setStatus] = useState<
    "active" | "success" | "exception" | "normal"
  >("active");
  const timeoutRef = useRef<any>(null); // useRef for setTimeout ID

  // Functions to control the progress bar
  const startProgress = () => {
    setVisible(true);
    setPercent(0);
    setStatus("active");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any previous hide timeouts
    }
  };

  const updateProgress = (newPercent: number) => {
    if (newPercent !== undefined) {
      setPercent(Math.min(100, Math.max(0, newPercent))); // Ensure between 0 and 100
    }
  };

  const completeProgress = (message: string) => {
    setPercent(100);
    setStatus("success");
    notification.success({
      message: "Success",
      description: message,
      placement: "topRight",
    });
    // Hide after a short delay
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setPercent(0); // Reset for next use
    }, 500);
  };

  const errorProgress = (message: string) => {
    setPercent(100); // Show full bar with error status
    setStatus("exception");
    notification.error({
      message: "Error",
      description: message,
      placement: "topRight",
    });
    // Hide after a longer delay for user to read error
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setPercent(0); // Reset for next use
    }, 3000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const progressContextValue = React.useMemo(
    () => ({
      startProgress,
      updateProgress,
      completeProgress,
      errorProgress,
    }),
    []
  ); // Dependencies array is empty as functions are stable

  return (
    <ProgressContext.Provider value={progressContextValue}>
      {/* The Global Progress Bar component itself */}
      {visible && (
        <div className="global-progress-bar-container">
          <Progress
            className="global-progress-bar"
            strokeLinecap="butt"
            percent={percent}
            showInfo={false} // No number inside the progress bar
            status={status}
            size="small"
            strokeColor={
              status === "exception"
                ? "#ff4d4f" // Red for error
                : status === "active"
                ? "#1890ff" // Green for active
                : "#87BC47" // Blue for success or normal
            }
          />
        </div>
      )}
      {children}
    </ProgressContext.Provider>
  );
};
