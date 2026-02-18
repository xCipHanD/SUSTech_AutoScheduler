export interface Course {
    id: string;
    kcdm: string; // Course Code
    kcmc: string; // Course Name
    xf: string;   // Credits
    dgjsmc: string; // Teachers
    pyccmc: string | null; // Level
    kkyxmc: string; // Department
    skyymc: string; // Language
    rwmc: string; // Task Name (Class Name)
    time: string[]; // Time codes, e.g., ["1712"]
    info: string | null;
    // Real-time capacity info (plugin-only; may be missing in static mode)
    yxzrs?: number | null; // Enrolled count
    bksrl?: number | null; // Undergraduate capacity
    // UI state
    active?: boolean; // If false, ignored in scheduling (user can disable specific classes of a course?)
}

// A "Bundle" is a set of courses that must be taken together (e.g. Lecture + Lab)
// or just a single course if no dependencies.
export type CourseBundle = Course[];

export interface ScheduleResult {
    [week: number]: { // 0: Odd, 1: Even ?? Or map by week parity
        [day: number]: { // 1-7
            [slot: number]: Course | undefined; // 1,2,3,4,5 (corresponding to 1-2, 3-4, etc.)
        }
    }
}
