import { ReactNode } from 'react';
export interface User {
    ma_nguoi_dung: number;
    ho_ten: string;
    email: string;
    vai_tro: string;
    dia_chi_vi?: string;
    so_dien_thoai?: string;
    so_cccd?: string;
    da_xac_thuc?: boolean;
}
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUserContext: (user: User) => void;
    loading: boolean;
}
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextType;
export {};
