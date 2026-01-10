import type { Course } from '@/types';

let cachedCourses: Course[] | null = null;

export async function fetchCourses(): Promise<Course[]> {
    if (cachedCourses) return cachedCourses;
    try {
        const response = await fetch('/lessons.json');
        if (!response.ok) {
            throw new Error('Failed to load lessons');
        }
        const data = await response.json();
        // Initialize active state
        cachedCourses = data.map((c: any) => ({ ...c, active: true }));
        return cachedCourses!;
    } catch (e) {
        console.error(e);
        return [];
    }
}
