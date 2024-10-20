import { uploadFileIcon } from "@src/utils/icon/icon";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

const StoreDetail = () => {
  const [newImageStore, setNewImageStore] = useState<File[]>();
  const uploadImage2 = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);

      setNewImageStore(_files);
    }
  };
  return (
    <div className="grid grid-cols-7 gap-6">
      <div className="col-span-5 border border-neutral-gray-40 rounded-lg">
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <p className="text-14 font-400 text-neutral-gray-60">
              Tên cửa hàng
            </p>
            <span className="text-16-400 text-neutral-gray-60">Yoly</span>
          </div>
          <div>
            <p className="text-14 font-400 text-neutral-gray-60">Đường dẫn</p>
            <span className="text-16-400 text-neutral-gray-60">
              https://yoly.vn/
            </span>
          </div>
          <div>
            <p className="text-14 font-400 text-neutral-gray-60">Gói dịch vụ</p>
            <span className="text-16-400 text-neutral-gray-60">Omni Plus</span>
          </div>
          <div>
            <p className="text-14 font-400 text-neutral-gray-60">
              Người tạo/ Nhân viên phụ trách
            </p>
            <span className="text-16-400 text-neutral-gray-60">Robert Fox</span>
          </div>

          <div>
            <p className="text-14 font-400 text-neutral-gray-60">
              Ngày bắt đầu
            </p>
            <span className="text-16-400 text-neutral-gray-60">14/06/2024</span>
          </div>
          <div>
            <p className="text-14 font-400 text-neutral-gray-60">
              Ngày hết hạn
            </p>
            <span className="text-16-400 text-neutral-gray-60">14/06/2024</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4">
          <div className="row-span-1 col-span-8">
            <p className="text-sm color-neutral-gray-60 mb-2">Vai trò</p>
            <select className="select_custom" name="userLevel">
              <option value="1">104 - Skincare Spa</option>
              <option value="2">Elib</option>
              <option value="3" selected>
                Thư viện sách
              </option>
              <option value="4">Test Store</option>
            </select>
          </div>
          <div className="row-span-1 col-span-8">
            <p className="text-[14px] font-400 text-neutral-gray-60 mb-2">
              Mô tả
            </p>
            <textarea
              className="w-full border border-neutral-gray-40 rounded-lg p-4 input_animation_focus_2 "
              rows={4}
              placeholder="Nhập mô tả"
              name="des"
              id="des"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="col-span-2 col-start-6 gap-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-4  p-4 border border-neutral-gray-40 rounded-lg">
            <div className="flex flex-col">
              <p className="text-14 font-400 text-neutral-gray-60">
                Trạng thái
              </p>

              <div className={`status_true w-full justify-center`}>
                Đang hoạt động
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4  p-4 border border-neutral-gray-40 rounded-lg">
            <div className="flex flex-col">
              <h6 className="text-[14px] font-400 text-neutral-gray-60 mb-2">
                Hình ảnh
              </h6>
              <label
                htmlFor="dropzone-file2"
                className="flex flex-col items-center justify-center border-2 border-dark-color border-dashed rounded-lg cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center w-full p-4">
                  <div className="relative rounded-lg overflow-hidden w-16 h-16 bg-main-bg-color">
                    {newImageStore &&
                      newImageStore.map((image, idx) => (
                        <Image
                          key={idx}
                          src={URL.createObjectURL(image)}
                          alt={"Hình ảnh danh mục"}
                          layout="fill"
                          className="absolute inset-0 object-cover"
                        />
                      ))}
                  </div>
                  <p className="my-2 text-dark-color flex justify-center items-center gap-1">
                    {uploadFileIcon}
                    Tải ảnh lên từ thiết bị
                  </p>
                </div>
                <input
                  id="dropzone-file2"
                  className="hidden"
                  accept="image/png, image/jpeg , image/webp"
                  type="file"
                  onChange={uploadImage2}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
