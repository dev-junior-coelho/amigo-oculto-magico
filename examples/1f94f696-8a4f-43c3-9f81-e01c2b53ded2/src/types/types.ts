export interface Participant {
  id: string;
  name: string;
  phone: string;
  company: string;
  is_winner: boolean;
  created_at: string;
}

export interface LotteryResult {
  winners: Participant[];
  total_participants: number;
  remaining_participants: number;
}