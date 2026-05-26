export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Villa {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  villa_id: string;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
}

export interface BookingWithVilla extends Booking {
  villa: Pick<Villa, "id" | "title" | "slug" | "location" | "images"> | null;
}

export interface BookingWithDetails extends Booking {
  villa: Pick<Villa, "id" | "title" | "slug" | "location"> | null;
  profile: Pick<Profile, "id" | "email" | "full_name"> | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      villas: {
        Row: Villa;
        Insert: Omit<Villa, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Villa, "id" | "created_at">>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at" | "status" | "total_price"> & {
          id?: string;
          status?: BookingStatus;
          total_price?: number;
          created_at?: string;
        };
        Update: Partial<Omit<Booking, "id" | "created_at">>;
      };
    };
    Views: {
      villa_availability: {
        Row: {
          villa_id: string;
          start_date: string;
          end_date: string;
        };
      };
    };
  };
}
