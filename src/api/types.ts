export interface Project {
	id: number;
	uuid: string;
	createdAt: string;
	updatedAt: string;
	state: string;
	ownerId: number;
	title: string;
	description: string;
	phase: string;
	startingBalance: {
		word: number;
		time: number;
		page: number;
		chapter: number;
		scene: number;
		line: number;
	};
	cover: string;
	starred: boolean;
	displayOnProfile: boolean;
	totals?: {
		word: number;
		time: number;
		page: number;
		chapter: number;
		scene: number;
		line: number;
	};
	lastUpdated?: string;
}

export interface Tally {
	id: number;
	uuid: string;
	createdAt: string;
	updatedAt: string;
	state: string;
	ownerId: number;
	date: string;
	measure: string;
	count: number;
	note: string;
	workId: number;
	work: Project;
	tags: Tag[];
}

export interface Tag {
	id: number;
	uuid: string;
	createdAt: string;
	updatedAt: string;
	state: string;
	ownerId: number;
	name: string;
	color: string;
}

export interface CreateTallyRequest {
	date: string;
	measure: string;
	count: number;
	note?: string;
	workId: number;
	setTotal: boolean;
	tags?: string[];
}

export interface UpdateTallyRequest {
	date?: string;
	measure?: string;
	count?: number;
	note?: string;
	workId?: number;
	setTotal?: boolean;
	tags?: string[];
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	code?: string;
	message?: string;
}
