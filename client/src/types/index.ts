export interface AIAnalysisResponse {
    isCorrect: boolean;
    feedback: string;
    hints: string[];
    warnings: string[];
    correctedQuery?: string | null;
    explanation: string;
}

export interface TheorySection {
    title: string;
    content: string;         // Markdown-like text
    codeExample?: string;    // SQL code block
    imageUrl?: string;
}

export interface Exercise {
    id: string;
    title: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    schema: string;
    initialCode: string;
    solution?: string;
    hint?: string;
    imageUrl?: string;
}

export interface TechnicalTest {
    id: string;
    title: string;
    description: string;
    questions: TestQuestion[];
}

export interface TestQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface Module {
    id: string;
    title: string;
    description: string;
    icon: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    theory: TheorySection[];
    exercises: Exercise[];
    test?: TechnicalTest;
}

export interface User {
    id: number;
    email: string;
    name: string;
}
