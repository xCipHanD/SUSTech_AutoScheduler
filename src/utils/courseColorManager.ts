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

export interface Rgb {
    r: number;
    g: number;
    b: number;
}

/**
 * 将十六进制颜色解析为 RGB（支持 #rgb 与 #rrggbb）
 */
export function hexToRgb(hex: string): Rgb {
    let value = hex.replace('#', '').trim();
    if (value.length === 3) {
        value = value.split('').map((c) => c + c).join('');
    }
    const int = parseInt(value, 16);
    return {
        r: (int >> 16) & 0xff,
        g: (int >> 8) & 0xff,
        b: int & 0xff
    };
}

/**
 * 将颜色按 alpha 叠加到不透明底色上，返回合成后的实色
 */
export function compositeColor(hex: string, alpha: number, base: Rgb): Rgb {
    const { r, g, b } = hexToRgb(hex);
    return {
        r: Math.round(r * alpha + base.r * (1 - alpha)),
        g: Math.round(g * alpha + base.g * (1 - alpha)),
        b: Math.round(b * alpha + base.b * (1 - alpha))
    };
}

/**
 * 计算 sRGB 相对亮度（0 黑 - 1 白）
 */
export function relativeLuminance({ r, g, b }: Rgb): number {
    const channel = (c: number) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * 根据背景色亮度选择可读的深色/浅色文字
 */
export function readableTextColor(bg: Rgb): string {
    return relativeLuminance(bg) > 0.45 ? '#1f2937' : '#ffffff';
}

/**
 * 计算两色之间的 WCAG 对比度（1 - 21）
 */
export function contrastRatio(a: Rgb, b: Rgb): number {
    const la = relativeLuminance(a);
    const lb = relativeLuminance(b);
    const lighter = Math.max(la, lb);
    const darker = Math.min(la, lb);
    return (lighter + 0.05) / (darker + 0.05);
}
