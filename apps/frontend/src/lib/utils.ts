import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatOasis(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return "0";
    // Giữ tối đa 3 số sau dấu phẩy và xóa số 0 thừa
    return parseFloat(num.toFixed(3)).toString();
}
