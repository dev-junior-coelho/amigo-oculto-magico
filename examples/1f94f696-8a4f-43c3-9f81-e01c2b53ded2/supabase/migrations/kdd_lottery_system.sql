/*
  # KDD China 2025 抽奖系统数据库

  1. 新建表
    - `participants` 参与者信息表
      - `id` (uuid, 主键)
      - `name` (text, 姓名)
      - `phone` (text, 手机号, 唯一)
      - `company` (text, 单位)
      - `is_winner` (boolean, 是否中奖)
      - `created_at` (timestamp, 创建时间)

  2. 安全设置
    - 启用 RLS
    - 添加公共访问策略
*/

CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  company text NOT NULL,
  is_winner boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to participants"
  ON participants
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);