export const EUR_RATE = 1.96; // 1 EUR ≈ 1.96 лв
export const formatLv = (lv: number) => (lv === 0 ? "Free" : `${lv} лв`);
export const formatLvEur = (lv: number) =>
  lv === 0 ? "Free" : `${lv} лв · ≈ ${(lv / EUR_RATE).toFixed(1)} €`;
