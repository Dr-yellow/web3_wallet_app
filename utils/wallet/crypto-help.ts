import * as Crypto from "expo-crypto";
import CryptoJS from "crypto-js";

/**
 * 加密助记词
 * @param {string} mnemonic - 原始助记词
 * @param {string} pin - 用户设置的 6 位 PIN
 */
export const encryptMnemonic = async (
  mnemonic: string,
  pin: string
): Promise<{ encryptedData: string; salt: string }> => {
  // 1. 生成一个随机盐值 (Salt)，增加破解难度
  const salt = await Crypto.getRandomBytesAsync(16);
  const saltString = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 2. 将 PIN + Salt 转化为强密钥 (使用 SHA256)
  const key = CryptoJS.SHA256(pin + saltString).toString();

  // 3. 使用 AES 加密
  const encrypted = CryptoJS.AES.encrypt(mnemonic, key).toString();

  // 返回密文和盐值（这两个都需要存入 SecureStore）
  return {
    encryptedData: encrypted,
    salt: saltString,
  };
};

/**
 * 解密助记词
 * @param {string} encryptedData - 存储的密文
 * @param {string} pin - 用户输入的 PIN
 * @param {string} salt - 存储的盐值
 */
export const decryptMnemonic = (
  encryptedData: string,
  pin: string,
  salt: string
): string | null => {
  try {
    // 1. 用同样的 PIN 和 Salt 重建密钥
    const key = CryptoJS.SHA256(pin + salt).toString();

    // 2. AES 解密
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (!originalText) throw new Error("解密失败，PIN 码可能错误");

    return originalText; // 返回原始助记词
  } catch (error) {
    return null;
  }
};
