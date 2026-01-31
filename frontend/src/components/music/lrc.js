// parseLrc: 解析 LRC 歌词为 [{time, text}] 的数组
export function parseLrc(lrcString) {
  if (!lrcString) return [];
  const lines = lrcString.split("\n");
  const result = [];
  // 匹配 [mm:ss.xx] 或 [mm:ss.xxx]
  const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  lines.forEach((line) => {
    const match = timeExp.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = parseInt(match[3]);
      // 如果ms是两位数，通常代表1/100秒，如果是三位则是1/1000
      const msVal = match[3].length === 2 ? ms * 10 : ms;
      const time = min * 60 + sec + msVal / 1000;
      const text = line.replace(timeExp, "").trim();
      if (text) result.push({ time, text });
    }
  });
  return result;
}