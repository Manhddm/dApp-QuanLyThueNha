import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatOasis(value: number | string | bigint): string {
    let numStr = "";
    if (typeof value === "bigint") {
        numStr = formatEther(value);
    } else {
        numStr = value.toString();
    }
    const num = parseFloat(numStr);
    if (isNaN(num)) return "0";
    // Giữ tối đa 3 số sau dấu phẩy và xóa số 0 thừa
    return parseFloat(num.toFixed(3)).toString();
}
