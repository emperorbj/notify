const API_BASE_URL = 'http://localhost:5000/api';

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  isPinned?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
  category?: string;
  isPinned?: boolean;
}

export interface NotesResponse {
  success: boolean;
  data: Note[];
  count: number;
}

export interface NoteResponse {
  success: boolean;
  data: Note;
}

export const notesApi = {
  async getAll(params?: {
    category?: string;
    tag?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<NotesResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    
    const url = `${API_BASE_URL}/notes${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  async getById(id: string): Promise<NoteResponse> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch note');
    return response.json();
  },

  async create(data: CreateNoteData): Promise<NoteResponse> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create note');
    return response.json();
  },

  async update(id: string, data: UpdateNoteData): Promise<NoteResponse> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update note');
    return response.json();
  },

  async delete(id: string): Promise<NoteResponse> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete note');
    return response.json();
  },
};
