# 🧪 POC: probar que un taller funciona de principio a fin

← [Roadmap](../ROADMAP.md) · Siguiente: [Validación](02-validation.md) →

Construir lo mínimo para tener material con el cual trabajar con los profesionales en la validación. Probar con un taller de prueba lo que más falla hoy: que los participantes entren desde el celular sin instalar nada, que el grupo se vea y se escuche, y que el material se muestre sin depender de compartir pantalla.

📍 Milestone: por crear. 🏔️ Issue padre: por crear.

## 🎬 Qué demuestra la etapa

- La profesional crea un taller y obtiene una liga fija.
- Varios participantes entran desde Android de gama baja, sin cuentas ni instalaciones, y esperan en la sala de espera.
- Todo el grupo se ve en una sola vista, y quien pierde el video sigue en la sesión con solo audio.
- La profesional sube imágenes, un video y un PDF antes de la sesión y los muestra en un clic, sin compartir pantalla.
- La interfaz del participante no repite opciones: las acciones que llevan al mismo objetivo se agrupan bajo un solo punto de entrada, y las opciones secundarias aparecen solo cuando se necesitan.

## ✅ Criterios de salida

- Todos los IDs de prueba asignados a esta etapa están en verde
- Un taller de prueba con la primera profesional del piloto se completa sin salir de Sinapsis
- El POC está listo para mostrarse en las entrevistas de validación

## 🧩 Áreas

| Área                                                                                              | Issue de desarrollo | IDs de prueba | Issue de pruebas |
| ------------------------------------------------------------------------------------------------- | ------------------- | ------------- | ---------------- |
| Preparar el proyecto y el flujo de integración continua                                           |                     |               |                  |
| Crear talleres y su liga fija (TLL)                                                               |                     |               |                  |
| Entrar sin cuenta ni instalación y sala de espera (SES)                                           |                     |               |                  |
| Videollamada de grupo con respaldo de solo audio (GRP)                                            |                     |               |                  |
| Subir y presentar material sin compartir pantalla (MAT)                                           |                     |               |                  |
| Controles grandes y claros para participantes, agrupados por tarea y sin opciones repetidas (UIP) |                     |               |                  |

## ❓ Decisiones abiertas

Cada una bloquea las pruebas que dependen de ella.

|Decisión|Issue|
|---|---|
|Plataforma, stack y conjunto de pruebas||
|Proveedor de video y cómo se degrada a solo audio||
|Formatos y tamaño máximo del material||
