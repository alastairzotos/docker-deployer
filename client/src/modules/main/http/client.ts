import axios from 'axios';
import { useAppState } from '../state';

class HttpClient {
  private readonly baseUrl = 'http://localhost:4042';

  constructor() {}

  async login(password: string): Promise<void> {
    const response = await axios.post(`${this.baseUrl}/login`, {
      password,
    });

    return response.data;
  }
}

export const httpClient = new HttpClient();
