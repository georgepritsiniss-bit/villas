export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Villa = {
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
};

export type Booking = {
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
};

export interface BookingWithVilla extends Booking {
  villa: Pick<Villa, "id" | "title" | "slug" | "location" | "images"> | null;
}

export interface BookingWithDetails extends Booking {
  villa: Pick<Villa, "id" | "title" | "slug" | "location"> | null;
  profile: Pick<Profile, "id" | "email" | "full_name"> | null;
}

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

/** Matches Supabase `GenericSchema` so clients infer table types correctly. */
export type PublicSchema = {
    Tables: {
      profiles: TableDef<
        Profile,
        Partial<Profile> & { id: string },
        Partial<Profile>
      >;
      villas: TableDef<
        Villa,
        Omit<Villa, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        },
        Partial<Omit<Villa, "id" | "created_at">>
      >;
      bookings: TableDef<
        Booking,
        Omit<Booking, "id" | "created_at" | "status" | "total_price"> & {
          id?: string;
          status?: BookingStatus;
          total_price?: number;
          created_at?: string;
        },
        Partial<Omit<Booking, "id" | "created_at">>
      >;
    };
    Views: {
      villa_availability: {
        Row: {
          villa_id: string;
          start_date: string;
          end_date: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
};

export type Database = {
  public: PublicSchema;
};
