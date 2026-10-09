# 🔁 Sinapsis: flujo de trabajo

> Cómo se convierte una etapa del [roadmap](ROADMAP.md) en trabajo: la estructura de milestones, historias y tareas en GitHub, los [tableros](boards/README.md) que las agrupan por dominio, y el ciclo guiado por pruebas que sigue cada historia.

## 🗂️ Estructura en GitHub

El trabajo se divide en tres niveles:

|Nivel|Equivale a|En GitHub|Cuándo se crea|
|---|---|---|---|
|Milestone|Una etapa del roadmap|Milestone|Al arrancar la etapa|
|Historia|Un área de la tabla de la etapa|Issue con la etiqueta `story`, asignado al milestone|Al arrancar la etapa|
|Tarea|Un paso concreto para cerrar la historia|Sub-issue de la historia|Sobre la marcha, cuando hace falta|

- **Historias.** Describen el comportamiento y guardan sus casos de prueba con sus IDs. Una historia se cierra cuando todos sus IDs están en verde.
- **Tareas.** No se planean por adelantado: se abren al tomar la historia o cuando aparece trabajo nuevo. Cada tarea nombra los IDs de prueba que pone en verde, si los hay.
- **Etiquetas de etapa.** Cada issue lleva la etiqueta de cada etapa a la que pertenece: `stage:poc`, `stage:validation`, `stage:v1`, `stage:pilot`, `stage:individual`, `stage:clinical`, `stage:admin`, `stage:expansion`. Las historias cuyos casos abarcan varias etapas llevan varias etiquetas.
- **Etiquetas de tablero.** Cada historia y cada tarea lleva exactamente una etiqueta `board:XXX` del [tablero](boards/README.md) de su dominio (`board:AUT`, `board:SES`…). Las tareas heredan el tablero de su historia, salvo que cambien otro dominio. Así el mismo issue se encuentra por su milestone (`milestone:"POC"`) o por su tablero (`label:board:SES`), y cada archivo de tablero guarda el registro de sus tickets.
- **Solo el POC está ordenado.** Sus historias están en orden de construcción. Las demás etapas mantienen su lista de áreas como referencia y se vuelven historias ordenadas cuando arrancan, para no amarrarnos a una meta rígida.

La tabla de historias de una [etapa](stages/) se llena así:

|Columna|Contenido|
|---|---|
|#|Orden de construcción|
|Historia|Nombre de la historia y, entre paréntesis, el prefijo de su tablero, que también es el de sus IDs de prueba|
|Issue|Enlace al issue de la historia|
|IDs de prueba|IDs que la historia debe poner en verde|

📝 El plan de pruebas todavía no existe. Los IDs de prueba siguen la forma `XXX-NNN`, con el prefijo del tablero y numerados por tablero (`SES-001`, `SES-002`…).

## 🧪 Ciclo guiado por pruebas

Cada comportamiento se especifica como caso de prueba antes de construirse, para no suponer nada en el camino.

1. **Toma una historia y abre su primera tarea.** Los casos de prueba de la historia son los criterios de aceptación.
2. **Resuelve primero las decisiones que bloquean.** Si un caso depende de una pregunta abierta, decídela en la historia y actualiza el caso. No elijas una respuesta en el código.
3. **Revisa los límites.** Si el comportamiento roza algo fuera de alcance (recetas, expediente, diagnóstico, facturación fiscal), se discute en la historia antes de escribir pruebas.
4. **Rojo:** escribe las pruebas, nombradas por ID, y comprueba que fallen.
5. **Verde:** implementa el mínimo código que las haga pasar.
6. **Refactoriza** con las pruebas en verde y abre un PR que mencione la tarea y los IDs de prueba.
7. **Registra el ticket** en el archivo de su tablero al abrirlo y actualiza su estado al cerrarlo.
8. **Prueba en condiciones reales.** Antes de cerrar una historia que afecta al paciente o participante, verifícalo en un Android de gama baja con conexión limitada y en español.

⚠️ Un comportamiento sin ID de prueba no se construye. Primero se agrega el caso a la historia, con un ID nuevo.
