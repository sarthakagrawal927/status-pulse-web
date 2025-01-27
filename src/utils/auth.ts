import { API_FUNCTIONS } from "@/lib/api";
import { removeToken } from "@/lib/token";

export const handleLogout = async () => {
  await API_FUNCTIONS.logout();
  removeToken();
  window.location.href = "/login";
};
