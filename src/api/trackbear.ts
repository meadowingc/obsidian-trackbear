import { requestUrl } from 'obsidian';
import { Project, Tally, CreateTallyRequest, UpdateTallyRequest, ApiResponse } from './types';

export class TrackBearClient {
	private apiKey: string;
	private baseUrl = 'https://trackbear.app/api/v1';

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private async request<T>(
		endpoint: string,
		options: {
			method?: string;
			body?: string;
		} = {}
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		try {
			const response = await requestUrl({
				url,
				method: options.method || 'GET',
				headers: {
					'Authorization': `Bearer ${this.apiKey}`,
					'Content-Type': 'application/json',
					'User-Agent': 'obsidian-trackbear-plugin/1.0',
				},
				body: options.body,
				throw: false, // Don't throw on non-2xx status codes
			});

			const data = response.json as ApiResponse<T>;

			if (!data.success) {
				// API returns error in different formats
				const errorMsg = data.message || data.error?.message || 'API request failed';
				const errorCode = data.code || data.error?.code || 'UNKNOWN';
				console.error('TrackBear API Error:', { code: errorCode, message: errorMsg, fullResponse: data });
				throw new Error(`${errorMsg} (${errorCode})`);
			}

			return data.data as T;
		} catch (error) {
			// This should only happen for network errors now, not HTTP errors
			console.error('TrackBear Network Error:', error);
			throw new Error(error.message || 'Network error');
		}
	}

	async listProjects(): Promise<Project[]> {
		return this.request<Project[]>('/project');
	}

	async listTallies(projectId?: number, date?: string): Promise<Tally[]> {
		let url = '/tally';
		const params = new URLSearchParams();
		if (projectId) params.append('workId', projectId.toString());
		if (date) params.append('date', date);
		if (params.toString()) url += `?${params.toString()}`;
		return this.request<Tally[]>(url);
	}

	async createTally(data: CreateTallyRequest): Promise<Tally> {
		return this.request<Tally>('/tally', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateTally(tallyId: number, data: UpdateTallyRequest): Promise<Tally> {
		return this.request<Tally>(`/tally/${tallyId}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
	}

	async findTallyByFileAndDate(
		projectId: number,
		fileId: string,
		date: string
	): Promise<Tally | null> {
		const tallies = await this.listTallies(projectId, date);
		return tallies.find(t =>
			t.note?.includes(`file:${fileId}`) &&
			t.date === date
		) || null;
	}
}
