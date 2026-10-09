# 🔁 Sinapsis: flujo de trabajo

> Cómo se convierte una etapa del [roadmap](ROADMAP.md) en trabajo: la estructura de milestones, issues y etiquetas en GitHub, y el ciclo guiado por pruebas que sigue cada issue de desarrollo.

## 🗂️ Estructura en GitHub

- **Milestones.** Cada etapa del roadmap es un milestone de GitHub con un issue padre.
- **Issues padre.** Llevan la etiqueta `epic` y agrupan los sub-issues de su etapa.
- **Sub-issues por área.** Cada área de la tabla de una etapa tiene un issue de desarrollo y un issue de pruebas. El issue de desarrollo nombra los IDs de prueba que debe poner en verde; el issue de pruebas guarda los casos completos.
- **Etiquetas de etapa.** Cada issue lleva la etiqueta de cada etapa a la que pertenece: `poc`, `validacion`, `v1`, `piloto`, `consulta-individual`, `clinica`, `admin`, `expansion`. Los issues de pruebas cuyos casos abarcan varias etapas llevan varias etiquetas.

Las tablas de áreas de cada [etapa](stages/) se llenan así:

|Columna|Contenido|
|---|---|
|Área|Nombre del área y, entre paréntesis, el prefijo de sus IDs de prueba|
|Issue de desarrollo|Enlace al sub-issue que construye el área|
|IDs de prueba|IDs que ese issue debe poner en verde|
|Issue de pruebas|Enlace al issue con los casos completos|

📝 El plan de pruebas y la nomenclatura de IDs todavía no existen. Los códigos entre paréntesis en cada área son la propuesta de prefijo.

## 🧪 Ciclo guiado por pruebas

Cada comportamiento se especifica como caso de prueba antes de construirse, para no suponer nada en el camino.

1. **Toma un issue de desarrollo.** Su lista de "Comportamiento a poner en verde" son los criterios de aceptación; los casos completos viven en el issue de pruebas enlazado.
2. **Resuelve primero las decisiones que bloquean.** Si un caso depende de una pregunta abierta, decídela en el issue de pruebas y actualiza el caso. No elijas una respuesta en el código.
3. **Revisa los límites.** Si el comportamiento roza algo fuera de alcance (recetas, expediente, diagnóstico, facturación fiscal), se discute en el issue antes de escribir pruebas.
4. **Rojo:** escribe las pruebas, nombradas por ID, y comprueba que fallen.
5. **Verde:** implementa el mínimo código que las haga pasar.
6. **Refactoriza** con las pruebas en verde y abre un PR que mencione el issue de desarrollo y los IDs de prueba.
7. **Prueba en condiciones reales.** Antes de cerrar un issue que afecta al paciente o participante, verifícalo en un Android de gama baja con conexión limitada y en español.

⚠️ Un comportamiento sin ID de prueba no se construye. Primero se agrega el caso al issue de pruebas, con un ID nuevo.
