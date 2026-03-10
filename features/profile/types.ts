export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  gender: "male" | "female" | "other" | null;
  birth_date: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
  avatar_url: string | null;
  show_phone: boolean;
  show_address: boolean;
  show_gender: boolean;
  show_birth_date: boolean;
  show_email: boolean;
  show_name: boolean;
  show_avatar: boolean;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;

export interface PublicProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  gender: "male" | "female" | "other" | null;
  birth_date: string | null;
  address: string | null;
  avatar_url: string | null;
  show_name: boolean;
  show_avatar: boolean;
  show_address: boolean;
  show_gender: boolean;
  show_birth_date: boolean;
}
