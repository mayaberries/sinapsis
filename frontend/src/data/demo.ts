/**
 * Demo content for the POC's screens, until the API provides it. Pages and
 * components only read these shapes, so swapping in API data later doesn't
 * change their markup.
 */

export type Facilitator = { name: string };

export type Schedule =
  | { kind: "recurring"; cadence: string; completed: number; total: number; next: string; then?: string }
  | { kind: "one-time"; date: string }
  | { kind: "draft" };

export type Workshop = {
  title: string;
  code: string;
  participants: number;
  materials: number;
  schedule: Schedule;
  /** Its next session is today, so the card offers to start it. */
  startsToday?: boolean;
};

export type MaterialKind = "slides" | "pdf" | "image" | "audio" | "video";

export type Material = {
  name: string;
  kind: MaterialKind;
  size: string;
  /** Which workshop and session it's for; `null` when it isn't attached yet. */
  usedIn: string | null;
};

/** A workshop a participant can join, as listed on their join page. */
export type JoinableWorkshop = {
  title: string;
  facilitator: string;
  when: string;
  live: boolean;
};

export type Participant = {
  name: string;
  initial: string;
  speaking?: boolean;
  handRaised?: boolean;
};

export type ChatMessage = { author: string; text: string };

export const MATERIAL_ICONS: Record<MaterialKind, string> = {
  slides: "📊",
  pdf: "📄",
  image: "🖼",
  audio: "🎵",
  video: "🎬",
};

export const MATERIAL_LABELS: Record<MaterialKind, string> = {
  slides: "Presentación",
  pdf: "PDF",
  image: "Imagen",
  audio: "Audio",
  video: "Video",
};

export const today = "Lunes 12 de octubre";

export const facilitator: Facilitator = { name: "Ana López" };

export const participant = { name: "Daniela" };

export const upNext = {
  title: "Manejo de la ansiedad",
  session: "Sesión 4 de 8",
  startsIn: "en 25 min",
  when: "Hoy, 18:00",
  participants: 9,
  code: "ans-4821",
  materials: 3,
};

export type UpNext = typeof upNext;

export const workshops: Workshop[] = [
  {
    title: "Manejo de la ansiedad",
    code: "ans-4821",
    participants: 9,
    materials: 3,
    schedule: {
      kind: "recurring",
      cadence: "Semanal",
      completed: 3,
      total: 8,
      next: "Sesión 4 de 8 · Hoy, 18:00",
      then: "Sesión 5 · Lun 19 de oct",
    },
    startsToday: true,
  },
  {
    title: "Duelo y acompañamiento",
    code: "dul-0937",
    participants: 14,
    materials: 5,
    schedule: {
      kind: "recurring",
      cadence: "Cada 2 semanas",
      completed: 0,
      total: 6,
      next: "Sesión 1 de 6 · Sáb 24 de oct, 11:00",
      then: "Sesión 2 · Sáb 7 de nov",
    },
  },
  {
    title: "Habilidades para madres y padres",
    code: "hab-2210",
    participants: 22,
    materials: 2,
    schedule: { kind: "one-time", date: "Vie 30 de oct, 19:00" },
  },
  {
    title: "Autocuidado para cuidadores",
    code: "",
    participants: 0,
    materials: 0,
    schedule: { kind: "draft" },
  },
];

export const materials: Material[] = [
  {
    name: "Sesión 4 – Respiración diafragmática.pptx",
    kind: "slides",
    size: "8.2 MB",
    usedIn: "Manejo de la ansiedad, sesión 4",
  },
  {
    name: "Registro de pensamientos.pdf",
    kind: "pdf",
    size: "340 KB",
    usedIn: "Manejo de la ansiedad, todas las sesiones",
  },
  {
    name: "Imagen – Lugar seguro.jpg",
    kind: "image",
    size: "2.1 MB",
    usedIn: "Manejo de la ansiedad, sesión 4",
  },
  {
    name: "Relajación muscular progresiva.mp3",
    kind: "audio",
    size: "46 MB",
    usedIn: null,
  },
  {
    name: "Hojas de trabajo – Duelo.pdf",
    kind: "pdf",
    size: "1.4 MB",
    usedIn: "Duelo y acompañamiento, todas las sesiones",
  },
];

export const joinableWorkshops: JoinableWorkshop[] = [
  {
    title: "Manejo de la ansiedad",
    facilitator: "Ana López",
    when: "Sesión 4 de 8 · Empezó hace 12 min",
    live: true,
  },
  {
    title: "Duelo y acompañamiento",
    facilitator: "Luis Ramírez",
    when: "Hoy, 17:00",
    live: false,
  },
  {
    title: "Habilidades para madres y padres",
    facilitator: "Carmen Ruiz",
    when: "Jueves, 10:00",
    live: false,
  },
];

/** The demo session the room shows. */
export const session = {
  workshop: "Manejo de la ansiedad",
  label: "Sesión 4 de 8",
  code: "ans-4821",
  elapsed: "12:04",
  presenting: "Sesión 4 – Respiración diafragmática.pptx",
  waiting: ["Pedro Salas"],
  participants: [
    { name: "Tú", initial: "T", speaking: true },
    { name: "Marco", initial: "M", handRaised: true },
    { name: "Sofía", initial: "S" },
    { name: "Jorge", initial: "J" },
    { name: "Lucía", initial: "L" },
  ] satisfies Participant[],
  chat: [
    { author: "Ana López", text: "¡Bienvenidos! Empezamos en 2 minutos." },
    { author: "Marco", text: "Hola a todos 👋" },
  ] satisfies ChatMessage[],
  materials: [materials[0]!, materials[2]!, materials[1]!],
};
