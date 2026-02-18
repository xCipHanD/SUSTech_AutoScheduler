import type { Course } from '@/types';

const LAB_SUFFIXES = ['A', 'B', 'C', 'D', 'E', 'F'];

export function isLabId (id: string): boolean {
    const suffix = id.slice(-1);
    return LAB_SUFFIXES.includes(suffix);
}

export function getBaseCourseId (id: string): string {
    return isLabId(id) ? id.slice(0, -1) : id;
}

export function hasCatalogLab (allCourses: Course[], lectureId: string): boolean {
    return allCourses.some(c => isLabId(c.id) && getBaseCourseId(c.id) === lectureId);
}

export function hasSelectedLab (selected: Course[], lectureId: string): boolean {
    return selected.some(c => isLabId(c.id) && getBaseCourseId(c.id) === lectureId);
}

export function hasSelectedLecture (selected: Course[], lectureId: string): boolean {
    return selected.some(c => !isLabId(c.id) && c.id === lectureId);
}
