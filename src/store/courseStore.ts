import { reactive, watch } from 'vue';
import type { Course, CourseBundle } from '../types';

const STORAGE_KEY = 'sustech-course-selection';

// 从 localStorage 加载已选课程
function loadSelectedCourses(): Course[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load selected courses from localStorage:', error);
    }
    return [];
}

// 保存已选课程到 localStorage
function saveSelectedCourses(courses: Course[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (error) {
        console.error('Failed to save selected courses to localStorage:', error);
    }
}

export const store = reactive({
    selectedCourses: loadSelectedCourses() as Course[],
    scheduleResults: [] as CourseBundle[][],
    currentResultIndex: 0,

    toggleCourseSelection(course: Course) {
        const index = this.selectedCourses.findIndex(c => c.id === course.id);
        if (index > -1) {
            this.selectedCourses.splice(index, 1);
        } else {
            // Add new course with active state true by default
            this.selectedCourses.push({ ...course, active: true });
        }
        saveSelectedCourses(this.selectedCourses);
    },

    isSelected(course: Course) {
        return this.selectedCourses.some(c => c.id === course.id);
    },

    toggleCourseActive(courseId: string, isActive: boolean) {
        const course = this.selectedCourses.find(c => c.id === courseId);
        if (course) {
            course.active = isActive;
        }
        saveSelectedCourses(this.selectedCourses);
    },

    setResults(results: CourseBundle[][]) {
        this.scheduleResults = results;
        this.currentResultIndex = 0;
    },

    clearSelection() {
        this.selectedCourses.splice(0, this.selectedCourses.length);
        saveSelectedCourses(this.selectedCourses);
    }
});

// 监听 selectedCourses 的变化,自动保存
watch(() => store.selectedCourses, (newCourses) => {
    saveSelectedCourses(newCourses);
}, { deep: true });
