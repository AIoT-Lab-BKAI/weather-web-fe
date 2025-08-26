import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

export function SearchInput() {
  return (
    <div className="flex items-center w-[448px] h-12 px-4 bg-white rounded-full shadow-md">
      <Icon path={mdiMagnify} size={1} />
      <input
        type="text"
        placeholder="Search location"
        className="w-full pl-2 bg-transparent border-none outline-none text-base placeholder:text-gray-500"
      />
    </div>
  );
}
