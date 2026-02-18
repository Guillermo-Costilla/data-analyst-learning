import type { AIAnalysisResponse } from '../types';

const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api');

export const aiApi = {
    analyzeSql: async (payload: {
        userSql: string;
        exercisePrompt: string;
        exerciseLevel: string;
        schema: string;
    }): Promise<AIAnalysisResponse> => {
        const response = await fetch(`${API_URL}/ai/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to analyze SQL');
        }

        return response.json();
    },
};
