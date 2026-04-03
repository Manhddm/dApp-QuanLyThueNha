import { getAllUsers, findUserById, updateUser, softDeleteUser, UpdateUserDTO } from "../models/userModel";

export const getListUserService = async (limit?: number, offset?: number, role?: string) => {
  return await getAllUsers(limit, offset, role);
};

export const getUserDetailService = async (id: number) => {
  const user = await findUserById(id);
  if (!user) throw new Error("Không tìm thấy người dùng");
  return user;
};

export const updateProfileService = async (id: number, data: UpdateUserDTO, currentUserId: number, currentUserRole: string) => {
  // Check permission: Admin can update anyone, User can only update themselves
  if (currentUserRole !== "admin" && id !== currentUserId) {
    throw new Error("Bạn không có quyền cập nhật người dùng này");
  }

  // Pre-check user existence
  const user = await findUserById(id);
  if (!user) throw new Error("Không tìm thấy người dùng");

  // Only Admin can change vai_tro or dang_hoat_dong
  if (currentUserRole !== "admin") {
    delete data.vai_tro;
    delete data.dang_hoat_dong;
  }

  const updatedUser = await updateUser(id, data);
  return updatedUser;
};

export const deleteUserService = async (id: number, currentUserId: number, currentUserRole: string) => {
  if (currentUserRole !== "admin") {
    throw new Error("Chỉ admin mới có quyền xóa người dùng");
  }

  if (id === currentUserId) {
    throw new Error("Không thể khóa tài khoản của chính mình được");
  }

  const user = await findUserById(id);
  if (!user) throw new Error("Không tìm thấy người dùng");

  const success = await softDeleteUser(id);
  if (!success) throw new Error("Xóa người dùng thất bại");
  return true;
};
