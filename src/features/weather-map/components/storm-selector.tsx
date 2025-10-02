import { stormsApi } from "@/services/apis/storms.api";
import { mdiWeatherHurricaneOutline } from "@mdi/js";
import Icon from "@mdi/react";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useWeatherMapLayout } from "../context";

export function StormSelector() {
  const { isStormSelectorOpen, setSelectedStormId, setStorms, storms, selectedStormId } = useWeatherMapLayout();
  const handleStormClick = (stormId: number | null) => {
    setSelectedStormId(stormId);
  };

  useEffect(() => {
    const fetchStorms = async () => {
      try {
        const response = await stormsApi.storms.list();
        setStorms(response.data);
      }
      catch (error) {
        console.error("Error fetching storms:", error);
      }
    };

    fetchStorms();
  }, [setStorms]);

  return (
    <>
      {/* Storm Selector Panel */}
      {isStormSelectorOpen && (
        <div className="absolute top-6 right-6 z-[1000] pointer-events-auto w-[400px]">
          <div className="p-4 flex flex-col gap-2 bg-white/70 backdrop-blur-sm shadow-2xl rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-medium text-black">Select Storm</h2>
                <p className="text-base text-black/80 mt-2">
                  Choose a storm to display its trajectory
                </p>
              </div>
              {/* <button
                onClick={onToggle}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-colors"
              >
                <Icon path={mdiClose} size={1} className="text-black" />
              </button> */}
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[500px] mt-4">
              {/* All Storms Option */}
              {/* <button
                onClick={() => handleStormClick(null)}
                className={`p-4 rounded-lg text-left transition-colors ${selectedStormId === null
                  ? "bg-orange-500 text-white"
                  : "bg-white/50 hover:bg-white/80 text-black"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon path={mdiWeatherHurricaneOutline} size={0.8} />
                  <h3 className="text-lg font-semibold">All Storms</h3>
                </div>
                <p className="text-sm opacity-80">Display all available storms</p>
              </button> */}

              {/* Individual Storms */}
              {storms.map(storm => (
                <button
                  key={storm.storm_id}
                  onClick={() => handleStormClick(storm.storm_id)}
                  className={`p-4 rounded-lg text-left transition-colors ${selectedStormId === storm.storm_id
                    ? "bg-orange-500 text-white"
                    : "bg-white/50 hover:bg-white/80 text-black"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon path={mdiWeatherHurricaneOutline} size={0.8} />
                    <h3 className="text-lg font-semibold">{storm.storm_name}</h3>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="opacity-80">ID:</span>
                      {" "}
                      <span className="font-medium">{storm.storm_id}</span>
                    </p>
                    <p>
                      <span className="opacity-80">Start:</span>
                      {" "}
                      <span className="font-medium">
                        {dayjs(storm.start_date).format("DD/MM/YYYY")}
                      </span>
                    </p>
                    <p>
                      <span className="opacity-80">End:</span>
                      {" "}
                      <span className="font-medium">
                        {dayjs(storm.end_date).format("DD/MM/YYYY")}
                      </span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
