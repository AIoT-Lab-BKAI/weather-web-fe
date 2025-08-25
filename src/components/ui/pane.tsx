import { cn, setFullHeightFromTop } from "@/lib/utils";
import { BarLoader } from "react-spinners";

interface Props {
  title: string;
  isLoading?: boolean;
}

export function Pane({ title, children, isLoading, className }: Props & React.ComponentProps<"div">) {
  return (
    <div className={cn("bg-white rounded-xl shrink-0 flex flex-col mx-4", className)}>
      <h2 className="px-4 pt-6 pb-4 text-3xl">{title}</h2>
      <div className="h-0.5 w-full bg-gray-200">
        {isLoading && <BarLoader width="100%" height="100%" />}
      </div>
      <div
        className="overflow-auto"
        ref={setFullHeightFromTop}
      >
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
