/**
 * 获取UTC+8时区的当前年份
 * @returns 当前年份
 */
export function getUTC8Year(): number {
  const now = new Date();
  // 获取UTC时间的毫秒数
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  // 加上8小时（UTC+8）
  const utc8Time = new Date(utcTime + 8 * 3600000);
  return utc8Time.getFullYear();
}

/**
 * 获取UTC+8时区的当前日期对象
 * @returns Date对象
 */
export function getUTC8Date(): Date {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcTime + 8 * 3600000);
}
