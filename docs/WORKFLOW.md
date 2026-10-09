# 🔁 Sinapsis: flujo de trabajo

> Cómo se convierte una etapa del [roadmap](ROADMAP.md) en trabajo: la estructura de milestones, historias y tareas en GitHub, y el ciclo guiado por pruebas que sigue cada historia.

## 🗂️ Estructura en GitHub

El trabajo se divide en tres niveles:

|Nivel|Equivale a|En GitHub|Cuándo se crea|
|---|---|---|---|
|Milestone|Una etapa del roadmap|Milestone|Al arrancar la etapa|
|Historia|Un área de la tabla de la etapa|Issue con la etiqueta `story`, asignado al milestone|Al arrancar la etapa|
|Tarea|Un paso concreto para cerrar la historia|Sub-issue de la historia|Sobre la marcha, cuando hace falta|

- **Historias.** Describen el comportamiento y guardan sus casos de prueba con sus IDs. Una historia se cierra cuando todos sus IDs están en verde.
- **Tareas.** No se planean por adelantado: se abren al tomar la historia o cuando aparece trabajo nuevo. Cada tarea nombra los IDs de prueba que pone en verde, si los hay.
- **Etiquetas de etapa.** Cada issue lleva la etiqueta de cada etapa a la que pertenece: `poc`, `validacion`, `v1`, `piloto`, `consulta-individual`, `clinica`, `admin`, `expansion`. Las historias cuyos casos abarcan varias etapas llevan varias etiquetas.
- **Solo el POC está ordenado.** Sus historias están en orden de construcción. Las demás etapas mantienen su lista de áreas como referencia y se vuelven historias ordenadas cuando arrancan, para no amarrarnos a una meta rígida.

La tabla de historias de una [etapa](stages/) se llena así:

|Columna|Contenido|
|---|---|
|#|Orden de construcción|
|Historia|Nombre de la historia y, entre paréntesis, el prefijo de sus IDs de prueba|
|Issue|Enlace al issue de la historia|
|IDs de prueba|IDs que la historia debe poner en verde|

📝 El plan de pruebas y la nomenclatura de IDs todavía no existen. Los códigos entre paréntesis en cada historia son la propuesta de prefijo.

## 🧪 Ciclo guiado por pruebas

Cada comportamiento se especifica como caso de prueba antes de construirse, para no suponer nada en el camino.

1. **Toma una historia y abre su primera tarea.** Los casos de prueba de la historia son los criterios de aceptación.
2. **Resuelve primero las decisiones que bloquean.** Si un caso depende de una pregunta abierta, decídela en la historia y actualiza el caso. No elijas una respuesta en el código.
3. **Revisa los límites.** Si el comportamiento roza algo fuera de alcance (recetas, expediente, diagnóstico, facturación fiscal), se discute en la historia antes de escribir pruebas.
4. **Rojo:** escribe las pruebas, nombradas por ID, y comprueba que fallen.
5. **Verde:** implementa el mínimo código que las haga pasar.
6. **Refactoriza** con las pruebas en verde y abre un PR que mencione la tarea y los IDs de prueba.
7. **Prueba en condiciones reales.** Antes de cerrar una historia que afecta al paciente o participante, verifícalo en un Android de gama baja con conexión limitada y en español.

⚠️ Un comportamiento sin ID de prueba no se construye. Primero se agrega el caso a la historia, con un ID nuevo.
