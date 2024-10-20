import React from "react";

interface TimelineItem {
  date: string;
  time: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <ol className="relative border-l border-dashed border-neutral-gray-60 pt-4">
      {items.map((item, index) => (
        <li key={index} className="mb-4 ml-4">
          <div className="absolute w-2 h-2 bg-dark-color rounded-full mt-5 -left-[0.26rem] border border-dark-color"></div>
          <p className="text-16-400 text-neutral-gray-80">{item.description}</p>
          <time className="text-14 font-400 text-neutral-gray-60">
            {item.date}
          </time>
        </li>
      ))}
    </ol>
  );
};

export default Timeline;
