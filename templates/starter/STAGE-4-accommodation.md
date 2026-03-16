# Stage 4 — Accommodation Archetype

> **Archetype:** Accommodation — "I have a space, guests see it and book."
> **Examples:** Pension/vendegház, hotel, Airbnb property, guesthouse, event venue, coworking space, conference room rental, campsite, vineyard with guest rooms.
> **Sections:** Hero (full-bleed image) → Rooms/Spaces → Gallery → Location → Contact
> **Nav links:** rooms, gallery, location, contact

## 4.1 Section structure

Same base pattern as all archetypes — see STAGE-4-service.md section 4.1.

## 4.2 Hero section — Full-bleed property image

> **Animated backgrounds for accommodation sites:** `AuroraShaders` creates a magical atmosphere for mountain lodges and spa hotels. `SeaShaders` is perfect for coastal properties (but GPU-heavy — hero only, never combine with other shaders). `NoiseShaders` suits nature retreats. See CUSTOMIZATION.md "Animated backgrounds" for the full catalog, code snippets, and performance notes.

Accommodation sites need a stunning hero image of the property, view, or best room. Use the full-bleed image hero from STAGE-4-showcase.md section 4.2.

CTA should point to rooms and booking:
```tsx
<a href="#rooms">{t("cta")}</a>           {/* "Szobáink" / "Our Rooms" */}
<a href="#contact">{t("ctaSecondary")}</a> {/* "Foglalás" / "Book Now" */}
```

## 4.3 Rooms / Spaces section

The core section. Cards showcasing each room or space with photo, capacity, amenities, price, and booking CTA.

> **Single-property listings** (e.g., one Airbnb flat): Use a single full-width card instead of the grid. Replace `grid gap-8 md:grid-cols-2 lg:grid-cols-3` with `max-w-2xl mx-auto` and use only one room key. Consider combining the room details with the hero section for a more cohesive single-listing feel.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users, Wifi, Car, Coffee, AirVent, Bath, Tv, Mountain } from "lucide-react";

// Map amenity keys to icons
const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  ac: AirVent,
  bath: Bath,
  tv: Tv,
  view: Mountain,
};

export function Rooms() {
  const t = useTranslations("rooms");

  const roomKeys = ["r1", "r2", "r3"] as const;

  return (
    <section id="rooms" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Room cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {roomKeys.map((key) => {
            const amenities = t.raw(`items.${key}.amenities`) as string[];

            return (
              <motion.div
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="glass-hover overflow-hidden"
              >
                {/* Room image */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={`/images/rooms/${key}.jpg`}
                    alt={t(`items.${key}.name`)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Room details */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{t(`items.${key}.name`)}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{t(`items.${key}.capacity`)}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`items.${key}.description`)}
                  </p>

                  {/* Amenities */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity];
                      return Icon ? (
                        <div
                          key={amenity}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground"
                          title={t(`amenityLabels.${amenity}`)}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{t(`amenityLabels.${amenity}`)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold">{t(`items.${key}.price`)}</span>
                      <span className="text-sm text-muted-foreground"> / {t("perNight")}</span>
                    </div>
                    <Button
                      asChild
                      className="rounded-full bg-foreground px-6 text-background hover:bg-foreground/90"
                    >
                      <a href="#contact">{t("bookCta")}</a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Optional: External booking link */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("bookingNote")}
            {" "}
            <a
              href={t("bookingLink")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-foreground"
            >
              Booking.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
```

**Translation structure:**
```json
{
  "rooms": {
    "label": "Szobáink",
    "title": "Szálláslehetőségek",
    "subtitle": "Válassza ki az Önnek megfelelő szobát.",
    "perNight": "éjszaka",
    "bookCta": "Foglalás",
    "bookingNote": "Online foglalás a",
    "bookingLink": "https://www.booking.com/hotel/hu/your-property",
    "amenityLabels": {
      "wifi": "Wi-Fi",
      "parking": "Parkoló",
      "breakfast": "Reggeli",
      "ac": "Légkondicionáló",
      "bath": "Fürdőkád",
      "tv": "TV",
      "view": "Panoráma"
    },
    "items": {
      "r1": {
        "name": "Standard szoba",
        "description": "Kényelmes szoba két főre, kilátással a kertre.",
        "capacity": "2 fő",
        "price": "18 000 Ft",
        "amenities": ["wifi", "parking", "breakfast", "tv"]
      }
    }
  }
}
```

**Amenity icons:**

- Add or remove icons as needed — the `amenityIcons` map is easy to extend
- Lucide has icons for most amenities: `Utensils` (restaurant), `Waves` (pool), `TreePine` (garden), `Dog` (pet-friendly)
- For non-accommodation spaces (coworking, event venues), swap the defaults: `Printer`, `Monitor`, `Users` (meeting room), `Lock` (locker), `Dumbbell` (gym)
- If amenity has no icon, it's skipped (null check in the render)

## 4.4 Gallery section

Photo grid of the property — rooms, common areas, views, surroundings. Use the same gallery component from STAGE-4-showcase.md section 4.3.

For accommodation, category tabs might be: "Szobák / Rooms", "Közös terek / Common areas", "Környék / Surroundings".

## 4.5 Location section

Highlights the property's location and nearby attractions. Important for tourism-focused businesses.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, Clock, Car } from "lucide-react";

export function Location() {
  const t = useTranslations("location");

  const attractionKeys = ["a1", "a2", "a3", "a4", "a5"] as const;

  return (
    <section id="location" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="overflow-hidden rounded-xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=PLACE_ID_HERE"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t("mapTitle")}
            />
          </motion.div>

          {/* Nearby attractions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <h3 className="mb-6 text-lg font-semibold">{t("attractionsTitle")}</h3>
            <div className="space-y-4">
              {attractionKeys.map((key) => (
                <div key={key} className="flex items-start gap-4">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t(`attractions.${key}.name`)}</p>
                    <p className="text-sm text-muted-foreground">
                      {t(`attractions.${key}.distance`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Getting there */}
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold">{t("gettingThereTitle")}</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Car className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{t("byCar")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

**Translation structure:**
```json
{
  "location": {
    "label": "Helyszín",
    "title": "Hol találhat meg",
    "subtitle": "A Balaton partjától 5 percre, a település szívében.",
    "mapTitle": "Térkép",
    "attractionsTitle": "Látnivalók a közelben",
    "attractions": {
      "a1": { "name": "Balaton", "distance": "5 perc autóval" },
      "a2": { "name": "Tihany", "distance": "15 perc autóval" },
      "a3": { "name": "Borászatok", "distance": "10 perc sétával" }
    },
    "gettingThereTitle": "Megközelítés",
    "byCar": "Budapestről az M7-es autópályán kb. 1 óra 30 perc."
  }
}
```

## 4.6 Contact section

Use the extended contact section from STAGE-4-catalog.md section 4.6 (with address, phone, opening hours / check-in times, and optional map). Adjust labels:

- "Nyitvatartás" → "Check-in / Check-out"
- Add external booking links prominently (Booking.com, Airbnb, Szallas.hu)
- Phone number should be prominent — many guests call directly

## 4.7 Content rules

- All text from translations
- Room amenities use `t.raw()` to get string arrays
- Room images stored in `public/images/rooms/`
- Gallery images in `public/images/gallery/`
- Hero image in `public/images/hero.jpg` — use the best property shot (view, exterior, best room)
- Google Maps embed requires the `pb=` parameter from a Google Maps embed URL
- External booking links always open in new tab
- Prices shown per night — make the unit clear in the translation
- If seasonal pricing differs, add a note below the room cards: "Áraink szezonálisan változhatnak" / "Prices may vary by season"
