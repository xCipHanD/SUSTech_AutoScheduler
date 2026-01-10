/**
 * 课程颜色管理器
 */
export class CourseColorManager {
    private colorMap: Map<string, string>;
    private highlightedCourses: Set<string>;
    private readonly presetColors = [
        '#eea2a4', '#f0a1a8', '#c45a65', '#ef82a0',
        '#d276a3', '#d1c2d3', '#93b5cf', '#d8e3e7',
        '#c6e6e8', '#92b3a5', '#b9dec9', '#add5a2',
        '#d2d97a', '#f8df72', '#f9d770', '#ee8055'
    ];

    constructor() {
        this.colorMap = new Map();
        this.highlightedCourses = new Set();
    }

    /**
     * 获取课程颜色,如果不存在则分配随机颜色
     */
    getColor(courseId: string): string {
        if (!this.colorMap.has(courseId)) {
            this.assignRandomColor(courseId);
        }
        return this.colorMap.get(courseId)!;
    }

    /**
     * 为课程分配随机颜色
     */
    assignRandomColor(courseId: string): void {
        const color = this.presetColors[Math.floor(Math.random() * this.presetColors.length)]!;
        this.colorMap.set(courseId, color);
    }

    /**
     * 设置课程颜色
     */
    setColor(courseId: string, color: string): void {
        this.colorMap.set(courseId, color);
    }

    /**
     * 高亮课程
     */
    highlight(courseId: string): void {
        this.highlightedCourses.add(courseId);
    }

    /**
     * 取消高亮课程
     */
    unhighlight(courseId: string): void {
        this.highlightedCourses.delete(courseId);
    }

    /**
     * 检查课程是否被高亮
     */
    isHighlighted(courseId: string): boolean {
        return this.highlightedCourses.has(courseId);
    }

    /**
     * 清除所有高亮
     */
    clearAllHighlights(): void {
        this.highlightedCourses.clear();
    }

    /**
     * 获取预设颜色列表
     */
    getPresetColors(): string[] {
        return [...this.presetColors];
    }
}
