import type { Course } from '@/types';

/**
 * 解析课程时间代码,判断课程是否在指定时间段
 * @param course 课程对象
 * @param week 周次 (1=单周, 2=双周)
 * @param day 星期 (1-7)
 * @param slotIndex 时间段索引 (0-5)
 * @returns 如果课程在该时间段则返回true
 */
export function isCourseAtTime(
    course: Course,
    week: number,
    day: number,
    slotIndex: number
): boolean {
    if (!course.time) return false;

    for (const t of course.time) {
        // New format: XYZW (4 hex digits)
        // X = week (0=both, 1=odd, 2=even)
        // Y = day (1-7, 0=7 for Sunday)
        // Z = start slot (1-B in hex, where B=11)
        // W = end slot (1-B in hex, where B=11)

        if (t.length !== 4) continue;

        const w = t.charAt(0);
        const dStr = t.slice(1, 2);
        const startStr = t.slice(2, 3);
        const endStr = t.slice(3, 4);

        const matchOdd = (week === 1) && (w === '1' || w === '0');
        const matchEven = (week === 2) && (w === '2' || w === '0');

        if (!matchOdd && !matchEven) continue;

        const d = parseInt(dStr, 10);
        const dayNum = (d === 0) ? 7 : d;

        if (dayNum !== day) continue;

        // Parse hex for start and end slots (A=10, B=11, etc.)
        const startSlot = parseInt(startStr, 16);
        const endSlot = parseInt(endStr, 16);

        // Convert slot number to row index
        // Slots 1-2 -> row 0, 3-4 -> row 1, 5-6 -> row 2, 7-8 -> row 3, 9-10 -> row 4, 11-11 -> row 5
        const startRow = Math.floor((startSlot - 1) / 2);
        const endRow = Math.floor((endSlot - 1) / 2);

        // Check if current slotIndex falls within the range
        if (slotIndex >= startRow && slotIndex <= endRow) {
            return true;
        }
    }
    return false;
}

/**
 * 在课程列表中查找指定时间段的课程
 */
export function findCourseAtTime(
    courses: Course[],
    week: number,
    day: number,
    slotIndex: number
): Course | undefined {
    return courses.find(course => isCourseAtTime(course, week, day, slotIndex));
}
