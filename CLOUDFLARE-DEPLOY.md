# Publicación de Schettini Floor Solutions

Dominio: **schettinifs.com**. Correo de contacto: **admin@schettinifloor.com**.

## Paquete que se publica

La entrega actual es **schettini-pages-form.zip**. Contiene la carpeta **site/**
con la web compilada, `configure-pages.mjs`, `wrangler.pages.jsonc` y `LEEME.txt`.
La carpeta se publica con Wrangler en el proyecto Pages **schettinifs**, siguiendo
la sección **Paquete de publicación con formulario** de este documento.

La raíz de `site/` contiene `index.html`, `404.html`, `images/`, `_next/`,
`privacy/`, `terms/`, `accessibility/`, `sitemap.xml`, `robots.txt`, `_worker.js`
y `_routes.json`. Estos dos últimos archivos permiten atender `/api/contact`.
El uploader de archivos estáticos de Workers no admite este paquete.

No subas el repositorio, `node_modules`, `.next`, los ZIP originales ni archivos
con secretos. Abrir `index.html` como archivo local no es una prueba válida:
el sitio usa rutas desde la raíz y debe servirse mediante HTTP/HTTPS.

## Publicación y dominio

1. En **Workers & Pages**, abre el proyecto **Pages schettinifs**.
2. Publica `site/` con Wrangler siguiendo los comandos del paquete.
3. En **Custom domains**, asocia **schettinifs.com** al proyecto Pages.
4. Asocia **www.schettinifs.com** si deseas que redirija al dominio principal.
5. Comprueba el certificado y activa **Always Use HTTPS** en la zona del dominio.
6. Comprueba la portada, las páginas legales, una ruta inexistente y la galería.

La carpeta contiene canonical, sitemap y Open Graph con `https://schettinifs.com`.
Las redirecciones `www` → dominio principal y HTTP → HTTPS se administran en la
zona de Cloudflare. Las reglas de hostname no son compatibles con `_redirects`.
No cambies los DNS/MX/TXT de **schettinifloor.com**: es un dominio distinto y
su correo sigue siendo el destinatario de las consultas.

Si la pantalla dice **Worker assets** en vez de **Pages**, no subas todavía:
esta carpeta está preparada para **Pages Direct Upload**. `_worker.js` y
`_routes.json` tienen significado especial allí.

## Formulario sin configuración de envío

Sin configuración adicional, el botón dice **Prepare email request**. Prepara
un borrador en la aplicación de correo del visitante. El visitante revisa y
envía el correo. Si no tiene una aplicación configurada, puede copiar la
solicitud y enviarla a **admin@schettinifloor.com** desde su correo web.

Este modo no envía automáticamente, no almacena solicitudes y no muestra una
confirmación falsa de recepción. Los enlaces directos de correo y teléfono
también están disponibles. La dirección de contacto continúa siendo el
correo confirmado por el propietario, aunque el sitio use un dominio nuevo.

## Activar envío automático con Cloudflare

El envío automático está activo en producción. Los pasos siguientes documentan
su configuración para poder reproducirla; requieren acceso a Cloudflare y
verificación del correo destinatario.

1. Habilita Email Routing/Email Service para **schettinifs.com** y verifica
   **admin@schettinifloor.com** como destinatario. El remitente de las consultas
   será **estimates@schettinifs.com**; no hace falta crear una bandeja nueva para él.
   Revisa los DNS propuestos para el dominio nuevo antes de aplicarlos.
2. Desde la raíz del repositorio, despliega el Worker privado:

   ```bash
   npx wrangler@4.92.0 deploy --config cloudflare/wrangler.mailer.jsonc
   ```

   El Worker no tiene URL pública y solo permite enviar al correo confirmado.
3. El paquete de Pages añade el **Service binding CONTACT_MAILER** hacia
   **schettini-contact-mailer** mediante su configuración de Wrangler.
4. Crea un widget Turnstile con los dominios **schettinifs.com** y
   **www.schettinifs.com**. Si vas a probar en `pages.dev`, añade también el
   hostname real de ese proyecto.
5. Configura **TURNSTILE_SITE_KEY** con el helper del paquete y guarda
   **TURNSTILE_SECRET_KEY** con `pages secret put`, siguiendo los comandos de abajo.
6. Despliega la carpeta `site/` con Wrangler para aplicar la configuración.
7. Prueba una consulta identificada como prueba y comprueba su recepción real
   antes de anunciar el formulario como operativo.

Cuando la configuración esté completa, el sitio cambiará automáticamente el
botón a **Send estimate request**, validará Turnstile en el servidor y solo
mostrará éxito si el servicio de entrega acepta el mensaje. Los fallos ofrecen
el enlace de correo directo. Ninguna clave secreta está dentro del ZIP.

## Analítica e indexación

Cloudflare Web Analytics está presente en la web publicada. La política de
privacidad describe su medición sin cookies y separa la analítica opcional de
Google Analytics, que solo se carga con consentimiento y un Measurement ID real.
Comprueba la recepción de datos en el panel de Cloudflare Web Analytics.

Con el dominio publicado, verifica la propiedad en Google Search Console y
envía **https://schettinifs.com/sitemap.xml**. Tener el sitemap no verifica la
propiedad ni garantiza la indexación.

## Paquete de publicación con formulario

El paquete `schettini-pages-form.zip` contiene `site/` con la web compilada,
`configure-pages.mjs` y `wrangler.pages.jsonc`. Extráelo en Downloads fuera
de un repositorio Git. Así Wrangler publicará en producción en el proyecto
existente `schettinifs`, sin seleccionar una rama de preview accidentalmente.

1. Ejecuta `node configure-pages.mjs` e introduce solo la **Site Key pública**
   del widget Turnstile creado para `schettinifs.com`.
2. Ejecuta `npx wrangler@4.92.0 pages secret put TURNSTILE_SECRET_KEY --project-name schettinifs`.
   Introduce la **Secret Key** en el prompt protegido de Wrangler. No va en
   ningún archivo ni en el chat.
3. Ejecuta `npx wrangler@4.92.0 pages deploy site --project-name schettinifs`.

La configuración añade el service binding `CONTACT_MAILER` hacia
`schettini-contact-mailer` y la variable pública `TURNSTILE_SITE_KEY`. El
paquete conserva `_worker.js` y `_routes.json`, necesarios para `/api/contact`.
La carpeta `site/` de este paquete se publica con Wrangler, no con el uploader
de archivos estáticos de Workers.

Tras la publicación, comprueba `/api/contact`, Turnstile y una consulta real
identificada como prueba, confirmando su recepción en `admin@schettinifloor.com`.
Los redirects de HTTPS y www se administran mediante Cloudflare Redirect Rules;
las reglas de hostname no son compatibles con el archivo Pages `_redirects`.

## Verificación de esta entrega

- Compilación estática y revisión de TypeScript.
- Referencias locales y variantes responsivas de las imágenes.
- Canonical, Open Graph, sitemap, robots y páginas legales.
- Foto del equipo restaurada y ausencia de las miniaturas retiradas.
- Disponibilidad residencial en la FAQ desplegable, sin esa nota en la portada.
- Pruebas del API con entrega simulada, validación, spam y estados de error.
- Borrador de correo y conservación de símbolos y saltos de línea.

La recepción de correos, el DNS, el certificado, la analítica y la comprobación
visual final en dispositivos requieren el entorno publicado. No se enviaron
correos reales durante las pruebas locales.

## Estado de producción comprobado

Comprobaciones realizadas el **13 de octubre de 2026**:

- `https://schettinifs.com` está publicado; HTTPS y la redirección de www están activos.
- `/api/contact` responde en modo servidor y Turnstile aparece en el formulario.
- El usuario envió una solicitud de prueba y confirmó su recepción en
  **admin@schettinifloor.com**.
- Las páginas Privacy, Terms y Accessibility responden con HTTP 200; una ruta
  inexistente devuelve la página 404 personalizada y el estado HTTP 404.
- Cloudflare Web Analytics muestra visitas y vistas de página en su panel.
- La propiedad de dominio está verificada en Google Search Console.
- El sitemap figura como **Correcto**, con **4 páginas descubiertas**.
- La indexación y el posicionamiento dependen del procesamiento posterior de Google.

Conserva el registro TXT de verificación de Google. El dominio
**schettinifloor.com** sigue siendo necesario para el correo de contacto,
aunque la web utilice **schettinifs.com**.

Desarrollo: **Duetech**.
