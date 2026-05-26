-- Optional sample villas. Run after schema.sql.
-- All images are royalty-free Unsplash photos.

insert into public.villas
  (slug, title, description, location, price_per_night, guests, bedrooms, bathrooms, amenities, images, is_published)
values
  (
    'villa-aurora',
    'Villa Aurora',
    E'Perched on the cliffs of the Amalfi Coast, Villa Aurora is a sun-drenched, three-bedroom hideaway with sweeping views of the Tyrrhenian Sea. Wake to the sound of waves, breakfast on the citrus terrace, then swim laps in the infinity pool while the village bells chime in the distance.\n\nThoughtfully restored from a 19th-century farmhouse, the interiors balance handmade Ligurian tile, soft linens, and modern comforts. A short walk takes you to fishermen''s coves and family-run trattorias.',
    'Amalfi Coast, Italy',
    780,
    6,
    3,
    3,
    ARRAY['Private pool', 'Sea view', 'Wi-Fi', 'Air conditioning', 'Kitchen', 'Parking'],
    ARRAY[
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
    ],
    true
  ),
  (
    'casa-del-mar',
    'Casa del Mar',
    E'A whitewashed, four-bedroom villa with direct access to a private cove on the south coast of Mallorca. Casa del Mar was designed for slow mornings and long, unhurried lunches under the pergola.\n\nThe villa sleeps eight, with two living rooms, a chef''s kitchen, and an outdoor BBQ. Sun loungers line the saltwater pool, and a short stone path leads to a small, sandy bay perfect for snorkeling.',
    'Mallorca, Spain',
    920,
    8,
    4,
    3,
    ARRAY['Private pool', 'Beach access', 'Wi-Fi', 'Air conditioning', 'Kitchen', 'BBQ grill', 'Parking'],
    ARRAY[
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
    ],
    true
  ),
  (
    'maison-pin',
    'Maison du Pin',
    E'Hidden among century-old pines in Provence, Maison du Pin is a quiet, three-bedroom retreat with vaulted ceilings, antique furniture, and modern art. The garden is fragrant with lavender and rosemary, and a small saltwater pool sits at the center of it all.\n\nPerfect for couples or small families wanting to slow down, cook with local produce from the weekly market, and explore the surrounding hill towns.',
    'Provence, France',
    540,
    5,
    3,
    2,
    ARRAY['Private pool', 'Wi-Fi', 'Air conditioning', 'Kitchen', 'Workspace', 'Parking', 'Pet friendly'],
    ARRAY[
      'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1600&q=80'
    ],
    true
  ),
  (
    'aspen-ridge-chalet',
    'Aspen Ridge Chalet',
    E'A modern five-bedroom alpine chalet with floor-to-ceiling windows, a wood-burning fireplace, and ski-in/ski-out access to the slopes. After a long day on the mountain, soak in the outdoor hot tub while the snow falls around you.\n\nThe lower level features a media room, gym, and sauna. A private chef and ski concierge can be arranged on request.',
    'Aspen, Colorado',
    1450,
    10,
    5,
    5,
    ARRAY['Hot tub', 'Wi-Fi', 'Air conditioning', 'Kitchen', 'Gym', 'Workspace', 'Parking'],
    ARRAY[
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?auto=format&fit=crop&w=1600&q=80'
    ],
    true
  ),
  (
    'banyan-house-bali',
    'Banyan House',
    E'A bamboo and teak villa nestled in the rice fields of Ubud. Banyan House is a sanctuary of open-air living, with three pavilions connected by stone paths, a private yoga deck, and a saltwater pool framed by tropical greenery.\n\nA daily breakfast of tropical fruit and fresh-baked bread is included, and a private chef can prepare Balinese feasts on request.',
    'Ubud, Bali',
    420,
    4,
    2,
    2,
    ARRAY['Private pool', 'Wi-Fi', 'Air conditioning', 'Kitchen', 'Workspace'],
    ARRAY[
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80'
    ],
    true
  ),
  (
    'olive-grove-house',
    'Olive Grove House',
    E'A traditional stone villa in the heart of Crete, surrounded by 400-year-old olive trees and a small vineyard. Three quiet bedrooms, a covered outdoor kitchen, and a 14-meter lap pool make Olive Grove House ideal for long, slow summers.\n\nThe nearest beach is a ten-minute drive, and your hosts will gladly arrange boat trips, wine tastings, and private cooking classes.',
    'Crete, Greece',
    610,
    6,
    3,
    2,
    ARRAY['Private pool', 'Sea view', 'Wi-Fi', 'Air conditioning', 'Kitchen', 'BBQ grill', 'Parking'],
    ARRAY[
      'https://images.unsplash.com/photo-1592595896616-c37162298647?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=80'
    ],
    true
  )
on conflict (slug) do nothing;
