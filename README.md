# Mateo & Julieth — invitación de matrimonio

Página de invitación de estilo **editorial**: fotografía cinematográfica a sangre
completa, paleta verde bosque + off-white, tipografía script + serif, y un
cronograma vertical. Inspirada en invitaciones tipo *Hayden & Julianna* / *Mark & Ashley*.

**Fecha:** 3 de octubre de 2026, 4:00 p.m. · **Lugar:** Retiro San Juan, La Calera (Bogotá)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist para publicar
npm run preview  # previsualiza el build
```

## Secciones

Inicio (hero) · Fecha + cuenta regresiva · Nuestra historia · El lugar ·
Detalles · Cronograma · RSVP · Footer.

## Estructura

```
index.html          Contenido y estructura de todas las secciones
src/styles.css       Diseño: tokens de color, tipografía, layout y responsive
src/main.js          Punto de entrada: conecta los módulos + estado del nav
src/particles.js     Motas de luz WebGPU/TSL sobre el hero (capa atmosférica)
src/countdown.js     Cuenta regresiva en vivo
src/reveal.js        Aparición al hacer scroll (con red de seguridad anti-blanco)
src/rsvp.js          Formulario de confirmación
public/images/       Fotografías de fondo (placeholders, ver abajo)
```

## ⚠️ Fotografías — reemplazar por las suyas

Las imágenes en `public/images/` son **placeholders**. Reemplaza cada archivo
manteniendo el mismo nombre (no hay que tocar código):

| Archivo | Dónde aparece | Foto sugerida | Proporción ideal |
|---|---|---|---|
| `hero.jpg` | Portada a sangre completa | pareja en las escalinatas | vertical/horizontal, texto encima |
| `historia.jpg` | "Nuestra historia" | subway / retrato | vertical 4:5 |
| `detalle.jpg` | Franja de detalle | zapatos / manos (detalle) | horizontal ancha |
| `venue.jpg` | "El lugar" (La Calera) | paisaje del lugar | horizontal, lado izq. oscuro |
| `schedule-dark.jpg` | "Cronograma" | foto oscura/atmosférica | horizontal, oscura |

## Personalización rápida

- **Textos, horas, direcciones:** `index.html`.
- **Fecha exacta:** `WEDDING_DATE` en `src/main.js`.
- **Colores y tipografías:** variables `:root` en `src/styles.css`.
- **Densidad de las motas de luz:** `PARTICLE_COUNT` en `src/particles.js`.

## RSVP — confirmación de asistencia

Formulario de 3 campos: **Nombre**, **Teléfono** y **Confirmar asistencia**.

- El campo **Nombre** es un *combobox*: el invitado busca su nombre en una lista
  y también puede escribir uno libre. Para cargar tu lista real de invitados,
  edita el arreglo `GUEST_LIST` al inicio de [`src/combobox.js`](src/combobox.js)
  (la búsqueda ignora mayúsculas y tildes).

### Recibir las confirmaciones en una hoja de cálculo de Google

Las respuestas se envían a una Google Sheet (y, además, se guardan en `localStorage`
como respaldo). Configúralo una sola vez:

1. Crea una hoja nueva en [sheets.new](https://sheets.new).
2. **Extensiones → Apps Script**. Borra todo y pega el contenido de
   [`google-apps-script.gs`](google-apps-script.gs).
3. Ejecuta una vez la función `prepararEncabezados` (botón ▶) y autoriza los permisos.
4. **Implementar → Nueva implementación → Aplicación web**
   · Ejecutar como: **Yo** · Acceso: **Cualquier persona**. Copia la URL `…/exec`.
5. Pega esa URL en la constante `RSVP_ENDPOINT` al inicio de
   [`src/rsvp.js`](src/rsvp.js).

Listo: cada confirmación agrega una fila (Fecha · Nombre · Teléfono · Asistencia).
Mientras `RSVP_ENDPOINT` esté vacío, el formulario funciona igual pero solo guarda local.

## Notas de diseño

- Construida con apoyo de dos skills: **webgpu-threejs-tsl** (efectos WebGPU) e
  **impeccable** (guía de diseño). El detector de impeccable corre con **0
  anti-patrones** sobre `index.html` + `src/`.
- WebGPU degrada con elegancia: si el navegador no lo soporta, el hero se ve
  perfecto solo con la fotografía.
- Requiere Three.js r171+ y un navegador con WebGPU (Chrome/Edge 113+, Safari 18+)
  para las motas de luz.
```
```
# wedding-bogota
