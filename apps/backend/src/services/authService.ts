import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import { findUserByWalletAddress, createUserFromWallet, NguoiDung } from "../models/userModel";
import { createError } from "../middlewares/errorHandler";
import { randomNonce, saveNonce, takeNonce } from "./nonceStore";

const SALT_ROUNDS = 12;

export function buildLoginMessage(address: string, nonce: string, issuedAt: string): string {
  return `QuanLyThueNha đăng nhập\n\nĐịa chỉ: ${address}\nNonce: ${nonce}\nIssued at: ${issuedAt}`;
}

/** Chữ ký ECDSA sau personal_sign: 0x + 130 ký tự hex (65 byte). */
function assertValidPersonalSignSignature(signature: string): void {
  const s = signature.trim();
  if (!/^0x[a-fA-F0-9]{130}$/.test(s)) {
    throw createError(
      "signature không hợp lệ: cần chuỗi ký từ ví (personal_sign), dài ~132 ký tự bắt đầu 0x — không dùng địa chỉ ví làm signature.",
      400
    );
  }
}

/** Chuẩn hóa địa chỉ EIP-55; throw nếu không hợp lệ. */
export function normalizeAddress(raw: string): string {
  try {
    return ethers.getAddress(raw.trim());
  } catch {
    throw createError("Địa chỉ ví không hợp lệ", 400);
  }
}

export const requestWalletNonce = async (rawAddress: string) => {
  const address = normalizeAddress(rawAddress);
  const nonce = randomNonce();
  const issuedAt = new Date().toISOString();
  saveNonce(address, nonce, issuedAt);
  const message = buildLoginMessage(address, nonce, issuedAt);
  return { message, address };
};

function signJwt(user: NguoiDung): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw createError("Lỗi cấu hình JWT_SECRET", 500);

  return jwt.sign(
    {
      ma_nguoi_dung: user.ma_nguoi_dung,
      email: user.email,
      vai_tro: user.vai_tro,
    },
    secret,
    { expiresIn: "7d" }
  );
}

export const loginWithWalletSignature = async (
  rawAddress: string,
  message: string,
  signature: string
) => {
  const address = normalizeAddress(rawAddress);
  assertValidPersonalSignSignature(signature);

  let recovered: string;
  try {
    recovered = ethers.verifyMessage(message, signature);
  } catch {
    throw createError("Không verify được chữ ký. Kiểm tra message đúng 100% với bước nonce.", 400);
  }
  if (recovered.toLowerCase() !== address.toLowerCase()) {
    throw createError("Chữ ký không khớp với địa chỉ ví", 401);
  }

  const stored = takeNonce(address);
  if (!stored) {
    throw createError("Nonce hết hạn hoặc đã sử dụng. Yêu cầu nonce mới.", 401);
  }

  const expected = buildLoginMessage(address, stored.nonce, stored.issuedAt);
  if (message !== expected) {
    throw createError("Nội dung tin nhắn đăng nhập không hợp lệ", 401);
  }

  let user = await findUserByWalletAddress(address);

  if (!user) {
    const randomPw = crypto.randomBytes(32).toString("hex");
    const mat_khau_hash = await bcrypt.hash(randomPw, SALT_ROUNDS);
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
    const email = `${address.toLowerCase()}@wallet.local`;
    user = await createUserFromWallet({
      dia_chi_vi: address,
      ho_ten: `Người dùng ${short}`,
      email,
      mat_khau_hash,
    });
  }

  const token = signJwt(user);

  return {
    token,
    user: {
      ma_nguoi_dung: user.ma_nguoi_dung,
      ho_ten: user.ho_ten,
      email: user.email,
      vai_tro: user.vai_tro,
      da_xac_thuc: user.da_xac_thuc,
      dia_chi_vi: user.dia_chi_vi ?? address,
    },
  };
};
