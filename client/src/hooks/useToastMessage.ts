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

    if (type === "success") {
      toast.success(message, { style });
    } else if (type === "error") {
      toast.error(message, { style });
    }
  };

  return { showToast };
};
