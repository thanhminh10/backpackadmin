import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  w?: number;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  w,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hàm kiểm tra nếu click ngoài modal
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          ref={modalRef}
          className={`bg-white rounded-lg shadow-lg py-9 px-12 flex flex-col gap-6`}
          style={{ width: w ? `${w}px` : "600px" }}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between border-gray-200">
            <h2 className="text-20 font-400">{title}</h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Modal body */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
