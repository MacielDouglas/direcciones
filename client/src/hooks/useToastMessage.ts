import { toast } from "react-hot-toast";

type ToastType = "success" | "error";

interface ToastOptions {
  message: string;
  type: ToastType;
}

export const useToastMessage = () => {
  const showToast = ({ message, type }: ToastOptions) => {
    const style = {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    };

    const options = {
      style,
      duration: 3000,
    };

    if (type === "success") {
      toast.success(message, options);
    } else if (type === "error") {
      toast.error(message, options);
    }
  };

  return { showToast };
};
