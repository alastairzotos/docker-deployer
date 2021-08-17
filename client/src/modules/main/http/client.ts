import axios from 'axios';
import { useAppState } from '../state';

class HttpClient {
  private readonly baseUrl = `${window.location.protocol}//${window.location.hostname}:4042`;

  constructor() {}

  async login(password: string): Promise<void> {
    const response = await axios.post(`${this.baseUrl}/login`, {
      password,
    });

    return response.data;
  }

  async triggerBroadcast() {
    await axios.post(`${this.baseUrl}/trigger-broadcast`, {}, {
      headers: {
        authorization: `Bearer ${useAppState.getState().authToken}`
      }
    });
  }
}

export const httpClient = new HttpClient();
