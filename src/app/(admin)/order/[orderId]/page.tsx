"use client";
import { useQuery } from "@apollo/client";
import VerticalTimeline from "@src/components/recentOrderDetail.tsx/recentOrderDetail";
import BorderlessTable from "@src/components/table/borderlessTable";
import { QUERY_ORDER } from "@src/graphql/order";
import { useParams, useRouter } from "next/navigation";
import { appConfig, configImg } from "@src/utils/config";
import { PaymentMap } from "@src/utils/enum/paymentTypes";
import { formatPrice } from "@src/utils/format/format";
import Image from "next/image";
import { IOrderResponse } from "../_interface/order";

export default function OrderDetail() {
  const orderId = useParams();
  const router = useRouter();
  const { data, loading } = useQuery<IOrderResponse>(QUERY_ORDER, {
    variables: {
      orderId: orderId.orderId,
    },
  });
  const headers = [
    { key: "Img", title: "Hình ảnh", w: 80, center: false },
    { key: "name", title: "Tên sản phẩm", w: 250, center: false },
    { key: "price", title: "Đơn giá", w: 100, center: true },
    { key: "count", title: "Số lượng", w: 100, center: true },
  ];

  const data2 = [
    {
      key: 1,
      Img: "123",
      name: "John Doe",
      price: 28,
      count: 2,
    },
    {
      key: 2,
      Img: "4124124",
      name: "Jane Smith",
      price: 32,
      count: 2,
    },
    {
      key: 3,
      Img: "12124124",
      name: "Alice Johnson",
      price: 24,
      count: 4,
    },
  ];

  let totalOrder = 0;

  const bodies =
    data?.order.orderItem.map((item, index) => {
      const itemAvatar = item.thumbnail
        ? configImg(item.thumbnail, appConfig)
        : "/User.svg";
      totalOrder += item.price * item.itemQuantity;
      return {
        key: index,
        Img: (
          <div className="relative rounded-lg overflow-hidden w-[50px] h-[50px] bg-white border ">
            <Image
              src={itemAvatar}
              alt={item.name ?? ""}
              layout="fill"
              className="absolute inset-0 object-cover"
            />
          </div>
        ),
        name: <div className="line-clamp-2">{item.name}</div>,
        price: item.price ? (
          <>
            {formatPrice(item.price)} <span className="underline">đ</span>
          </>
        ) : (
          0
        ),
        count: item.itemQuantity,
      };
    }) ?? [];

  const payment = PaymentMap.filter(
    (item) => item?.value === data?.order?.paymentMethod
  );

  const items = [
    {
      isActive: true,
      icon: (
        <svg
          className="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="10"
        >
          <path
            fillRule="nonzero"
            d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
          />
        </svg>
      ),
      title: "Order Placed",
      date: "08/06/2023",
      description:
        "Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.",
    },
    {
      isActive: true,
      icon: (
        <svg
          className="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="10"
        >
          <path
            fillRule="nonzero"
            d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
          />
        </svg>
      ),
      title: "Order Shipped",
      date: "09/06/2023",
      description:
        "Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.",
    },
    {
      isActive: true,
      icon: (
        <svg
          className="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="10"
        >
          <path
            fillRule="nonzero"
            d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
          />
        </svg>
      ),
      title: "In Transit",
      date: "10/06/2023",
      description:
        "Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.",
    },
    {
      isActive: true,
      icon: (
        <svg
          className="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="10"
        >
          <path
            fillRule="nonzero"
            d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
          />
        </svg>
      ),
      title: "Out of Delivery",
      date: "12/06/2023",
      description:
        "Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.",
    },
    {
      isActive: false,
      icon: (
        <svg
          className="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
        >
          <path d="M12 10v2H7V8.496a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V12H0V4.496a.5.5 0 0 1 .206-.4l5.5-4a.5.5 0 0 1 .588 0l5.5 4a.5.5 0 0 1 .206.4V10Z" />
        </svg>
      ),
      title: "Delivered",
      date: "Exp. 12/08/2023",
      description:
        "Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.",
    },
  ];
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-4 py-9">
      <h1 className="text-26 font-500  text-neutral-gray-80 ">
        Chi tiết đơn hàng
      </h1>
      <div className="grid grid-cols-12  gap-9">
        <div className="flex flex-col gap-6 col-span-8">
          <div className="section-wrapper w-full gap-2">
            <h3 className="section-label">Danh sách chi tiết đơn hàng</h3>

            <BorderlessTable headers={headers} data={bodies} />
            <div className="flex justify-between items-center h-12 rounded-t-lg">
              <h4 className="text-16 font-500 uppercase">TỔNG CỘNG</h4>
              <div className="text-16 font-500">
                {formatPrice(totalOrder)} <span className="underline">đ</span>
              </div>
            </div>
          </div>
          <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between"
        aria-label="Table navigation"
      >
        <button
          onClick={handleGoBack}
          className="flex gap-1 h-[48px] p-[12px_24px] rounded-[12px] border border-dark-color text-dark-color"
        >
          Quay lại
        </button>
      </nav>
        </div>
        <div className="flex flex-col gap-6 col-span-4">
          <div className="section-wrapper w-full gap-2 px-9 py-6">
            <h3 className="section-label">Thông tin khách hàng</h3>
            <div className="flex flex-col gap-2 py-2">
              <span>{data?.order?.userName}</span>
              <span>{data?.order?.user.email}</span>
              <span>{data?.order?.user.phone}</span>
              <span>Nữ</span>
              <span>24/12/1990</span>
              <span>{data?.order?.deliveryAddress}</span>
            </div>
          </div>

          <div className="section-wrapper w-full gap-2 px-9 py-6 gap-2">
            <h3 className="section-label">Trạng thái thanh toán</h3>
            <div className="flex flex-col gap-2 w-[40%]">
              <div
                className={`inline-flex items-center justify-center  rounded-full bg-[#00673633] text-semantics-succeed text-16 font-500 py-2 px-4`}
              >
                Đã thanh toán
              </div>
            </div>
          </div>

          <div className="section-wrapper w-full gap-2 px-9 py-6 gap-2">
            <h3 className="section-label">Phương thức thanh toán</h3>
            <h4 className="text-16-400 text-neutral-gray-60">
              {payment[0]?.key}
            </h4>

            <div className="flex flex-col gap-6">
              <h3 className="section-label">Trạng thái đơn hàng</h3>
              <VerticalTimeline />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
