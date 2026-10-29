# Boxing Coach — PWA v1.0

Incluye 27 combinaciones: 16 secuencias atribuidas directamente a guías y 11 variantes de entrenamiento construidas sobre fundamentos publicados. Cada tarjeta enlaza a su referencia y distingue la procedencia. La defensa simula un ataque rival, no garantiza una respuesta universal.

## Instalación

La instalación PWA y el funcionamiento sin conexión requieren **HTTPS** (o `localhost` durante pruebas). Abrir `index.html` directamente como archivo (`file://`) no permite instalar correctamente la PWA.

### Publicación con GitHub Pages
1. Descomprime este ZIP y sube **el contenido de la carpeta** a un repositorio GitHub (ej. `boxing-coach`).
2. Ve a Settings → Pages → Build and deployment → Deploy from a branch, selecciona `main` y `/ (root)` y guarda.
3. Abre `https://TU_USUARIO.github.io/boxing-coach/` desde el móvil.
4. Android/Chrome: menú ⋮ → Añadir a pantalla de inicio / Instalar aplicación. iOS/Safari: Compartir → Añadir a pantalla de inicio.
5. Tras la primera carga completa, las pantallas y el cronómetro funcionan sin conexión. Las fuentes externas requieren internet.

### Prueba local en PC
En esta carpeta, ejecuta `python -m http.server 8000` y abre `http://localhost:8000`. En móvil, usa el enlace HTTPS publicado para instalar la app.

## Funciones
- Asaltos de 1–4 min; descansos de 15–90 s; 1–10 asaltos.
- Cambios de combinaciones configurables entre 5 y 20 s.
- Dificultad, golpes / defensa y guardia diestra / zurda.
- Inicio, pausa, siguiente combinación, reinicio; biblioteca y enlaces a fuentes.
- Preferencias guardadas localmente; archivos disponibles sin red tras la primera carga.

Nota: si bloqueas la pantalla o el navegador suspende la pestaña, el temporizador recupera el tiempo transcurrido al volver, pero no puede dar avisos en segundo plano. Mantén la pantalla activa para ver las combinaciones.
