export function formatPeriodNumber(value?: number | string) {
  if (!value) return "-";

  return "#" + value.toString().padStart(6, "0");
}
export function formatNumberToPrecision(value: number | string, precision?: number) {
  var [integerPart, decimalPart = ""] = Number(value).toString().split(".");

  if (precision && precision > 0) decimalPart = decimalPart.slice(0, precision);

  return [integerPart, decimalPart];
}

interface FormatOptions {
  precision?: number; // 小数点精度
  prefix?: string; // 前缀
  suffix?: string; // 后缀
  pad?: boolean; // 是否填充
  absolute?: boolean; // 是否取绝对值
}

export function formatDelimiter(value?: number | string | null, options?: FormatOptions) {
  if (value === null || value === undefined || (typeof value === "number" && isNaN(value))) return "-";

  const { precision = 0, prefix = "", suffix = "", pad, absolute } = options ?? {};
  var [integerPart, decimalPart = ""] = formatNumberToPrecision(absolute ? Math.abs(Number(value)) : value, precision);

  integerPart = Number(integerPart).toLocaleString("en-US");

  if (precision > 0 && pad) {
    value = integerPart + "." + decimalPart.padEnd(precision, "0");
  } else {
    value = integerPart + (decimalPart ? "." + decimalPart : decimalPart);
  }

  return prefix + value + suffix;
}

export function formatTokenAmount(value?: number | string | null, options?: FormatOptions) {
  if (Number(value) > 1) {
    return formatDelimiter(value, { precision: 2, ...options });
  }

  return formatDelimiter(value, { precision: 8, ...options });
}

export function formatBignumber(value?: number | string | null, options?: FormatOptions) {
  const num = Number(value);
  const absNum = Math.abs(num);

  if (absNum - 1e13 >= 0) {
    return formatDelimiter(num / 1e12, { precision: 2, ...options }) + "T";
  }

  if (absNum - 1e10 >= 0) {
    return formatDelimiter(num / 1e9, { precision: 2, ...options }) + "B";
  }

  if (absNum - 1e7 >= 0) {
    return formatDelimiter(num / 1e6, { precision: 2, ...options }) + "M";
  }

  if (absNum - 1e4 >= 0) {
    return formatDelimiter(num / 1e3, { precision: 2, ...options }) + "K";
  }

  if (absNum > 1) {
    return formatDelimiter(value, { precision: 2, ...options });
  }

  return formatDelimiter(value, { precision: 8, ...options });
}

export interface NumberOptions {
  precision?: number;
  isBignumber?: boolean;
}

export function formatNumber(value?: number | string | null, options?: NumberOptions) {
  const { isBignumber, ...other } = options ?? {};

  if (isBignumber) return formatBignumber(value, other);

  return formatDelimiter(value, other);
}

export function forMatNumberDecial(num: number): string {
  if (!Number.isFinite(num)) return "0";

  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatted;
}
