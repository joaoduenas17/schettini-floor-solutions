# Publicación de Schettini Floor Solutions

Dominio: **schettinifs.com**. Correo de contacto: **admin@schettinifloor.com**.

## Carpeta que se sube

La entrega contiene una carpeta **schettini-upload** y este documento fuera de ella.
Selecciona **schettini-upload** en la pantalla de subida de Cloudflare Pages.
Su raíz contiene `index.html`, `404.html`, `images/`, `_next/`, `privacy/`,
`terms/`, `accessibility/`, `sitemap.xml`, `robots.txt` y `_worker.js`.

No selecciones la carpeta superior del paquete. No hace falta compilar ni subir
el repositorio, `node_modules`, `.next`, los ZIP originales o el código fuente.
Abrir `index.html` como archivo local no es una prueba válida: el sitio usa
rutas desde la raíz y debe servirse mediante HTTP/HTTPS.

## Publicación y dominio

1. En **Workers & Pages**, crea o abre el proyecto **Pages** con Direct Upload.
2. Sube **schettini-upload** y publica la versión.
3. En **Custom domains**, asocia **schettinifs.com** al proyecto Pages.
4. Asocia **www.schettinifs.com** si deseas que redirija al dominio principal.
5. Comprueba el certificado y activa **Always Use HTTPS** en la zona del dominio.
6. Comprueba la portada, las páginas legales, una ruta inexistente y la galería.

La carpeta ya contiene canonical, sitemap y Open Graph con `https://schettinifs.com`.
Incluye las redirecciones `www` → dominio principal y HTTP → HTTPS. La zona
también debe tener HTTPS activo para aplicar la redirección antes de servir contenido.
No cambies los DNS/MX/TXT de **schettinifloor.com**: es un dominio distinto y
su correo sigue siendo el destinatario de las consultas.

Si la pantalla dice **Worker assets** en vez de **Pages**, no subas todavía:
esta carpeta está preparada para **Pages Direct Upload**. `_worker.js` y
`_routes.json` tienen significado especial allí.

## Formulario disponible al subir la carpeta

Sin configuración adicional, el botón dice **Prepare email request**. Prepara
un borrador en la aplicación de correo del visitante. El visitante revisa y
envía el correo. Si no tiene una aplicación configurada, puede copiar la
solicitud y enviarla a **admin@schettinifloor.com** desde su correo web.

Este modo no envía automáticamente, no almacena solicitudes y no muestra una
confirmación falsa de recepción. Los enlaces directos de correo y teléfono
también están disponibles. La dirección de contacto continúa siendo el
correo confirmado por el propietario, aunque el sitio use un dominio nuevo.

## Activar envío automático con Cloudflare

El código está preparado. Estas acciones requieren acceso a la cuenta del
propietario y verificación de su correo; no se han realizado en esta entrega.

1. Habilita Email Routing/Email Service para **schettinifs.com** y verifica
   **admin@schettinifloor.com** como destinatario. El remitente de las consultas
   será **estimates@schettinifs.com**; no hace falta crear una bandeja nueva para él.
   Revisa los DNS propuestos para el dominio nuevo antes de aplicarlos.
2. Despliega el Worker de la carpeta **optional-contact-mailer**:

   ```bash
   npx wrangler deploy --config wrangler.mailer.jsonc
   ```

   El Worker no tiene URL pública y solo permite enviar al correo confirmado.
3. En el proyecto Pages, añade un **Service binding** llamado
   **CONTACT_MAILER** apuntando a **schettini-contact-mailer**.
4. Crea un widget Turnstile con los dominios **schettinifs.com** y
   **www.schettinifs.com**. Si vas a probar en `pages.dev`, añade también el
   hostname real de ese proyecto.
5. En Variables/Secrets del proyecto Pages añade:
   - **TURNSTILE_SITE_KEY**: clave pública del widget.
   - **TURNSTILE_SECRET_KEY**: clave secreta, guardada como secreto.
6. Vuelve a subir la misma carpeta para que los bindings tengan efecto.
7. Prueba una consulta identificada como prueba y comprueba su recepción real
   antes de anunciar el formulario como operativo.

Cuando la configuración esté completa, el sitio cambiará automáticamente el
botón a **Send estimate request**, validará Turnstile en el servidor y solo
mostrará éxito si el servicio de entrega acepta el mensaje. Los fallos ofrecen
el enlace de correo directo. Ninguna clave secreta está dentro del ZIP.

## Analítica e indexación

No hay ninguna cuenta de analítica inventada o conectada en esta entrega.
Se puede activar Cloudflare Web Analytics desde Pages y reflejarlo en la
política. GA4 también está preparado con consentimiento, pero requiere un
Measurement ID real y una nueva compilación.

Con el dominio publicado, verifica la propiedad en Google Search Console y
envía **https://schettinifs.com/sitemap.xml**. Tener el sitemap no verifica la
propiedad ni garantiza la indexación.

## Verificación de esta entrega

- Compilación estática y revisión de TypeScript.
- Referencias locales y variantes responsivas de las imágenes.
- Canonical, Open Graph, sitemap, robots y páginas legales.
- Ausencia de la foto del equipo y de las miniaturas retiradas en la carpeta.
- Pruebas del API con entrega simulada, validación, spam y estados de error.
- Borrador de correo y conservación de símbolos y saltos de línea.

La recepción de correos, el DNS, el certificado, la analítica y la comprobación
visual final en dispositivos requieren el entorno publicado. No se enviaron
correos reales durante las pruebas locales.

Desarrollo: **Duetech**.
