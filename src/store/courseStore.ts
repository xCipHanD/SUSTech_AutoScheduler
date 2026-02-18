import { reactive, watch } from 'vue';
import type { Course, CourseBundle } from '../types';
import { getBaseCourseId, isLabId } from '@/utils/courseRelation';

const STORAGE_KEY = 'sustech-course-selection';

// 从 localStorage 加载已选课程
function loadSelectedCourses (): Course[] {
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
function saveSelectedCourses (courses: Course[]) {
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

    toggleCourseSelection (course: Course) {
        const index = this.selectedCourses.findIndex(c => c.id === course.id);
        if (index > -1) {
            this.selectedCourses.splice(index, 1);
        } else {
            // Add new course with active state true by default
            this.selectedCourses.push({ ...course, active: true });
        }
        saveSelectedCourses(this.selectedCourses);
    },

    isSelected (course: Course) {
        return this.selectedCourses.some(c => c.id === course.id);
    },

    toggleCourseActive (courseId: string, isActive: boolean) {
        const course = this.selectedCourses.find(c => c.id === courseId);
        if (course) {
            course.active = isActive;

            const baseId = getBaseCourseId(courseId);

            if (isActive) {
                // Turning on a lecture turns on all its labs
                if (!isLabId(courseId)) {
                    this.selectedCourses.forEach(c => {
                        if (isLabId(c.id) && getBaseCourseId(c.id) === baseId) {
                            c.active = true;
                        }
                    });
                }

                // Turning on a lab turns on its lecture
                if (isLabId(courseId)) {
                    const lecture = this.selectedCourses.find(c => !isLabId(c.id) && c.id === baseId);
                    if (lecture) lecture.active = true;
                }
            } else {
                // Turning off a lecture turns off its labs
                if (!isLabId(courseId)) {
                    this.selectedCourses.forEach(c => {
                        if (isLabId(c.id) && getBaseCourseId(c.id) === baseId) {
                            c.active = false;
                        }
                    });
                }

                // Turning off a lab: if no other active labs remain, also turn off the lecture
                if (isLabId(courseId)) {
                    const hasOtherActiveLab = this.selectedCourses.some(c => isLabId(c.id) && getBaseCourseId(c.id) === baseId && c.id !== courseId && c.active !== false);
                    if (!hasOtherActiveLab) {
                        const lecture = this.selectedCourses.find(c => !isLabId(c.id) && c.id === baseId);
                        if (lecture) lecture.active = false;
                    }
                }
            }
        }
        saveSelectedCourses(this.selectedCourses);
    },

    setResults (results: CourseBundle[][]) {
        this.scheduleResults = results;
        this.currentResultIndex = 0;
    },

    clearSelection () {
        this.selectedCourses.splice(0, this.selectedCourses.length);
        saveSelectedCourses(this.selectedCourses);
    }
});

// 监听 selectedCourses 的变化,自动保存
watch(() => store.selectedCourses, (newCourses) => {
    saveSelectedCourses(newCourses);
}, { deep: true });
