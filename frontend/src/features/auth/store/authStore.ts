import { create } from "zustand";

import type {
  User,
} from "../types/auth.types";

type AuthState = {
  user: User | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  login: (
    user: User,
    token: string,
  ) => void;

  logout: () => void;
  
  updateUser: (updates: Partial<User>) => void;
};

const getInitialState = () => {
  try {
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        user,
        accessToken: token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error("Failed to parse stored auth user:", error);
  }
  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };
};

const initialState = getInitialState();

export const useAuthStore =
  create<AuthState>(
    (set) => ({
      /*
       =========================
       INITIAL STATE
       =========================
      */

      ...initialState,

      /*
       =========================
       LOGIN
       =========================
      */

      login: (
        user,
        token,
      ) => {
        /*
         =========================
         SAVE LOCAL STORAGE
         =========================
        */

        localStorage.setItem(
          "accessToken",
          token,
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user),
        );

        /*
         =========================
         UPDATE STORE
         =========================
        */

        set({
          user,

          accessToken:
            token,

          isAuthenticated: true,
        });
      },

      /*
       =========================
       LOGOUT
       =========================
      */

      logout: () => {
        localStorage.removeItem(
          "accessToken",
        );

        localStorage.removeItem(
          "user",
        );

        set({
          user: null,

          accessToken: null,

          isAuthenticated: false,
        });
      },

      /*
       =========================
       UPDATE USER
       =========================
      */
      updateUser: (updates) => {
        set((state) => {
          if (!state.user) return state;
          
          const updatedUser = { ...state.user, ...updates };
          
          localStorage.setItem("user", JSON.stringify(updatedUser));
          
          return {
            ...state,
            user: updatedUser
          };
        });
      },
    }),
  );