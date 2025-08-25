import { cn, setFullHeightFromTop } from "@/lib/utils";
import { BarLoader } from "react-spinners";

interface Props {
  header?: React.ReactNode;
  isLoading?: boolean;
}

export function Pane2({ header, children, isLoading, className }: Props & React.ComponentProps<"div">) {
  return (
    <div className={cn("bg-white rounded-xl shrink-0 flex flex-col mx-4", className)}>
      {header}
      <div className="h-0.5 w-full bg-second">
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
