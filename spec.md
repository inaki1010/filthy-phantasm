# Spec: administración interna de clientes

## Revisión del spec original

Los requisitos describían el núcleo —consultar, registrar y buscar clientes—, pero dejaban decisiones importantes abiertas: si los datos debían persistir, si empresa era obligatoria, cómo evitar duplicados, qué debía pasar al guardar con una búsqueda activa y cómo distinguir una lista vacía de una búsqueda sin resultados.

Con tus respuestas, esas decisiones quedan definidas abajo. El alcance es un MVP para un equipo interno, sin autenticación, edición ni eliminación.

## Objetivo

Crear una aplicación web interna sencilla para que el equipo pueda consultar y registrar clientes, con búsqueda y validación clara. Los registros deben persistir al recargar o reiniciar la aplicación en el entorno local de demostración.

## Datos de un cliente

Cada cliente tiene:

- **Nombre:** obligatorio, máximo 120 caracteres.
- **Correo electrónico:** obligatorio, formato válido, máximo 254 caracteres y único.
- **Empresa:** obligatoria, máximo 120 caracteres.

Se quitan los espacios al inicio y al final de los tres campos. Nombre y empresa se rechazan si quedan vacíos después de recortarlos. El correo se compara sin distinguir mayúsculas y después de recortar espacios para detectar duplicados. Se puede conservar el formato ingresado al mostrarlo.

## Flujo principal

1. La persona abre la app y ve la lista de clientes, ordenada con los registros más recientes primero.
2. Puede escribir en la búsqueda para filtrar por coincidencias parciales en nombre o correo, sin distinguir mayúsculas.
3. Pulsa **Registrar cliente**, completa nombre, correo y empresa, y envía el formulario.
4. Si faltan datos, hay un formato inválido, se supera un límite o el correo ya existe, la app muestra el error junto al campo correspondiente y conserva lo ingresado.
5. Si el registro se guarda, la app confirma el éxito, limpia el formulario y la búsqueda activa, y muestra el nuevo cliente en la lista.
6. Si ocurre un fallo de almacenamiento, la app informa que no pudo guardar, conserva el formulario y permite reintentar.

## Criterios de aceptación

1. La lista muestra nombre, correo y empresa de cada cliente.
2. Un cliente se puede registrar con los tres campos completos y válidos.
3. El formulario rechaza nombre, correo o empresa vacíos, incluso si contienen solo espacios.
4. El formulario rechaza correos con formato inválido y valores que superen sus límites.
5. No se acepta un correo ya registrado, aunque cambien sus mayúsculas o tenga espacios al inicio o al final.
6. La búsqueda encuentra coincidencias parciales en nombre y correo, sin distinguir mayúsculas. No busca por empresa.
7. Si aún no hay registros, se muestra un mensaje que invita a registrar el primero.
8. Si una búsqueda no tiene coincidencias, se muestra un mensaje de “sin resultados”.
9. Tras guardar, el formulario se limpia y la lista vuelve a mostrar el nuevo registro, incluso si antes había una búsqueda activa.
10. Los registros siguen disponibles después de recargar o reiniciar la aplicación en la demo local.
11. Si falla el guardado, no se muestra una confirmación de éxito; el formulario conserva los datos y ofrece una vía para reintentar.

## Estados y casos de borde

- **Lista vacía:** mensaje con invitación a registrar el primer cliente.
- **Búsqueda sin coincidencias:** mensaje distinto al de lista vacía.
- **Entrada con espacios:** se recortan los extremos; los campos obligatorios no pueden quedar vacíos.
- **Correo duplicado:** comparación tras recortar espacios y sin distinguir mayúsculas.
- **Límites excedidos:** error claro en el campo correspondiente.
- **Fallo de almacenamiento:** mensaje general, datos conservados y posibilidad de reintento.
- **Guardado con búsqueda activa:** limpiar la búsqueda para que el nuevo cliente quede visible.

## MVP y enfoque técnico

El proyecto ya usa Next.js con Pages Router, TypeScript, Zod y `sql.js`; conviene reutilizar esas herramientas y el patrón de persistencia existente. La solución mínima incluye:

- Una tabla `clients` con los campos del cliente y una fecha de creación para ordenar los registros.
- Una API para listar y registrar clientes, con validación también en el servidor.
- Una interfaz con formulario, lista y búsqueda.
- Una restricción o comprobación en el almacenamiento que impida correos duplicados sin distinguir mayúsculas.
- Mensajes de error y éxito visibles en la interfaz.

La búsqueda puede ejecutarse en la lista ya cargada: para el volumen de una demo pequeña, no hace falta añadir búsqueda en servidor ni paginación. El alcance no incluye inicio de sesión, roles, edición, eliminación, importación ni exportación.

En este proyecto, la persistencia local usa un archivo de base de datos; la demo debe ejecutarse en un entorno que conserve ese archivo. No se requiere despliegue público.

## Demostración

Inicia la app con `npm run dev` y demuestra:

1. El estado inicial sin clientes.
2. El registro de un cliente válido.
3. Los errores por campos vacíos, correo inválido y correo duplicado.
4. La búsqueda por nombre y por correo, y el mensaje cuando no hay coincidencias.
5. Que el cliente sigue en la lista después de recargar la app.
