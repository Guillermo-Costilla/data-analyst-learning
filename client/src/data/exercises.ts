import type { Exercise, Module } from '../types';
import { modulesBasicos } from './modules-basicos';
import { modulesConsultas } from './modules-consultas';
import { modulesAnalitica } from './modules-analitica';

export const modules: Module[] = [
    ...modulesBasicos,
    ...modulesConsultas,
    ...modulesAnalitica,
];

export const getAllExercises = (): Exercise[] =>
    modules.flatMap((m) => m.exercises);

export const getExerciseById = (id: string): Exercise | undefined =>
    getAllExercises().find((e) => e.id === id);

export const getModuleById = (id: string): Module | undefined =>
    modules.find((m) => m.id === id);
