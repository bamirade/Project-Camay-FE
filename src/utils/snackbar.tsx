import React, { useState, useEffect } from "react";

interface SnackbarProps {
  open: boolean;
  message: string | null;
  autoHideDuration: number;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  autoHideDuration,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
    if (open) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  return isVisible ? (
    <div className="fixed bottom-0 left-0 z-50 p-4 m-4 bg-gray-800 text-white rounded shadow-lg">
      {message}
    </div>
  ) : null;
};

export default Snackbar;
