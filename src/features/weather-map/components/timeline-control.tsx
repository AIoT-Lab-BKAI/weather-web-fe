import Icon from "@mdi/react";
import { mdiChevronDown, mdiPlay, mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import { FC, ReactNode } from "react";

const CircleButton: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <button
    className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors ${className}`}
  >
    {children}
  </button>
);

export function TimelineControl() {
  const progressPercent = 70;

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-2 w-full">
      <CircleButton>
        <Icon path={mdiPlay} size={1.2} className="text-black" />
      </CircleButton>
      <CircleButton>
        <Icon path={mdiSkipPrevious} size={1} className="text-black" />
      </CircleButton>

      <button className="flex items-center justify-center gap-2 w-[159px] h-12 px-4 bg-white rounded-full shadow-lg">
        <span className="text-base font-normal text-black">29/07/2025</span>
        <Icon path={mdiChevronDown} size={1} className="text-black" />
      </button>

      <div className="relative flex-1 max-w-[686px] h-[55px] flex items-center">
        <div
          className="absolute bottom-[28px] z-10"
          style={{ left: `${progressPercent}%`, transform: "translateX(-50%)" }}
        >
          <div className="relative bg-[#FF8D28] text-white text-xs font-semibold px-2 py-0.5 rounded">
            21:30
            <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-[#FF8D28] transform -translate-x-1/2 rotate-45" />
          </div>
        </div>

        <div className="w-full h-1 bg-white rounded-full shadow-inner">
          <div
            className="h-1 bg-[#FF8D28] rounded-l-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div
          className="absolute w-4 h-4 bg-white border-2 border-[#FF8D28] rounded-full shadow-md"
          style={{ left: `${progressPercent}%`, transform: "translateX(-50%)" }}
        />

        <span
          className="absolute -bottom-1 left-[50%] text-white text-xs font-semibold"
          style={{ transform: "translateX(-50%)" }}
        >
          20:00
        </span>
        <span
          className="absolute -bottom-1 left-[80%] text-white text-xs font-semibold"
          style={{ transform: "translateX(-50%)" }}
        >
          22:00
        </span>
      </div>

      <CircleButton>
        <Icon path={mdiSkipNext} size={1} className="text-black" />
      </CircleButton>
    </div>
  );
}
