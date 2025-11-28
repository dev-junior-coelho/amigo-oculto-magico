/*
# Create Amigo Oculto Tables

## Plain English Explanation
This migration creates the database structure for the Amigo Oculto (Secret Santa) application.
It includes two main tables:
1. `groups` - Stores information about each Secret Santa event/group
2. `matches` - Stores encrypted participant data and their secret assignments

## Table List & Column Descriptions

### groups
- `id` (uuid, primary key) - Unique identifier for each Secret Santa group
- `name` (text, not null) - Name of the Secret Santa event
- `admin_token` (text, unique, not null) - Secret token for admin access to manage the group
- `created_at` (timestamptz, default: now()) - Timestamp when the group was created

### matches
- `id` (uuid, primary key) - Unique identifier for each match
- `group_id` (uuid, foreign key) - References the parent group
- `participant_name` (text, not null) - Name of the participant
- `participant_phone` (text, not null) - WhatsApp phone number with country code
- `encrypted_data` (text, not null) - Encrypted data containing the assigned person
- `token` (text, unique, not null) - Magic token for participant to reveal their assignment
- `created_at` (timestamptz, default: now()) - Timestamp when the match was created

## Security Changes
- No RLS enabled - This is a public application where anyone can create groups
- No authentication required - Users access via magic tokens
- Data security is handled through encryption and unique tokens

## Notes
- All sensitive data (assignments) are stored encrypted
- Each participant gets a unique magic token to reveal their assignment
- Admin token allows managing the group and viewing distribution links
- Phone numbers should include country code (e.g., +5511999999999)
*/

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  admin_token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  participant_name text NOT NULL,
  participant_phone text NOT NULL,
  encrypted_data text NOT NULL,
  token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_matches_group_id ON matches(group_id);
CREATE INDEX IF NOT EXISTS idx_matches_token ON matches(token);
CREATE INDEX IF NOT EXISTS idx_groups_admin_token ON groups(admin_token);