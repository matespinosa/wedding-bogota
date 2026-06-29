---
name: "Mateo & Julieth"
description: "Una invitación espiritual y contemporánea entre naturaleza, fotografía y papel editorial."
colors:
  primary-forest: "#34402F"
  primary-forest-deep: "#232B20"
  accent-brass: "#97783F"
  botanical-paper: "#F1F0EA"
  botanical-ink: "#232A22"
  editorial-paper: "#FBFBF9"
  editorial-ink: "#191714"
  editorial-muted: "#6A6762"
typography:
  signature-script:
    fontFamily: "Italianno, Tangerine, Cormorant Garamond, cursive"
    fontSize: "clamp(4.2rem, 11vw, 7.2rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  botanical-headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3.4rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "0.01em"
  editorial-display:
    fontFamily: "Bodoni Moda, Didot, Times New Roman, serif"
    fontSize: "clamp(2.6rem, 7.5vw, 5.6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "0.01em"
  botanical-body:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.18rem"
    fontWeight: 400
    lineHeight: 1.7
  editorial-body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Jost, Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  sharp: "2px"
  editorial: "7px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  section: "clamp(5rem, 12vw, 9rem)"
components:
  button-botanical-primary:
    backgroundColor: "{colors.primary-forest}"
    textColor: "{colors.botanical-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "1.05rem 2.2rem"
  button-botanical-outline:
    backgroundColor: "transparent"
    textColor: "{colors.botanical-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "0.95rem 2.2rem"
  button-editorial-primary:
    backgroundColor: "{colors.editorial-ink}"
    textColor: "{colors.editorial-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.editorial}"
    padding: "1.05rem 2.2rem"
  input-botanical:
    backgroundColor: "#ECEAE1"
    textColor: "{colors.botanical-ink}"
    typography: "{typography.botanical-body}"
    rounded: "{rounded.sharp}"
    padding: "0.85rem 1rem"
  input-editorial:
    backgroundColor: "{colors.editorial-paper}"
    textColor: "{colors.editorial-ink}"
    typography: "{typography.editorial-body}"
    rounded: "{rounded.editorial}"
    padding: "0.85rem 1rem"
---

# Design System: Mateo & Julieth

## Overview

**Creative North Star: "Entre Bosque y Papel"**

La identidad vive entre dos materiales: la profundidad orgánica de un jardín al caer la tarde y la precisión serena de una invitación impresa. La propuesta botánica usa fotografía a sangre, verde bosque, latón y caligrafía; la propuesta editorial traduce la misma celebración a papel luminoso, tinta cálida, Bodoni y composiciones amplias.

Ambas expresiones deben sentirse espirituales, cálidas y sobrias. La información logística conserva una jerarquía inequívoca, mientras la fotografía y la tipografía sostienen la emoción. El sistema rechaza las plantillas genéricas de boda, la ornamentación excesiva, las secciones repetidas y cualquier decisión que reste importancia a la ceremonia.

**Key Characteristics:**

- Dos expresiones coordinadas: botánica ceremonial y editorial sobria.
- Fotografía decisiva, nunca decorativa o de relleno.
- Ritmo amplio con secciones de `clamp(5rem, 12vw, 9rem)`.
- Jerarquía tipográfica marcada entre nombres, títulos, cuerpo y etiquetas.
- Controles discretos, casi planos, con estados claros.

**The Two Materials Rule.** Toda superficie debe pertenecer claramente al bosque ceremonial o al papel editorial; nunca mezclar ambas gramáticas dentro de una misma sección.

## Colors

La paleta alterna profundidad vegetal y luminosidad de papel, con latón reservado para acentos ceremoniales.

### Primary

- **Bosque de Promesa** (`primary-forest`): acciones principales, fechas y acentos estructurales de la propuesta botánica.
- **Bosque Profundo** (`primary-forest-deep`): secciones inmersivas como el dress code y estados hover de alto énfasis.

### Secondary

- **Latón Ceremonial** (`accent-brass`): caligrafía secundaria, puntos de cronograma y detalles de muy baja frecuencia.

### Neutral

- **Luz de Papel Botánica** (`botanical-paper`): fondo principal suave de la propuesta 1.
- **Tinta Botánica** (`botanical-ink`): texto y líneas con matiz verde.
- **Luz de Papel Editorial** (`editorial-paper`): casi blanco de la propuesta 2.
- **Tinta Editorial** (`editorial-ink`): texto, botones y reglas principales de la propuesta 2.
- **Gris de Ceremonia** (`editorial-muted`): texto secundario y etiquetas legibles.

**The Brass Restraint Rule.** El latón aparece en menos del 10% de una vista; su rareza comunica ceremonia.

**The Paper Contrast Rule.** Nunca aclarar el texto secundario por debajo de `editorial-muted` o `#5C6157` sobre fondos claros.

## Typography

**Display Font:** Italianno con Cormorant Garamond para la firma botánica v2 (Tangerine se conserva como fallback histórico); Bodoni Moda con Didot para la expresión editorial.  
**Body Font:** Cormorant Garamond en la propuesta botánica; Hanken Grotesk en la propuesta editorial.  
**Label Font:** Jost o Hanken Grotesk, según la propuesta.

**Character:** La caligrafía aporta intimidad y la serif aporta solemnidad. Las sans serif organizan datos, formularios y acciones sin competir con los nombres o los títulos.

### Hierarchy

- **Signature Display** (400, `clamp(4.2rem, 11vw, 7.2rem)`, 0.95): nombres de la pareja en el hero botánico v2, trazo fino Italianno para mayor refinamiento editorial.
- **Editorial Display** (500, `clamp(2.6rem, 7.5vw, 5.6rem)`, 0.98): nombres y declaraciones principales de la propuesta 2.
- **Headline** (500, `clamp(2rem, 5vw, 3.4rem)`, 1.08): títulos de sección.
- **Body** (400, `1rem–1.18rem`, 1.65–1.7): narrativa e información práctica, limitada a 64ch.
- **Label** (400–600, `0.66rem–0.78rem`, `0.16em–0.34em`, mayúsculas): navegación, botones, horarios y etiquetas breves.

**The Script Is a Signature Rule.** El script (Italianno en v2, Tangerine legado) se reserva para nombres y subtítulos afectivos; nunca usarla para instrucciones, horarios o cuerpo largo.

## Elevation

El sistema es plano por defecto. La profundidad proviene del contraste tonal, la fotografía y el solapamiento; las sombras solo elevan fotografías destacadas, el selector de invitados y el pequeño enlace para alternar propuestas.

### Shadow Vocabulary

- **Fotografía Ambiental** (`0 30px 60px -30px rgba(35, 43, 32, 0.5)`): imágenes verticales de historia y cronograma en la propuesta botánica.
- **Fotografía Editorial** (`0 36px 76px -32px oklch(0.2 0.01 70 / 0.58)`): fotografía superpuesta de la propuesta 2.
- **Desplegable Flotante** (`0 18px 40px -22px rgba(35, 43, 32, 0.55)`): menú de resultados del combobox.

**The Flat Ceremony Rule.** Botones, campos y bloques informativos permanecen sin sombra; si un control parece una tarjeta flotante, la elevación es incorrecta.

## Components

### Buttons

- **Shape:** casi recta (2px) en la propuesta botánica; curva editorial contenida (7px) en la propuesta 2.
- **Primary:** bosque con texto claro o tinta editorial con papel; padding `1.05rem 2.2rem`.
- **Hover / Focus:** cambio tonal u opacidad y expansión ligera del tracking; transición con ease-out-quint o ease-out-expo.
- **Outline:** borde de 1px, fondo transparente y relleno sólido al pasar el cursor.

### Chips

- **Style:** cápsula de borde fino únicamente para metadatos breves, como “Formal”; nunca usar chips como decoración repetida.

### Cards / Containers

- **Corner Style:** 0–2px en superficies botánicas; 7px en fotografías editoriales.
- **Background:** papel, variación tonal o fotografía; no existen tarjetas blancas genéricas.
- **Shadow Strategy:** plana por defecto; aplicar solo las sombras documentadas en Elevation.
- **Internal Padding:** escala de 16px, 24px y 32px; secciones con espaciado fluido.

### Inputs / Fields

- **Style:** fondo tonal suave, borde de 1px, tipografía correspondiente a cada propuesta y padding `0.85rem 1rem`.
- **Focus:** el borde cambia a bosque o tinta; el fondo botánico pasa a blanco para reforzar el estado.
- **Error / Disabled:** mensajes visibles en latón o tinta secundaria; controles deshabilitados al 55% de opacidad.

### Navigation

- Fija y transparente sobre el hero; al desplazarse adopta papel translúcido, una división fina y desenfoque moderado.
- Las etiquetas usan sans serif compacta. En móvil, la propuesta 1 simplifica enlaces y la propuesta 2 conserva solo el logotipo.

### Dress Code

- En la invitación principal (propuesta 1) el dress code combina tipografía con dos siluetas de vestuario (mujer y hombre): ilustraciones monocromas en negro sobre fondo blanco, fundidas al papel con `mix-blend-mode: multiply` para que no aparezca el recuadro. La silueta es refinada y editorial, nunca clipart floral ni ornamento genérico de boda.
- Las propuestas alternativas (2 y 3) conservan la composición tipográfica con reglas horizontales y tinta sobre papel.
- Mujeres y hombres tienen igual jerarquía: misma escala de silueta y misma línea descriptiva debajo; se apilan en una sola columna en móvil.

## Do's and Don'ts

### Do:

- **Do** mantener cada sección dentro de una sola gramática: bosque ceremonial o papel editorial.
- **Do** usar fotografías reales como contenido y aplicarles recortes definidos, no como fondos genéricos.
- **Do** limitar el texto largo a 64ch y conservar contraste legible sobre papel y fotografía.
- **Do** respetar `prefers-reduced-motion` y mantener el contenido visible aunque falle JavaScript.
- **Do** dar la misma importancia visual a ceremonia y recepción.

### Don't:

- **Don't** crear plantillas genéricas de boda con tarjetas repetidas, iconos grandes o ornamentos florales intercambiables.
- **Don't** usar ornamentación excesiva ni repetir etiquetas pequeñas en cada sección.
- **Don't** crear jerarquías que resten importancia a la ceremonia.
- **Don't** repetir la misma información logística en varias secciones.
- **Don't** usar clipart o ilustraciones genéricas de boda en el dress code; si se ilustra el vestuario, debe ser una silueta monocroma sobria fundida al papel.
- **Don't** añadir gradientes de texto, glassmorphism, bordes laterales de acento mayores a 1px o sombras decorativas en controles.
