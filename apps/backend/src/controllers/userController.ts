import { Response, NextFunction } from "express";
import { getListUserService, getUserDetailService, updateProfileService, deleteUserService } from "../services/userService";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const role = req.query.vai_tro as string | undefined;

    const data = await getListUserService(limit, offset, role);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const data = await getUserDetailService(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.user!.ma_nguoi_dung;
    const data = await getUserDetailService(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const currentUserId = req.user!.ma_nguoi_dung;
    const currentUserRole = req.user!.vai_tro;

    const data = await updateProfileService(id, req.body, currentUserId, currentUserRole);
    res.json({ success: true, message: "Cập nhật thành công", data });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user!.ma_nguoi_dung;
    const currentUserRole = req.user!.vai_tro;

    // Gọi service với id = currentUserId
    const data = await updateProfileService(currentUserId, req.body, currentUserId, currentUserRole);
    res.json({ success: true, message: "Cập nhật hồ sơ cá nhân thành công", data });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const currentUserId = req.user!.ma_nguoi_dung;
    const currentUserRole = req.user!.vai_tro;

    await deleteUserService(id, currentUserId, currentUserRole);
    res.json({ success: true, message: "Khóa/xóa người dùng thành công" });
  } catch (error) {
    next(error);
  }
};
