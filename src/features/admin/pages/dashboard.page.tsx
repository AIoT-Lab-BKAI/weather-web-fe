import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pane } from "@/components/ui/pane";
import { Pane2 } from "@/components/ui/pane2";
import { InfoIcon } from "lucide-react";

export function DashboardPage() {
  return (
    <div className="grid grid-cols-6 gap-4 px-4">
      <Pane title="Panel" className="mx-0 col-span-4">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex gap-6">
            {/* Scoring system summary */}
            <Card className="flex-1 min-w-lg max-w-[260px]">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base">CardTitle</CardTitle>
                <CardDescription className="">CardDescription</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="flex flex-col gap-4">
                  Card content
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Pane>
      {/* Right: History */}
      <Pane2
        header={(
          <div className="flex items-center px-4 pt-3 pb-2">
            <h2 className="text-lg font-semibold grow flex items-center gap-2">
              <InfoIcon />
              <span>Panel2</span>
            </h2>
          </div>
        )}
        className="mx-0 col-span-2"
      >
        <div className="flex flex-col">
        </div>
      </Pane2>
    </div>
  );
}
