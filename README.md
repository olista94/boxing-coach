# Boxing Coach v2 — PWA con tutoriales

Mantiene la v1 (asaltos y 27 combinaciones) y añade **Tutoriales**: 6 golpes, 5 defensas y 5 fichas de combinaciones destacadas. Desde cualquier combinación del entrenamiento puedes abrir su ficha.

## Multimedia
- Imágenes esquemáticas originales: `media/images/*.svg`. Son ilustraciones orientativas, **no fotogramas ni demostraciones técnicas exactas**. Sustitúyelas por imágenes propias/licenciadas si quieres.
- Vídeos: coloca MP4/WebM propios o con permiso en `media/videos/` y cambia `videoLocal:null` por `videoLocal:'./media/videos/1.mp4'` en la ficha deseada dentro de `tutorials.js`.
- Un enlace externo verificado de Pullmans Gym sirve como apoyo para esquivas y movimientos bajo ganchos. No se descarga ni incrusta material ajeno. Las demás fichas contienen enlaces a referencias generales, **no vídeos individuales verificados**.
- Los MP4 locales declarados deben añadirse a la lista `FILES` de `sw.js` si quieres que se descarguen para uso sin conexión. Valora el tamaño antes de hacerlo.
- `tutorials-data.json` es una copia legible de las fichas; **para editar la app que se ejecuta hay que modificar `TUTORIALS` en `tutorials.js`**.

## Instalación
1. Sube **el contenido de esta carpeta** (no la carpeta contenedora) a la raíz de un repositorio GitHub.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Abre el enlace HTTPS en Chrome/Android o Safari/iPhone y usa «Añadir a pantalla de inicio».
4. Tras entrar una vez con conexión, las fichas y las ilustraciones funcionan sin conexión. Los enlaces externos necesitan internet.

Para probar en PC: `python -m http.server 8000` desde esta carpeta y visita http://localhost:8000.

## Advertencias
Los ejercicios de defensa representan ataques imaginarios del rival: un slip corresponde normalmente a golpes rectos, y el roll por debajo a ganchos. La respuesta depende de distancia, guardia y situación. No se debe presentar una secuencia como respuesta universal. Los dibujos de esta versión son esquemáticos y no sustituyen una demostración de un entrenador.
