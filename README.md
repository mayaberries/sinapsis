# Sinapsis

Sinapis - Spanish for synapse -  is a project aimed to create a platform that helps health professionals to organize their work with patients and clients. The idea is to have Zoom/Meet like features but tailored to the health practice. Thus this should solve the different challenges a professional might face when giving remote consultations with generic tools like the forementioned or others like Whatsapp.

## Entities

The entities this platform will englobe can be divided between the users and the resources/artifacts they'll share between them:

- The health practitioner: for example, but not limited to a doctor, psychologist, therapist, sport counselor, nutritionist, etc.
- The patient/client: often mobile-only and used to WhatsApp; holds their own profile with usual location, emergency contact and invoicing details (e.g. CFDI data in Mexico).
- The participants: extra people in a session besides practitioner and patient, such as partners, family members, caregivers, group members, supervisors or interpreters.
- The appointment/session: video, audio-only or in person (hybrid is the norm), with a before–during–after shared space for check-ins, notes, worksheets, summary and homework.
- The contact policy ("encuadre"): the practitioner's office hours, response window, auto-reply and emergency path, which bound all patient messaging.
- The messages: per-patient conversation inside the contact policy, replacing personal WhatsApp; a message can be flagged for the next session's agenda.
- The questionnaires: public-domain psychometrics (PHQ-9, GAD-7, DASS-21) sent before chosen sessions, auto-scored, trended over time and flagging risk items for the practitioner.
- The resources: Probably a health practitioner will have their own tool to create prescriptions which might be strictly regulated. Thus, we won't be contemplating that. Instead we will consider the finished product of the interaction between patient and practitioner like the already generated prescription, lab results, reports, worksheets, payment proofs, etc., organized per patient.


## Integrations

We might need to consider to integrate the tools the patients are more comfortable with like whatsapp and other social media and messaging. But the practitioner should be capable of dispose of such interactions by themselves to avoid fatigue. Instead, common tasks should be automated when possible, like if a patient wants their results sent to them via Whatsapp.

- WhatsApp: outbound templates for reminders, rescheduling links and document delivery; conversations themselves stay inside the platform's contact policy.
- Email: reminders, summaries and document delivery for patients and markets (e.g. US) where it's the norm.
- Calendars: two-way sync with Google, Outlook and iCal so appointments and self-rescheduling never drift apart.
- Phone: a one-tap "call me back" fallback when video or audio drops mid-session, especially at delicate moments.
- Invoicing tools: export of patients' invoicing details (CFDI data in Mexico) and payment proofs to whatever tool the practitioner already uses, without issuing invoices ourselves.
- Practitioners' existing systems (EHR, e-prescription): import of the documents they produce there, like prescriptions or reports, so they can be shared with the patient.
- Psychometric publishers: access to licensed instruments (e.g. BDI-II) only through the publisher's own channels.


