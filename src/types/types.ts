// Database types matching Supabase schema

export interface Group {
  id: string;
  name: string;
  admin_token: string;
  created_at: string;
}

export interface Match {
  id: string;
  group_id: string;
  participant_name: string;
  participant_phone: string;
  encrypted_data: string;
  token: string;
  created_at: string;
}

// Application types

export interface Participant {
  name: string;
  phone: string;
}

export interface DrawResult {
  groupId: string;
  adminToken: string;
  matches: MatchWithToken[];
}

export interface MatchWithToken {
  participantName: string;
  participantPhone: string;
  assignedTo: string;
  token: string;
}

export interface DecryptedMatch {
  participantName: string;
  assignedTo: string;
}
