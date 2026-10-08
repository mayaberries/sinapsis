# Sinapsis: pitch

## Summary

Sinapsis is the digital consulting room for health professionals. It brings together in one place what today is scattered across WhatsApp, Zoom/Meet, Google Forms, email and spreadsheets: sessions, messages with the patient, questionnaires and documents. All within the frame ("encuadre") the practitioner defines.

The platform is designed for psychologists and therapists in private practice in Mexico and Latin America. This first stage focuses on **online workshops**, since they make up most of your online practice. This document describes what the pilot includes, how each part works, what it offers for in-person practice and what we will measure.

## What we aim to solve

**In workshops:**

- **A group doesn't fit in a grid of faces.** Generic tools are built for meetings, not for leading a group: there's no speaking-turn view and no way to talk privately with one participant without interrupting the rest.
- **Support material fails.** Screen sharing in Zoom fails often, and images or slides lag right when the session depends on them. Looking for files mid-session takes time.
- **Participants are afraid of making mistakes.** Small or overly formal-looking options stress them out. Instructions like "press the green button" work; "press the two dots below the chat" don't. With a group, every doubt multiplies.
- **Group privacy.** If a participant doesn't use headphones, whoever is in their home hears what the others share.
- **Unstable connections.** In a survey of 491 mental-health professionals in Latin America, the main difficulties were technology (dropped signal, frozen video, incoming calls) and domestic interruptions. Many participants only have a phone.

**In practice overall:**

- **WhatsApp as the consulting room.** In Mexico, 79% of doctors use instant messaging with their patients, and only 32% use specialized video-consultation platforms at least once a week (FUNSALUD). Bookings, changes, payment proofs and questions arrive at any hour.
- **Invisible load.** A typical practice receives 30 to 60 non-therapy messages a week, and rescheduling an appointment takes 6 to 10 messages (vendor estimates). Replying after hours signals that limits are flexible.
- **Clinical cost.** Some late-night messages are driven by the patient's attachment needs. The contact policy should be part of the therapeutic contract, but WhatsApp offers no way to uphold it.
- **Fatigue.** Around 60% of 422 respondents reported video-call fatigue; self-view and back-to-back sessions contribute.
- **Fragmented information.** Questionnaires (PHQ-9, GAD-7) are sent through Google Forms and scored by hand; lab results get buried in the chat; CFDI invoicing details and bank-transfer screenshots are requested over WhatsApp after each session.

## What we know so far

- **Workshops are a common format**, not just one-on-one sessions, and they often rely on images or slides that have to display without lag.
- **The goal isn't to eliminate WhatsApp, but to set limits on it.** Patients prefer it because it's easy. What's missing is structure, not another channel.
- **Messaging works when it has a frame.** In a randomized trial of 850 adults (JAMA Network Open, October 2025), message-based therapy showed no differences from video therapy in depression or social functioning at 12 weeks, as long as frequency, response times and goals were defined.
- **Rapport can be built online.** In a Colombian university clinic, 85.7% of patients said a trusting relationship was possible "always" or "almost always", though it takes more effort from the therapist.
- **Demand arrives after hours.** 43% of online bookings happen outside working hours (Doctoralia, vendor data).

## Design principles

- **Mobile first, low bandwidth.** Everything must work on low-end Android, with no installs or accounts for participants.
- **Simple for participants.** Large buttons, clear icons and a less serious look than the practitioner's side, so they lose their fear of using it and you can guide them with simple instructions.
- **The practitioner defines the frame.** The platform upholds your rules; it doesn't impose them.
- **Sensitive data from day one.** Mental-health information is protected as such. Nothing that ends up in unencrypted spreadsheets today is repeated here.

## What the pilot includes: online workshops

1. **Workshop and participants.** Each workshop, of one or several sessions, has its own participant list. Each participant has a profile with their usual location, emergency contact and invoicing details, and joins without installing anything or creating an account.
2. **Sessions.** Video or audio only, one fixed link for the whole workshop and a waiting room tied to the session.
3. **Group view.** All participants visible, a speaking-turn view and a private space to talk with a single participant without interrupting the group. It works the same when several participants join from one device.
4. **Material library.** A folder where you upload images, videos and PDFs before the session, to share them in one click without searching your computer.
5. **Lag-free presentation.** Material is shown from the platform, without relying on screen sharing, and adapts to each participant's connection.
6. **Shared workshop space.** Before: reminder, one-tap join and pre-session material. During: material, whiteboard and worksheets. After: summary, homework and the date of the next session, available to the whole group.
7. **Group privacy.** A prompt to use headphones and find a private space, a discreet "I'm not alone" signal and a switch to chat if someone walks into the room.
8. **Resilient connection.** Audio-only fallback and automatic reconnection to the same session.
9. **Reminders and messages.** Reminders over WhatsApp (templates, no conversations) and email. Participants' questions arrive in a channel with your office hours visible, your response time and your auto-reply, not in your personal WhatsApp.
10. **Payments.** Each participant uploads their payment proof and CFDI details once; you export them to your invoicing tool.

## In the consulting room

Practice is often hybrid, so several parts of Sinapsis also serve in-person sessions:

- **One calendar.** In-person and online appointments live in the same calendar, with reminders over WhatsApp and email.
- **Frame-bound channel.** Messages between sessions follow the same rules wherever the appointment takes place. You can flag a message to address in the next session.
- **Pre-session questionnaires.** The patient fills in the PHQ-9, GAD-7 or DASS-21 on their phone before arriving, and you review the trend chart together in session.
- **Shared space per session.** The summary, homework and next appointment are available after an in-person session, just as online.
- **Material library.** The same material from your workshops can be shown on a screen in the office or sent to the patient afterwards.
- **Documents and payments.** Lab results, reports, worksheets, payment proofs and CFDI details are organized per patient instead of in the chat.

## What we will measure

We'll compare your workshops before and during the pilot on:

- Attendance and no-shows per session.
- Participants who lost their connection and how many were recovered by audio or reconnection.
- Failures when presenting material.
- Administrative time per workshop (reminders, changes, payments, sending material).
- Messages received outside office hours.

We also want your and the participants' feedback on what's missing, what gets in the way and what isn't clear.

## Next stage: one-on-one sessions

- **Full frame-bound channel**, with a clear emergency path.
- **Shared space per one-on-one session:** "how are you arriving today?", shared notes, summary and homework.
- **Psychometric follow-up:** PHQ-9, GAD-7 and DASS-21 in their validated Spanish versions, automatic scoring, trend chart and a notification to the practitioner when a risk item is endorsed, with no automated actions.
- **"Call me by phone"** if the session drops.

## Later phases

- **Clinical differentiators:** time remaining visible only to the therapist, wrap-up cue, hiding self-view and a private notepad; crisis-ready sessions (local crisis lines per patient and a follow-up template); couples and family modes; a room for working with children; a patient document inbox.
- **Administrative workflow:** sync with Google, Outlook and iCal, patient self-rescheduling within your rules, and invitations for supervisors or interpreters, always visible to the patient.
- **Expansion:** other health professions and the United States.

## Planned integrations

- **WhatsApp:** reminders, rescheduling links and document delivery, without you managing it by hand. Conversations stay within the frame.
- **Email:** reminders, summaries and documents.
- **Calendars:** two-way sync with Google, Outlook and iCal.
- **Phone:** one-tap "call me" when the session drops.
- **Invoicing tools:** export invoicing details (CFDI) and payment proofs to the tool you already use.
- **Practitioners' systems (health records, e-prescription):** import the documents you produce there to share them with the patient.
- **Psychometric publishers:** licensed instruments (such as BDI-II) only through their official channels.

## What we won't do

To stay out of regulated territory and focus on the relationship:

- We don't generate or validate e-prescriptions; we only share ones already issued.
- We're not the legal clinical record.
- We don't diagnose or run risk assessments that trigger automated actions.
- We don't issue tax invoices; we collect and export the data.

## Open questions

- **Business model:** pricing hasn't been defined yet.
- **Data quality:** some figures come from vendors (the 30 to 60 messages a week, the Doctoralia statistics) and should be taken as directional; the most robust is FUNSALUD's 79%. Evidence on psychologists and workshops is mostly qualitative, and the pilot is meant to confirm or rule it out.
