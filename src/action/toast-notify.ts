import {
  Slide,
  ToastOptions,
  TypeOptions,
  ToastContent,
  Id,
  toast,
} from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  transition: Slide,
};

export default function toastNotify(
  type: TypeOptions,
  // options: Partial<ToastOptions>,
  content: ToastContent
) {
  switch (type) {
    case "success":
      return toast.success(content, defaultOptions);
    case "error":
      return toast.error(content, defaultOptions);
    case "info":
      return toast.info(content, defaultOptions);
    case "warning":
      return toast.warn(content, defaultOptions);
    case "default":
    default:
      return toast(content, defaultOptions);
  }
}
