import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastNotifications() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      limit={10}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Slide}
      stacked
    />
  );
}
