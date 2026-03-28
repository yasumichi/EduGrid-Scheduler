import { PrismaClient, ResourceType, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // データのクリア
  await prisma.holiday.deleteMany();
  await prisma.scheduleEvent.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.user.deleteMany();

  console.log('Clearing database...');

  // ユーザーの生成
  const password = await bcrypt.hash('password123', 10);
  
  // 佐藤先生のユーザー (t1 に紐付ける)
  const userT1 = await prisma.user.create({
    data: {
      email: 'sato@example.com',
      password: password,
      role: UserRole.TEACHER
    }
  });

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: password,
      role: UserRole.ADMIN
    }
  });

  console.log('Seeding users...');

  // リソースの生成
  // Rooms
  for (let i = 1; i <= 20; i++) {
    await prisma.resource.create({
      data: { id: `r${i}`, name: `${100 + i}号室`, type: 'room', order: i }
    });
  }
  // Teachers
  const surnames = ['佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水'];
  for (let i = 1; i <= 20; i++) {
    await prisma.resource.create({
      data: { 
        id: `t${i}`, 
        name: `${surnames[i-1]} 先生`, 
        type: 'teacher', 
        order: i,
        // 佐藤先生 (t1) だけユーザーと紐付け
        userId: i === 1 ? userT1.id : undefined
      }
    });
  }
  // Courses
  const courseNames = ['特進数学', '実用英語', '物理探究', '日本史B', '現代文演習', '化学基礎', '世界史A', '地理B', '生物特講', '政治経済', '古典特講', '情報I', '芸術基礎', '体育特論', '英語表現', '数学IIB', '論理国語', '科学人間学', 'キャリア探究', '多文化理解'];
  for (let i = 1; i <= 20; i++) {
    await prisma.resource.create({
      data: { id: `c${i}`, name: `${courseNames[i-1]}講座`, type: 'course', order: i }
    });
  }

  console.log('Seeding resources...');

  // 授業の生成
  const subjects = ['数学', '英語', '物理', '国語', '化学', '歴史', '地理', '生物', '社会', '情報', '芸術', '体育'];
  const baseDate = '2026-03-26';

  for (let i = 1; i <= 20; i++) {
    const periodNum = (i % 8) + 1;
    await prisma.lesson.create({
      data: {
        subject: subjects[i % subjects.length],
        teacherId: `t${(i % 20) + 1}`,
        roomId: `r${(i % 20) + 1}`,
        courseId: `c${(i % 20) + 1}`,
        startDate: baseDate,
        startPeriodId: `p${periodNum}`,
        endDate: baseDate,
        endPeriodId: `p${periodNum}`
      }
    });
  }

  // 複数サブ講師のテストデータ
  await prisma.lesson.create({
    data: {
      subject: 'チームティーチング:総合探究',
      teacherId: 't1', // 佐藤先生
      subTeachers: {
        connect: [{ id: 't2' }, { id: 't3' }] // 鈴木先生, 高橋先生
      },
      roomId: 'r1',
      courseId: 'c1',
      startDate: '2026-03-26',
      startPeriodId: 'p3',
      endDate: '2026-03-26',
      endPeriodId: 'p4'
    }
  });

  // 日を跨ぐ集中講義
  await prisma.lesson.create({
    data: {
      subject: '集中講義:多文化共生',
      teacherId: 't5',
      subTeachers: {
        connect: [{ id: 't1' }, { id: 't2' }]
      },
      roomId: 'r5',
      courseId: 'c20',
      startDate: '2026-03-26',
      startPeriodId: 'p1',
      endDate: '2026-03-27',
      endPeriodId: 'p4'
    }
  });

  console.log('Seeding lessons...');

  // イベント
  // 全体イベント
  await prisma.scheduleEvent.create({
    data: {
      name: '全館避難訓練',
      startDate: '2026-03-26',
      startPeriodId: 'p5',
      endDate: '2026-03-26',
      endPeriodId: 'p6',
      color: '#fee2e2',
      showInEventRow: true
    }
  });

  // リソース固有（加藤先生のみ、イベント行なし）
  await prisma.scheduleEvent.create({
    data: {
      name: '出張（学会参加）',
      startDate: '2026-03-26',
      startPeriodId: 'p1',
      endDate: '2026-03-26',
      endPeriodId: 'p8',
      color: '#d1fae5',
      showInEventRow: false,
      resources: {
        connect: [{ id: 't10' }]
      }
    }
  });

  // 両方（田中先生、104号室、イベント行あり）
  await prisma.scheduleEvent.create({
    data: {
      name: '研究授業（公開）',
      startDate: '2026-03-26',
      startPeriodId: 'p2',
      endDate: '2026-03-26',
      endPeriodId: 'p3',
      color: '#fef3c7',
      showInEventRow: true,
      resources: {
        connect: [{ id: 't4' }, { id: 'r4' }]
      }
    }
  });

  // その他既存のイベント
  await prisma.scheduleEvent.create({
    data: { name: '校内清掃', startDate: '2026-03-26', startPeriodId: 'p7', endDate: '2026-03-26', endPeriodId: 'p8', color: '#e2e8f0', showInEventRow: true }
  });

  // 祝日
  await prisma.holiday.createMany({
    data: [
      { date: '2026-01-01', name: '元日' },
      { date: '2026-02-11', name: '建国記念の日' },
      { date: '2026-02-23', name: '天皇誕生日' },
      { date: '2026-03-20', name: '春分の日' },
      { date: '2026-04-29', name: '昭和の日' },
      { start: '2026-12-29', end: '2027-01-03', name: '年末年始休暇' }
    ]
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
