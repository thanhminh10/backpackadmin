import { toast } from "react-toastify";

export default function toastPromise<T>(promise: Promise<T>) {
  return toast.promise(
    promise,
    {
      pending: "Loading...",
      success: "Save Successfully",
    },
    {
      autoClose: 1000,
      position: "top-right",
      theme: "light"
    }
  );
}
