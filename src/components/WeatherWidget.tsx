import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";

const tips = [
  "Good evening for a Danube walk 🌅",
  "Perfect day to explore Ruse.",
  "Cosy café weather — try Kafe Bulgaria.",
  "Bring a jacket near the river.",
];

export function WeatherWidget() {
  const [data, setData] = useState<{ temp: number; code: number } | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=43.8356&longitude=25.9657&current_weather=true")
      .then(r => r.json())
      .then(j => { if (alive && j?.current_weather) setData({ temp: Math.round(j.current_weather.temperature), code: j.current_weather.weathercode }); })
      .catch(() => { if (alive) setData({ temp: 19, code: 1 }); });
    return () => { alive = false; };
  }, []);
  const t = data?.temp ?? 19;
  const c = data?.code ?? 1;
  const Icon = c >= 71 ? Snowflake : c >= 51 ? CloudRain : c >= 2 ? Cloud : Sun;
  const desc = c >= 71 ? "Snowy" : c >= 51 ? "Rainy" : c >= 2 ? "Partly cloudy" : "Sunny";
  const tip = tips[t % tips.length];

  return (
    <div className="surface px-4 py-3 inline-flex items-center gap-3 bg-gradient-card">
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-sm font-semibold">{t}°C · {desc}</div>
        <div className="text-xs text-muted-foreground">{tip}</div>
      </div>
    </div>
  );
}
