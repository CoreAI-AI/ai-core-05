// src/utils/usageLimits.ts

export type ModeType = "chat" | "study" | "image" | "code";

interface UsageData {
  dailyChatsUsed: number;
  premium: boolean;
  lastResetDate: string;

  modeUsage: {
    chat: number;
    study: number;
    image: number;
    code: number;
  };
}

const STORAGE_KEY = "coreai_usage_data";

const DEFAULT_DATA: UsageData = {
  dailyChatsUsed: 0,
  premium: false,
  lastResetDate: new Date().toDateString(),

  modeUsage: {
    chat: 0,
    study: 0,
    image: 0,
    code: 0,
  },
};

// ✅ GET DATA
export function getUsageData(): UsageData {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_DATA)
    );

    return DEFAULT_DATA;
  }

  const data: UsageData = JSON.parse(saved);

  checkDailyReset(data);

  return data;
}

// ✅ SAVE DATA
export function saveUsageData(data: UsageData) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

// ✅ DAILY RESET
export function checkDailyReset(data: UsageData) {

  const today = new Date().toDateString();

  if (data.lastResetDate !== today) {

    data.dailyChatsUsed = 0;

    data.modeUsage = {
      chat: 0,
      study: 0,
      image: 0,
      code: 0,
    };

    data.lastResetDate = today;

    saveUsageData(data);
  }
}

// ✅ CHAT LIMIT CHECK
export function canUseChat(): boolean {

  const data = getUsageData();

  if (data.premium) return true;

  return data.dailyChatsUsed < 20;
}

// ✅ MODE LIMIT CHECK
export function canUseMode(
  mode: ModeType
): boolean {

  const data = getUsageData();

  if (data.premium) return true;

  return data.modeUsage[mode] < 5;
}

// ✅ INCREASE CHAT COUNT
export function increaseChatCount() {

  const data = getUsageData();

  data.dailyChatsUsed += 1;

  saveUsageData(data);
}

// ✅ INCREASE MODE COUNT
export function increaseModeCount(
  mode: ModeType
) {

  const data = getUsageData();

  data.modeUsage[mode] += 1;

  saveUsageData(data);
}
