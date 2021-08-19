import axios from 'axios';
import { useAuthState } from '../auth/state';
import { ContainerStats } from '../containers/models';

class HttpClient {
  private readonly baseUrl = `${window.location.protocol}//${window.location.hostname}:4042`;

  async login(password: string): Promise<void> {
    const response = await axios.post(`${this.baseUrl}/login`, {
      password,
    });

    return response.data;
  }

  async triggerBroadcast() {
    await axios.post(`${this.baseUrl}/trigger-broadcast`, {}, {
      headers: {
        authorization: `Bearer ${useAuthState.getState().authToken}`
      }
    });
  }

  async getContainerStats(id: string) {
    await axios.get<ContainerStats>(`${this.baseUrl}/get-stats?id=${id}`, {
      headers: {
        authorization: `Bearer ${useAuthState.getState().authToken}`
      }
    })
  }

  async getContainerLogs(id: string) {
    await axios.get<string[]>(`${this.baseUrl}/get-logs?id=${id}`, {
      headers: {
        authorization: `Bearer ${useAuthState.getState().authToken}`
      }
    })
  }
}

export const httpClient = new HttpClient();
