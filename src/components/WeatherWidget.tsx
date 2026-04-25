import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";

export function WeatherWidget() {
  const { t } = useTranslation();
  const [data, setData] = useState<{ temp: number; code: number } | null>(null);
  
  useEffect(() => {
    let alive = true;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=43.8356&longitude=25.9657&current_weather=true")
      .then(r => r.json())
      .then(j => { if (alive && j?.current_weather) setData({ temp: Math.round(j.current_weather.temperature), code: j.current_weather.weathercode }); })
      .catch(() => { if (alive) setData({ temp: 19, code: 1 }); });
    return () => { alive = false; };
  }, []);
  
  const temp = data?.temp ?? 19;
  const code = data?.code ?? 1;
  const Icon = code >= 71 ? Snowflake : code >= 51 ? CloudRain : code >= 2 ? Cloud : Sun;
  
  // Get translated weather description
  const getWeatherKey = () => {
    if (code >= 71) return "snowy";
    if (code >= 51) return "rainy";
    if (code >= 2) return "partlyCloudy";
    return "sunny";
  };
  
  // Get translated tip based on temperature
  const getTipKey = () => {
    const tips = ["danubeWalk", "exploreDay", "cafeWeather", "bringJacket"];
    return tips[temp % tips.length];
  };

  return (
    <div className="surface px-6 py-4 inline-flex items-center gap-4 bg-gradient-card min-w-[280px]">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="text-base font-semibold">{temp}°C · {t(`weather.${getWeatherKey()}`)}</div>
        <div className="text-sm text-muted-foreground">{t(`weather.tips.${getTipKey()}`)}</div>
      </div>
    </div>
  );
}
