# 学校スケジューラー (リソース・スケジューラー)

Web ページで使用する、学校のリソース（教室・教員・コース）管理に特化したカレンダー部品の開発。

## 技術スタック (Tech Stack)

- **UI ライブラリ:** Preact (仮想DOM、軽量・高速)
- **言語:** TypeScript
- **状態管理:** @preact/signals (ピンポイントな再レンダリングによる高パフォーマンス)
- **レイアウト:** CSS Grid (複数コマ跨ぎ・マルチビューのネイティブサポート)
- **日付操作:** date-fns, Intl.DateTimeFormat (ロケール対応)
- **ビルドツール:** Vite

## 主要要件 (Key Features)

- **日付ベースのスケジュール管理:** 特定の日付に対して授業（イベント）を割り当てる形式。
- **固定 8 限表示:** 1 日を 8 つのタイムスロット（時限）として表示。休み時間は非表示。
- **マルチビュー対応:**
  - **1日 / 1週間 / 1ヶ月 / 1年 (4月始まり)** の表示切り替え。
  - すべてのビューで時限の幅（60px）を一定に保ち、一貫した情報量を維持。
- **国際化 (i18n) & 曜日表示:**
  - ブラウザのロケール設定に基づき、日付・曜日を自動的に適切な言語で表示。
  - ヘッダーに曜日を表示し、土曜日（青）/ 日曜日（赤）を視覚的に強調。
- **外部祝日・期間休暇設定:**
  - `holidays.json` から祝日・休暇データをロード。
  - **単一日の祝日**（例: 春分の日）に加え、**期間指定の休暇**（例: 年末年始 12/29〜1/3）に対応。
  - 該当期間はカレンダー全体を赤系のテーマで強調表示し、ツールチップで名称を表示。
- **動的リソース切り替え:** 行（Y軸）を「教室」「先生」「コース」などで動的に切り替え可能。
- **Sticky レイアウト:** ヘッダーとサイドバーを固定し、スクロール時の一覧性を確保。

## データインターフェース (Data Structures)

```typescript
export type ViewType = 'day' | 'week' | 'month' | 'year';
export type ResourceType = 'room' | 'teacher' | 'course';

// 外部祝日・休暇データの形式 (holidays.json)
interface Holiday {
  date?: string;  // 単一日指定の場合
  start?: string; // 期間指定の開始日
  end?: string;   // 期間指定の終了日
  name: string;
}

// 授業データ (セルの中身)
interface Lesson {
  id: string;
  subject: string;
  teacherId: string;
  roomId: string;
  courseId: string;
  date: string; // ISO形式 "2026-03-26"
  startPeriodId: string; // "p1"〜"p8"
  duration: number; // 連続コマ数
}
```

## プロトタイプの状況

- [x] Vite + Preact + TypeScript のセットアップ
- [x] CSS Grid によるマルチビュー（1日/1週/1月/1年）の実装
- [x] 国際化 (Intl) による日付・曜日表示
- [x] 期間指定の休暇（年末年始等）への対応
- [x] 1年表示のレイアウト最適化（時限幅の維持）
- [x] `holidays.json` からのデータ動的ロード
- [x] Sticky ヘッダー/サイドバーの実装
- [ ] ドラッグ＆ドロップによる授業の移動・編集機能
