"use client";
import { iconClose, iconSearch } from "@src/utils/icon/icon";

interface SearchBarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchTag: string | null;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  removeSearchTag: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  setSearchValue,
  searchTag,
  onSearch,
  removeSearchTag,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={onSearch}
        className="w-[588px] h-[48px] rounded-tl-md rounded-br-none rounded-bl-none rounded-tr-none"
      >
        <div className="relative w-full h-full">
          <input
            type="text"
            name="search"
            className="w-full placeholder:italic focus:placeholder:normal text-16 font-300 border-none"
            placeholder="Tìm kiếm theo tên sản phẩm, SKU,..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
          >
            {iconSearch}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-4">
        {searchTag && (
          <>
            <button
              className="flex items-center py-[4px] px-3 bg-white rounded-[16px] cursor-pointer"
              onClick={removeSearchTag}
            >
              <span className="text-16-400 text-dark-color"> Xóa tất cả </span>
              {iconClose}
            </button>

            <button
              className="flex items-center py-[4px] px-3 bg-white rounded-[16px] cursor-pointer"
              onClick={removeSearchTag}
            >
              <span className="text-16-400 text-dark-color">
                {" "}
                Từ khoá: {searchTag}{" "}
              </span>
              {iconClose}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
