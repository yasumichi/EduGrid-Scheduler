export interface TimePeriod {
  id: string;
  name: string;
}

export type ResourceType = 'room' | 'teacher' | 'course';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
}

export interface Lesson {
  id: string;
  subject: string;
  teacherId: string;
  roomId: string;
  courseId: string;
  date: string; // ISO形式 "2026-03-26"
  startPeriodId: string; // "p1"〜"p8"
  duration: number; // 連続コマ数
}

export type ViewType = 'day' | 'week' | 'month' | 'year';

export interface Holiday {
  date?: string;  // 単一日の場合
  start?: string; // 期間開始
  end?: string;   // 期間終了
  name: string;
}

// デフォルト8限の設定
export const DEFAULT_PERIODS: TimePeriod[] = [
  { id: 'p1', name: '1限' },
  { id: 'p2', name: '2限' },
  { id: 'p3', name: '3限' },
  { id: 'p4', name: '4限' },
  { id: 'p5', name: '5限' },
  { id: 'p6', name: '6限' },
  { id: 'p7', name: '7限' },
  { id: 'p8', name: '8限' },
];

export const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', name: '101号室', type: 'room' },
  { id: 'r2', name: '102号室', type: 'room' },
  { id: 't1', name: '佐藤 先生', type: 'teacher' },
  { id: 't2', name: '鈴木 先生', type: 'teacher' },
];

export const MOCK_LESSONS: Lesson[] = [
  { id: 'l1', subject: '数学I', teacherId: 't1', roomId: 'r1', courseId: 'c1', date: '2026-03-26', startPeriodId: 'p1', duration: 2 },
  { id: 'l2', subject: '英語', teacherId: 't2', roomId: 'r2', courseId: 'c2', date: '2026-03-26', startPeriodId: 'p3', duration: 1 },
  { id: 'l3', subject: '物理', teacherId: 't1', roomId: 'r1', courseId: 'c1', date: '2026-03-27', startPeriodId: 'p2', duration: 2 },
];
