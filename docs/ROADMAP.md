# Sinapsis: roadmap

Borrador basado en `assets/es/PITCH.md` y `assets/es/RESEARCH.md`. Las fases siguen el orden de prioridad de la investigación: primero validar, luego resolver lo que más duele a psicólogos y terapeutas en México y Latinoamérica, y al final expandir a Estados Unidos. No tiene fechas todavía; cada fase avanza cuando cumple sus criterios de salida.

## Principios que aplican a todas las fases

- **Psicología primero.** Diseñamos para psicólogos y terapeutas; médicos, nutriólogos y otros profesionales vienen después, reutilizando lo que sirva.
- **Celular primero y con poca señal.** Cada funcionalidad debe funcionar en Android de gama baja, sin instalaciones ni cuentas para el paciente.
- **El encuadre lo define el profesional.** La plataforma sostiene sus reglas; no las impone.
- **Fuera de territorio regulado.** No generamos recetas, no somos el expediente clínico legal, no diagnosticamos ni disparamos acciones por riesgo, no emitimos facturas fiscales.
- **Datos sensibles desde el día uno.** La información de salud mental se protege como tal; nada de lo que hoy termina en hojas de cálculo sin cifrar debe repetirse aquí.

## Fase 0: Validación

**Objetivo:** confirmar con profesionales reales lo que la investigación solo muestra de forma cualitativa o con datos de proveedores.

- Entrevistas directas con psicólogos y terapeutas en México y Argentina, incluyendo clínicas universitarias.
- Revisar grupos de Facebook y foros (incluido Reddit) de psicólogos mexicanos y argentinos, que la investigación no pudo consultar.
- Preguntas a responder:
  - ¿Cuánto tiempo y desgaste les cuesta realmente WhatsApp? (Los datos duros en México son de médicos, no de psicólogos.)
  - ¿Estarían dispuestos a mover a sus pacientes a otro canal, y qué tendría que tener para que el paciente acepte?
  - ¿Qué cuestionarios usan y cómo los aplican hoy?
  - ¿Qué tan común es el paciente que solo tiene celular o mala conexión?
  - ¿Cómo manejan hoy cobros, comprobantes y datos para CFDI?

**Criterio de salida:** un problema principal confirmado por los entrevistados y un grupo de terapeutas dispuestos a participar en el piloto.

## Fase 1: Núcleo (MVP)

**Objetivo:** reemplazar WhatsApp + Zoom/Meet + Google Forms para una práctica individual de psicología.

- **Perfiles:** profesional con su encuadre (horario de atención, tiempo de respuesta, respuesta automática, ruta para emergencias) y paciente con ubicación habitual, contacto de emergencia y datos de facturación.
- **Citas:** agenda propia, video y solo audio, sala de espera ligada a la cita y liga fija.
- **Canal con encuadre:** mensajes por paciente dentro de las reglas del profesional, con la opción de llevar un mensaje a la agenda de la próxima sesión.
- **Espacio compartido por sesión:** antes (recordatorio, acceso en un toque, "¿cómo llegas hoy?", cuestionario), durante (notas y hojas de trabajo) y después (resumen, tarea, próxima cita).
- **Seguimiento psicométrico:** PHQ-9, GAD-7 y DASS-21 en sus versiones validadas en español, calificación automática, gráfica de evolución y aviso al profesional ante reactivos de riesgo.
- **Conexión resistente:** respaldo de solo audio y reconexión automática.
- **Integraciones:** WhatsApp (solo plantillas de recordatorio y ligas) y correo electrónico.

**Criterio de salida:** un terapeuta puede llevar a todos sus pacientes de principio a fin sin salir de Sinapsis.

## Fase 2: Piloto en México

**Objetivo:** demostrar con datos que Sinapsis reduce la carga invisible.

- Un grupo pequeño de terapeutas en México usando Sinapsis con sus pacientes reales.
- Agregar las **ayudas de privacidad en casa**: recordatorio para buscar un espacio, sugerencia de audífonos, señal discreta de "no estoy solo" y cambio a chat dentro de la sesión.
- Agregar el **"llámame por teléfono"** cuando la sesión se corta.
- Medir antes y después:
  - Mensajes recibidos fuera de horario.
  - Inasistencias y cancelaciones tardías.
  - Tiempo administrativo por semana (reagendas, cuestionarios, cobros).
  - Cuestionarios completados antes de la sesión.
  - Sesiones que se cortaron y cuántas se recuperaron con audio o teléfono.

**Criterio de salida:** mejora visible en esas métricas y terapeutas que quieran seguir usándolo.

## Fase 3: Diferenciadores clínicos

**Objetivo:** cubrir lo que las herramientas genéricas y las de telesalud no resuelven.

- **Ritmo de sesión:** tiempo restante visible solo para el terapeuta, aviso de cierre, ocultar la autovista y libreta privada.
- **Sesiones preparadas para crisis:** contacto de emergencia y líneas de crisis locales por paciente, reconexión en un toque y plantilla de mensaje de seguimiento. Apoya el criterio del terapeuta; no es un protocolo automático.
- **Parejas, familias y grupos:** entrar desde uno o varios dispositivos, vista con todos los integrantes, turno de palabra, espacio privado para hablar con uno solo y aviso de audífonos en grupos.
- **Sala para niños:** pizarrón para dibujar, objetos de juego sencillos y vista para el cuidador.
- **Bandeja de documentos del paciente:** estudios, reportes y cartas subidos por el paciente, y documentos compartidos por el profesional, etiquetados y fechados.
- **Integración:** importar documentos de los sistemas del profesional (expediente, receta electrónica) para compartirlos.

## Fase 4: Flujo administrativo

**Objetivo:** cerrar el ciclo administrativo sin convertirnos en producto fiscal.

- **Cierre administrativo:** pedir una sola vez los datos para CFDI y guardar comprobantes de pago por paciente, con exportación a la herramienta de facturación del profesional.
- **Calendarios:** sincronización en ambos sentidos con Google, Outlook e iCal, y reagenda por el paciente dentro de las reglas del profesional.
- **Supervisión e intérpretes:** invitar a un supervisor (observador, sin audio) o a un intérprete, siempre visible para el paciente. Útil para clínicas universitarias, comunes en Latinoamérica.

## Fase 5: Expansión

- **Otras profesiones de la salud:** médicos, nutriólogos, terapeutas físicos y consejeros deportivos, con lo que necesiten cambiar del núcleo.
- **Estados Unidos:** interfaz en inglés y soporte fuerte para práctica híbrida. Ahí el estándar mínimo (sala de espera, liga fija, sin descargas) ya existe, así que la propuesta se apoya en el canal con encuadre, el espacio compartido y los modos para parejas, familias y niños.
- **Instrumentos con licencia** (como el BDI-II) solo a través de los canales de sus editoriales.

## Preguntas abiertas

- **Calidad de los datos:** varias cifras vienen de proveedores (70% de médicos en WhatsApp, 30–60 mensajes por semana, estadísticas de Doctoralia) y algunas encuestas son de la pandemia. La Fase 0 debe confirmarlas o descartarlas.
- **Cobro de honorarios en EE. UU.:** allá el flujo administrativo gira alrededor de aseguradoras y portales. Falta decidir si entra en el alcance y cómo, sin cruzar los límites regulatorios.
- **Modelo de negocio:** la investigación no cubre precios; queda por definir.
