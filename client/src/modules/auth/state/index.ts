import create from 'zustand';
import { message } from 'antd';
import { CallStatus } from "../../common/models";
import { httpClient } from '../../http/client';

const authTokenKey = 'mctrl-auth-token';

export interface AuthStateValues {
  authToken: string | null;
  loginStatus: CallStatus | null;
}

export interface AuthStateActions {
  login: (password: string) => void;
}

export type AuthState = AuthStateValues & AuthStateActions;

const initialState: AuthStateValues = {
  authToken: localStorage.getItem(authTokenKey) || null,
  loginStatus: null
};

export const useAuthState = create<AuthState>(set => ({
  ...initialState,

  login: async password => {
    set({ loginStatus: 'fetching' });

    try {
      const jwt = await httpClient.login(password);
      set({
        loginStatus: 'success',
        authToken: jwt!
      });

      localStorage.setItem(authTokenKey, jwt!);
      message.success('Access granted');
      await httpClient.triggerBroadcast();
    } catch (e) {
      set({ loginStatus: 'error' });
    }
  },
}));
