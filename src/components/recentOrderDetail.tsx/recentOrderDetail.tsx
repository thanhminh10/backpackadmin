import React from "react";

// Define the type for each timeline item with status
type TimelineItem = {
  date: string;
  time: string;
  title: string;
  status: boolean; // New property for status
};

// Sample data for the timeline with status
const timelineItems: TimelineItem[] = [
  {
    date: "10/7/2024",
    time: "15:39",
    title: "Giao hàng thành công",
    status: true,
  },
  {
    date: "10/7/2024",
    time: "15:39",
    title: "Đang vận chuyển",
    status: false,
  },
  {
    date: "10/7/2024",
    time: "15:39",
    title: "Đã xác nhận",
    status: false,
  },
  {
    date: "10/7/2024",
    time: "15:39",
    title: "Đặt hàng thành công",
    status: false,
  },
];

// Define the component
const VerticalTimeline: React.FC = () => {
  return (
    <div className="my-0">
      {timelineItems.map((item, index) => (
        <div key={index} className="relative pl-8 sm:pl-40 py-6 group">
          {/* Conditional classes based on status */}
          <div
            className={`flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden 
            before:absolute before:left-10 before:h-full before:px-px
            ${
              item.status ? "before:bg-semantics-succeed" : "before:bg-gray-300"
            }
            sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3
            after:absolute after:left-10 after:w-2 after:h-2
            ${item.status ? "after:bg-semantics-succeed" : "after:bg-gray-300"}
            after:border-4 after:box-content after:border-slate-50 after:rounded-full
            sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5`}
          >
            <time
              className={`absolute left-10 translate-y-1.5 flex flex-col items-end justify-center w-20 h-6 mb-3 sm:mb-0
              ${item.status ? "text-semantics-succeed" : "text-gray-600"}`}
            >
              <div>{item.date}</div>
              <span>{item.time}</span>
            </time>
            <div
              className={`text-16-400
              ${item.status ? "text-semantics-succeed" : "text-gray-600"}`}
            >
              {item.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerticalTimeline;
