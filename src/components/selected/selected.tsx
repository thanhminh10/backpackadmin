interface IProps {
  options: any[];
  value?: string;
  onChange?: (...event: any[]) => void;
}

export default function Selected({ options, value, onChange }: IProps) {
  return (
    <>
      <select
        className="flex items-center justify-start h-[42px] px-4 gap-2 rounded-lg border border-neutral-gray-40 bg-white cursor-pointer hover:bg-gray-100"
        defaultValue={value}
        onChange={onChange}
      >
        <option value="">---Select---</option>
        {options?.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
    </>
  );
}
