import type { Course } from '@/types';

/**
 * 将课程表导出为 iCalendar (.ics) 格式
 */
export function exportToICS(courses: Course[], semesterStartDate: Date = new Date()): string {
    const lines: string[] = [];

    // iCalendar 文件头
    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');
    lines.push('PRODID:-//SUSTech Course Scheduler//CN');
    lines.push('CALSCALE:GREGORIAN');
    lines.push('METHOD:PUBLISH');
    lines.push('X-WR-CALNAME:SUSTech 课程表');
    lines.push('X-WR-TIMEZONE:Asia/Shanghai');

    // 时区定义
    lines.push('BEGIN:VTIMEZONE');
    lines.push('TZID:Asia/Shanghai');
    lines.push('BEGIN:STANDARD');
    lines.push('DTSTART:19700101T000000');
    lines.push('TZOFFSETFROM:+0800');
    lines.push('TZOFFSETTO:+0800');
    lines.push('END:STANDARD');
    lines.push('END:VTIMEZONE');

    // 时间段映射 (节次 -> 开始时间和结束时间)
    const timeSlots = [
        { start: '08:00', end: '09:50' },  // 1-2节
        { start: '10:10', end: '12:00' },  // 3-4节
        { start: '14:00', end: '15:50' },  // 5-6节
        { start: '16:10', end: '18:00' },  // 7-8节
        { start: '19:00', end: '20:50' },  // 9-10节
        { start: '21:00', end: '21:50' }   // 11节
    ];

    // 为每门课程创建事件
    courses.forEach(course => {
        if (!course.time || course.time.length === 0) return;

        course.time.forEach(timeCode => {
            if (timeCode.length !== 4) return;

            const weekType = timeCode.charAt(0); // 0=both, 1=odd, 2=even
            const dayStr = timeCode.slice(1, 2);
            const startSlotHex = timeCode.slice(2, 3);

            const day = parseInt(dayStr, 10);
            const dayOfWeek = (day === 0) ? 7 : day; // 0表示周日
            const startSlot = parseInt(startSlotHex, 16);

            // 计算时间段索引
            const slotIndex = Math.floor((startSlot - 1) / 2);
            const timeSlot = timeSlots[slotIndex];
            if (!timeSlot) return;

            // 生成重复规则
            let rrule = 'FREQ=WEEKLY;COUNT=18'; // 默认18周
            if (weekType === '1') {
                rrule += ';INTERVAL=2'; // 单周 (每2周重复)
            } else if (weekType === '2') {
                rrule += ';INTERVAL=2'; // 双周 (每2周重复)
            }

            // 计算第一次上课日期
            const firstDate = new Date(semesterStartDate);
            const daysToAdd = (dayOfWeek - firstDate.getDay() + 7) % 7;
            firstDate.setDate(firstDate.getDate() + daysToAdd);

            // 如果是双周,需要从第二周开始
            if (weekType === '2') {
                firstDate.setDate(firstDate.getDate() + 7);
            }

            // 格式化日期时间为本地时间格式 (YYYYMMDDTHHMMSS)
            const formatDateTime = (date: Date, time: string) => {
                const parts = time.split(':');
                const hours = parts[0] || '0';
                const minutes = parts[1] || '0';
                const dt = new Date(date);
                dt.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                const year = dt.getFullYear();
                const month = String(dt.getMonth() + 1).padStart(2, '0');
                const day = String(dt.getDate()).padStart(2, '0');
                const hour = String(dt.getHours()).padStart(2, '0');
                const minute = String(dt.getMinutes()).padStart(2, '0');
                const second = '00';

                return `${year}${month}${day}T${hour}${minute}${second}`;
            };

            const dtStart = formatDateTime(firstDate, timeSlot.start);
            const dtEnd = formatDateTime(firstDate, timeSlot.end);
            const uid = `${course.id}-${timeCode}@sustech-scheduler`;
            const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

            // 创建事件
            lines.push('BEGIN:VEVENT');
            lines.push(`UID:${uid}`);
            lines.push(`DTSTAMP:${now}`);
            lines.push(`DTSTART;TZID=Asia/Shanghai:${dtStart}`);
            lines.push(`DTEND;TZID=Asia/Shanghai:${dtEnd}`);
            lines.push(`RRULE:${rrule}`);
            lines.push(`SUMMARY:${course.kcmc}`);
            lines.push(`DESCRIPTION:教师: ${course.dgjsmc}\\n课程代码: ${course.kcdm}`);
            lines.push('STATUS:CONFIRMED');
            lines.push('TRANSP:OPAQUE');
            lines.push('END:VEVENT');
        });
    });

    lines.push('END:VCALENDAR');

    return lines.join('\r\n');
}

/**
 * 触发下载 .ics 文件
 */
export function downloadICS(content: string, filename: string = 'schedule.ics') {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}
