import type { Course, CourseBundle } from '@/types';

export const TIME_SLOTS = [
    '第一、二节 (8:00-9:50)',
    '第三、四节 (10:20-12:10)',
    '第五、六节 (14:00-15:50)',
    '第七、八节 (16:20-18:10)',
    '第九、十节 (19:00-20:50)',
    '第十一节 (21:00-21:50)'
];

export const WEEK_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

function isExperiment(course: Course, selectedMap: Map<string, Course>): boolean {
    const last = course.id.charAt(course.id.length - 1);

    if (last >= '0' && last <= '9') return false;

    // Check if base ID exists in selection
    const baseId = course.id.slice(0, -1);
    return selectedMap.has(baseId);
}

// Check conflict between time arrays
// Returns true if NO conflict
function checkConflict(times: string[], used: Set<string>): boolean {
    for (const t of times) {
        if (used.has(t)) return false;
    }
    return true;
}

export function arrangeSchedule(coursesInput: Course[]): CourseBundle[][] {
    const activeCourses = coursesInput.filter(c => c.active !== false);
    const selectedMap = new Map(activeCourses.map(c => [c.id, c]));

    // Group by Course Name (kcmc)
    // Map<kcmc, List<Bundle>>
    const bundlesByName: Record<string, CourseBundle[]> = {};
    const selectedExperiments: Course[] = [];

    // Identify experiments vs main courses
    const mainCourses: Course[] = [];
    for (const c of activeCourses) {
        if (isExperiment(c, selectedMap)) {
            selectedExperiments.push(c);
        } else {
            mainCourses.push(c);
        }
    }

    for (const course of mainCourses) {
        const key = course.kcmc;
        if (!bundlesByName[key]) bundlesByName[key] = [];

        // Find experiments that start with this course's ID
        const matchingExps = selectedExperiments.filter(exp => exp.id.startsWith(course.id));

        if (matchingExps.length > 0) {
            for (const exp of matchingExps) {
                bundlesByName[key].push([course, exp]);
            }
        } else {
            bundlesByName[key].push([course]);
        }
    }

    const ks = Object.keys(bundlesByName);
    if (ks.length === 0) return [];

    ks.forEach(k => {
        const list = bundlesByName[k];
        if (list) {
            list.sort((b1, b2) => {
                const t1 = b1.reduce((s, c) => s + (c.time?.length || 0), 0);
                const t2 = b2.reduce((s, c) => s + (c.time?.length || 0), 0);
                return t1 - t2;
            });
        }
    });

    let results: CourseBundle[][] = [];
    const used = new Set<string>();
    const picked: CourseBundle[] = [];

    // Backtracking
    function backtrack(i: number) {
        if (results.length >= 100) return; // Limit results
        if (i === ks.length) {
            // copy
            results.push(picked.map(b => [...b]));
            return;
        }

        const name = ks[i];
        if (!name) return;
        const options = bundlesByName[name];
        if (!options) return;

        for (const bundle of options) {
            // Check conflict
            let ok = true;
            for (const c of bundle) {
                if (!checkConflict(c.time || [], used)) {
                    ok = false;
                    break;
                }
            }
            if (!ok) continue;
            // Apply
            picked.push(bundle);
            for (const c of bundle) {
                (c.time || []).forEach((t: string) => used.add(t));
            }

            backtrack(i + 1);

            // Backtrack
            for (const c of bundle) {
                (c.time || []).forEach((t: string) => used.delete(t));
            }
            picked.pop();
            picked.pop();

            if (results.length >= 100) return;
        }
    }

    backtrack(0);

    // Fallback: Skip courses if no result
    if (results.length === 0) {
        // Try skipping 1, then 2...
        const MAX_RESULTS = 10;

        const dfsWithSkips = (i: number, skipsLeft: number, currentUsed: Set<string>, currentPicked: CourseBundle[]) => {
            if (results.length >= MAX_RESULTS) return;
            if (i === ks.length) {
                if (currentPicked.length > 0) {
                    // Dedup logic omitted for brevity, adding simple check
                    results.push(currentPicked.map(b => [...b]));
                }
                return;
            }

            const name = ks[i];
            if (!name) return;
            const options = bundlesByName[name];
            // Try to pick
            // let pickedSomething = false;
            if (!options) return;
            for (const bundle of options) {
                // Check conflict
                let ok = true;
                for (const c of bundle) {
                    if (!checkConflict(c.time || [], currentUsed)) { ok = false; break; }
                }
                if (!ok) continue;

                // pickedSomething = true;
                // Add
                currentPicked.push(bundle);
                for (const c of bundle) (c.time || []).forEach((t: string) => currentUsed.add(t));

                dfsWithSkips(i + 1, skipsLeft, currentUsed, currentPicked);

                // Remove
                for (const c of bundle) (c.time || []).forEach((t: string) => currentUsed.delete(t));
                currentPicked.pop();

                if (results.length >= MAX_RESULTS) return;
            }

            if (skipsLeft > 0) {
                dfsWithSkips(i + 1, skipsLeft - 1, currentUsed, currentPicked);
            }
        };

        for (let s = 1; s < ks.length; s++) {
            dfsWithSkips(0, s, new Set(), []);
            if (results.length > 0) break;
        }
    }

    return results;
}
