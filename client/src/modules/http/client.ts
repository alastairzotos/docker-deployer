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
    const stats = await axios.get<ContainerStats>(`${this.baseUrl}/get-stats?id=${id}`, {
      headers: {
        authorization: `Bearer ${useAuthState.getState().authToken}`
      }
    })

    return stats.data;
  }

  async getContainerLogs(id: string) {
    const logs = await axios.get<string[]>(`${this.baseUrl}/get-logs?id=${id}`, {
      headers: {
        authorization: `Bearer ${useAuthState.getState().authToken}`
      }
    })

    return logs.data;
  }
}

export const httpClient = new HttpClient();
