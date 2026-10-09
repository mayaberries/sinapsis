# 🧠 Sinapsis

> Sinapsis (Spanish for synapse) is a platform that helps health professionals organize their work with patients and clients. It offers Zoom/Meet-like features tailored to health practice, so it solves the challenges a practitioner faces when giving remote consultations with generic tools like those, or WhatsApp.

## 🔗 Links of interest

|Doc|What you'll find|
|---|---|
|📣 Pitch ([EN](assets/en/PITCH.md) · [ES](assets/es/PITCH.md))|The product pitch: what we aim to solve and what the pilot includes|
|🔬 Research ([EN](assets/en/RESEARCH.md) · [ES](assets/es/RESEARCH.md))|Practitioners' pain points and the prioritized feature list (Tier 1–3)|
|🗺️ Roadmap ([EN](docs/ROADMAP.md) · [ES](docs/ROADMAP_es.md))|The eight stages in order, with a few points per stage and the open decisions|
|🧪 [POC](docs/stages/01-poc.md)|The current stage: what it demonstrates, exit criteria and stories in build order|
|🧭 [Decisions](docs/DECISIONS.md)|The principles every stage follows and the technical decisions made|
|🔁 [Workflow](docs/WORKFLOW.md)|The shared vocabulary, how stages map to GitHub and the test-driven cycle|
|🗂️ [Boards](docs/boards/README.md)|Stories and tickets grouped by domain across stages|
|📅 [Kalens](https://github.com/mayaberries/kalens)|The scheduling engine the backend is built on|

## 😣 Pain points

From the [research](assets/en/RESEARCH.md):

- WhatsApp is the real consulting room: bookings, reschedules, lab photos, voice notes and "quick questions" arrive at any hour, eroding the practitioner's rest and boundaries.
- For therapists, after-hours contact is clinical, not just admin; the contact policy should be part of the therapeutic frame ("encuadre"), but generic tools can't hold it.
- Remote sessions have no frame: no waiting room tied to the appointment, no time awareness, no structured opening or closing.
- Unstable connections and mobile-only patients, often with low digital literacy, make installs, accounts and desktop links a barrier.
- Patients lack privacy at home (or join from cars) and hold back; therapists working from home face their own interruptions.
- Crisis moments have no plan: no emergency contact or local resources at hand, and no way to reconnect when a call drops.
- Couples, family, group and child work don't fit one face per tile.
- Video fatigue: back-to-back sessions, missing nonverbal cues and self-view wear practitioners out.
- Information is fragmented: questionnaires via Google Forms scored by hand, results in spreadsheets, documents buried in chats, invoicing data (CFDI) chased after each session.
- Even purpose-built tools mean too many clicks, calendars that don't sync and jumping between apps.

From practitioner conversations:

- Workshops (talleres), not just one-on-one sessions, are a common format.
- Sessions often rely on support material like images or slides, and it has to run without lagging.
- Screen sharing in Zoom fails often, breaking sessions that depend on that material.
- Patients are afraid to tap options that look too small or too formal, and get stressed about pressing the wrong thing.
- Practitioners can't easily guide them: "press the green button" works, "press the two dots below the chat" leaves them lost. Bigger, clearer controls with simple icons or drawings would help.
- The patient-facing page should look visibly simpler and less serious, so patients lose their fear of sharing things online.
- Finding files mid-session is stressful when time is short. Practitioners want a folder in the platform where they upload images, videos and PDFs ahead of time, so they can share them in a click ("here's this book", "let's watch this video") without digging through their computer.

## 🧩 Entities

The entities the platform covers divide into the users and the resources they share:

- **The health practitioner:** for example, but not limited to, a doctor, psychologist, therapist, sports counselor or nutritionist.
- **The patient/client:** often mobile-only and used to WhatsApp; holds their own profile with usual location, emergency contact and invoicing details (e.g. CFDI data in Mexico).
- **The participants:** extra people in a session besides practitioner and patient, such as partners, family members, caregivers, group members, supervisors or interpreters.
- **The appointment/session:** video, audio-only or in person (hybrid is the norm), with a before–during–after shared space for check-ins, notes, worksheets, summary and homework.
- **The contact policy ("encuadre"):** the practitioner's office hours, response window, auto-reply and emergency path, which bound all patient messaging.
- **The messages:** per-patient conversation inside the contact policy, replacing personal WhatsApp; a message can be flagged for the next session's agenda.
- **The questionnaires:** public-domain psychometrics (PHQ-9, GAD-7, DASS-21) sent before chosen sessions, auto-scored, trended over time and flagging risk items for the practitioner.
- **The resources:** practitioners likely have their own tools for creating prescriptions, which may be strictly regulated, so we don't cover that. Instead we handle the finished products of the interaction between patient and practitioner, like already-issued prescriptions, lab results, reports, worksheets and payment proofs, organized per patient.

## 🔌 Integrations

Patients are most comfortable with WhatsApp and other social media and messaging apps, so we may integrate with them. But the practitioner shouldn't have to manage those interactions by hand, to avoid fatigue. Instead, common tasks should be automated when possible, like sending a patient their results via WhatsApp.

- **WhatsApp:** outbound templates for reminders, rescheduling links and document delivery; conversations themselves stay inside the platform's contact policy.
- **Email:** reminders, summaries and document delivery for patients and markets (e.g. US) where it's the norm.
- **Calendars:** two-way sync with Google, Outlook and iCal so appointments and self-rescheduling never drift apart.
- **Phone:** a one-tap "call me back" fallback when video or audio drops mid-session, especially at delicate moments.
- **Invoicing tools:** export of patients' invoicing details (CFDI data in Mexico) and payment proofs to whatever tool the practitioner already uses, without issuing invoices ourselves.
- **Practitioners' existing systems (EHR, e-prescription):** import of the documents they produce there, like prescriptions or reports, so they can be shared with the patient.
- **Psychometric publishers:** access to licensed instruments (e.g. BDI-II) only through the publisher's own channels.
