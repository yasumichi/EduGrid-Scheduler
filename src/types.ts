export interface TimePeriod {
  id: string;
  name: string;
}

export type ResourceType = 'room' | 'teacher' | 'course';
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  resourceId?: string; // 対応する講師リソース等
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ResourceLabels {
  room: string;
  teacher: string;
  course: string;
  event: string;
  mainTeacher: string;
  subTeacher: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  order?: number;
  userId?: string; // 紐付けられたユーザーID
}

export interface ScheduleEvent {
  id: string;
  name: string;
  startDate: string;
  startPeriodId: string;
  endDate: string;
  endPeriodId: string;
  color?: string;
  resourceIds?: string[]; // 紐付けられたリソースID（講師、教室など）
  resources?: { id: string }[]; // バックエンドからのリレーション
  showInEventRow?: boolean; // イベント行（最上部）に表示するかどうか
}

export interface Lesson {
  id: string;
  subject: string;
  teacherId: string;
  subTeacherIds?: string[]; // サブ講師
  subTeachers?: { id: string }[]; // バックエンドからのリレーション
  roomId: string;
  courseId: string;
  startDate: string;   // 開始日 "2026-03-26"
  startPeriodId: string; // 開始時限 "p1"
  endDate: string;     // 終了日 "2026-03-27"
  endPeriodId: string;   // 終了時限 "p4"
}

export type ViewType = 'day' | 'week' | 'month' | 'year';

export interface Holiday {
  date?: string;
  start?: string;
  end?: string;
  name: string;
}

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

const generateResources = (): Resource[] => {
  const resources: Resource[] = [];
  for (let i = 1; i <= 20; i++) {
    resources.push({ id: `r${i}`, name: `${100 + i}号室`, type: 'room', order: i });
  }
  const surnames = ['佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水'];
  for (let i = 1; i <= 20; i++) {
    resources.push({ id: `t${i}`, name: `${surnames[i-1]} 先生`, type: 'teacher', order: i });
  }
  const courseNames = ['特進数学', '実用英語', '物理探究', '日本史B', '現代文演習', '化学基礎', '世界史A', '地理B', '生物特講', '政治経済', '古典特講', '情報I', '芸術基礎', '体育特論', '英語表現', '数学IIB', '論理国語', '科学人間学', 'キャリア探究', '多文化理解'];
  for (let i = 1; i <= 20; i++) {
    resources.push({ id: `c${i}`, name: `${courseNames[i-1]}講座`, type: 'course', order: i });
  }
  return resources;
};

export const MOCK_RESOURCES = generateResources();

const generateLessons = (): Lesson[] => {
  const lessons: Lesson[] = [];
  const subjects = ['数学', '英語', '物理', '国語', '化学', '歴史', '地理', '生物', '社会', '情報', '芸術', '体育'];
  const baseDate = '2026-03-26';

  // 基本的な単発の授業
  for (let i = 1; i <= 30; i++) {
    const periodNum = (i % 8) + 1;
    lessons.push({
      id: `l${i}`,
      subject: subjects[i % subjects.length],
      teacherId: `t${(i % 20) + 1}`,
      roomId: `r${(i % 20) + 1}`,
      courseId: `c${(i % 20) + 1}`,
      startDate: baseDate,
      startPeriodId: `p${periodNum}`,
      endDate: baseDate,
      endPeriodId: `p${periodNum}`
    });
  }

  // 複数サブ講師のテストデータ
  lessons.push({
    id: 'l-multi-sub',
    subject: 'チームティーチング:総合探究',
    teacherId: 't1', // 佐藤先生
    subTeacherIds: ['t2', 't3'], // 鈴木先生, 高橋先生
    roomId: 'r1',
    courseId: 'c1',
    startDate: '2026-03-26',
    startPeriodId: 'p3',
    endDate: '2026-03-26',
    endPeriodId: 'p4'
  });

  // 日を跨ぐ集中講義
  lessons.push({
    id: 'l-special',
    subject: '集中講義:多文化共生',
    teacherId: 't5',
    subTeacherIds: ['t1', 't2'],
    roomId: 'r5',
    courseId: 'c20',
    startDate: '2026-03-26',
    startPeriodId: 'p1',
    endDate: '2026-03-27',
    endPeriodId: 'p4'
  });

  return lessons;
};

export const MOCK_LESSONS = generateLessons();

export const MOCK_EVENTS: ScheduleEvent[] = [
  {
    id: 'e-global-only',
    name: '全館避難訓練',
    startDate: '2026-03-26',
    startPeriodId: 'p5',
    endDate: '2026-03-26',
    endPeriodId: 'p6',
    color: '#fee2e2',
    showInEventRow: true // イベント行のみ（resourceIdsなし）
  },
  {
    id: 'e-resource-only',
    name: '出張（学会参加）',
    startDate: '2026-03-26',
    startPeriodId: 'p1',
    endDate: '2026-03-26',
    endPeriodId: 'p8',
    color: '#d1fae5',
    resourceIds: ['t10'], // 加藤先生のみ
    showInEventRow: false // イベント行には出さない
  },
  {
    id: 'e-both',
    name: '研究授業（公開）',
    startDate: '2026-03-26',
    startPeriodId: 'p2',
    endDate: '2026-03-26',
    endPeriodId: 'p3',
    color: '#fef3c7',
    resourceIds: ['t4', 'r4'], // 田中先生、104号室
    showInEventRow: true // 両方に表示
  }
];

export const MOCK_HOLIDAYS: Holiday[] = [
  { date: '2026-01-01', name: '元日' },
  { date: '2026-02-11', name: '建国記念の日' },
  { date: '2026-02-23', name: '天皇誕生日' },
  { date: '2026-03-20', name: '春分の日' },
  { date: '2026-04-29', name: '昭和の日' },
  { start: '2026-12-29', end: '2027-01-03', name: '年末年始休暇' }
];
