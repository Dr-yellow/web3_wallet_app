/**
 * EVM 钱包工具
 * 支持从助记词或私钥创建/导入 EVM 钱包
 */
import { HDKey } from "@scure/bip32";

import * as bip39 from "bip39";
import { ethers } from "ethers";
import { bytesToHex } from "viem";

export interface EVMWallet {
  address: string;
  privateKey: string;
  mnemonic?: string;
  chainId: number;
}

/**
 * 生成新的助记词（12 或 24 词）
 */
export function generateMnemonic(strength: 128 | 256 = 128): string {
  return bip39.generateMnemonic(strength);
}

/**
 * 从助记词创建 EVM 钱包
 * @param mnemonic 助记词
 * @param chainId 链 ID
 * @param index 派生路径索引（默认 0）
 */
export function createWalletFromMnemonic(
  mnemonic: string,
  chainId: number,
  index: number = 0
): EVMWallet {
  // 验证助记词
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic");
  }

  try {
    // EVM 标准派生路径: m/44'/60'/0'/0/index
    const path = `m/44'/60'/0'/0/${index}`;
    // ethers v6 使用 HDNodeWallet.fromPhrase
    const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, path);

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic,
      chainId,
    };
  } catch (error: any) {
    throw new Error(
      `Failed to create wallet from mnemonic: ${error?.message || error}`
    );
  }
}

/**
 * 从私钥创建钱包
 */
export function createWalletFromPrivateKey(
  privateKey: string,
  chainId: number
): EVMWallet {
  // 确保私钥格式正确（移除 0x 前缀如果存在）
  const cleanPrivateKey = privateKey.startsWith("0x")
    ? privateKey.slice(2)
    : privateKey;

  try {
    const wallet = new ethers.Wallet(`0x${cleanPrivateKey}`);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      chainId,
    };
  } catch (error) {
    throw new Error(`Invalid private key: ${error}`);
  }
}

/**
 * 验证助记词
 */
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * 验证私钥格式
 */
export function validatePrivateKey(privateKey: string): boolean {
  try {
    const cleanPrivateKey = privateKey.startsWith("0x")
      ? privateKey.slice(2)
      : privateKey;
    if (cleanPrivateKey.length !== 64) {
      return false;
    }
    // 尝试创建钱包验证
    new ethers.Wallet(`0x${cleanPrivateKey}`);
    return true;
  } catch {
    return false;
  }
}

interface EvmAddressResult {
  index: number;
  path: string;
  address: string;
  encryptedPrivateKey: string;
  salt: string;
}

export function derivePrivateKey(seed: Uint8Array, path: string): string {
  const hdkey = HDKey.fromMasterSeed(seed);
  const child = hdkey.derive(path);

  if (!child.privateKey) {
    throw new Error("derive failed");
  }

  return bytesToHex(child.privateKey);
}
