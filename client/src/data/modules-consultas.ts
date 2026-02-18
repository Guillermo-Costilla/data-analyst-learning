import type { Module } from '../types';

export const modulesConsultas: Module[] = [
    // ─── MÓDULO 4: SELECT Avanzado ────────────────────────────────────────────
    {
        id: 'module-select-avanzado',
        title: 'SELECT Avanzado',
        description: 'Dominá técnicas avanzadas de consulta: TOP, DISTINCT, CASE, IIF, PIVOT y más.',
        icon: '🔍',
        level: 'Intermediate',
        theory: [
            {
                title: 'Fundamentos del SELECT',
                content: `El SELECT es el comando más usado en SQL. Su orden de ejecución lógica es:

1. **FROM** → de qué tabla(s) se leen los datos
2. **WHERE** → se filtran las filas
3. **GROUP BY** → se agrupan las filas
4. **HAVING** → se filtran los grupos
5. **SELECT** → se eligen las columnas y expresiones
6. **ORDER BY** → se ordena el resultado
7. **TOP / OFFSET-FETCH** → se limita la cantidad de filas

Entender este orden es clave para escribir consultas correctas.`,
                codeExample: `-- Estructura completa de un SELECT
SELECT TOP 10
    d.nombre                          AS departamento,
    COUNT(e.id)                       AS total_empleados,
    AVG(e.salario)                    AS salario_promedio,
    MAX(e.salario)                    AS salario_maximo
FROM empleados e
    INNER JOIN departamentos d ON e.depto_id = d.id
WHERE e.activo = 1
GROUP BY d.nombre
HAVING AVG(e.salario) > 50000
ORDER BY salario_promedio DESC;`,
            },
            {
                title: 'CASE, IIF y expresiones condicionales',
                content: `**CASE WHEN** es la expresión condicional de SQL, equivalente al IF/ELSE de otros lenguajes. Se puede usar en SELECT, WHERE, ORDER BY y GROUP BY.

**IIF(condición, valor_si_true, valor_si_false)** es una versión simplificada para condiciones simples.

**NULLIF(a, b)** devuelve NULL si a = b, útil para evitar divisiones por cero.`,
                codeExample: `-- CASE simple
SELECT
    nombre,
    salario,
    CASE
        WHEN salario < 40000 THEN 'Junior'
        WHEN salario < 80000 THEN 'Semi-Senior'
        WHEN salario < 120000 THEN 'Senior'
        ELSE 'Lead'
    END AS nivel,
    -- IIF para condición simple
    IIF(activo = 1, 'Activo', 'Inactivo') AS estado,
    -- CASE en ORDER BY
    salario * CASE WHEN departamento = 'Ventas' THEN 1.10 ELSE 1.0 END AS salario_ajustado
FROM empleados
ORDER BY
    CASE departamento
        WHEN 'Dirección' THEN 1
        WHEN 'Ventas' THEN 2
        ELSE 3
    END;`,
            },
            {
                title: 'DISTINCT, TOP y paginación con OFFSET-FETCH',
                content: `**DISTINCT** elimina filas duplicadas del resultado.

**TOP n** limita el resultado a n filas. Con **TOP n PERCENT** devuelve un porcentaje.

**OFFSET-FETCH** es la forma estándar de paginación en SQL Server 2012+:
- OFFSET n ROWS → saltea n filas
- FETCH NEXT m ROWS ONLY → devuelve m filas`,
                codeExample: `-- DISTINCT: departamentos únicos
SELECT DISTINCT departamento FROM empleados ORDER BY departamento;

-- TOP con porcentaje
SELECT TOP 10 PERCENT nombre, salario
FROM empleados
ORDER BY salario DESC;

-- TOP WITH TIES: incluye empates
SELECT TOP 3 WITH TIES nombre, salario
FROM empleados
ORDER BY salario DESC;

-- Paginación: página 2, 10 registros por página
SELECT nombre, salario
FROM empleados
ORDER BY nombre
OFFSET 10 ROWS          -- saltear primera página
FETCH NEXT 10 ROWS ONLY; -- traer segunda página`,
            },
        ],
        exercises: [
            {
                id: 'ex-sel-1',
                title: 'Clasificar empleados con CASE',
                description: 'Escribí una consulta que muestre el nombre, salario y una columna "categoria" calculada con CASE: "Junior" si salario < 40000, "Semi-Senior" si < 80000, "Senior" si < 120000, y "Lead" en cualquier otro caso. Ordená por salario descendente.',
                level: 'Intermediate',
                schema: `Tabla: empleados
─────────────────────────────
  id           INT (PK)
  nombre       NVARCHAR(100)
  departamento NVARCHAR(50)
  salario      DECIMAL(10,2)`,
                initialCode: `SELECT
    nombre,
    salario,
    CASE
        WHEN `,
                solution: `SELECT
    nombre,
    salario,
    CASE
        WHEN salario < 40000  THEN 'Junior'
        WHEN salario < 80000  THEN 'Semi-Senior'
        WHEN salario < 120000 THEN 'Senior'
        ELSE 'Lead'
    END AS categoria
FROM empleados
ORDER BY salario DESC;`,
                hint: 'El CASE evalúa las condiciones en orden. Asegurate de cerrar con END y darle un alias con AS.',
            },
            {
                id: 'ex-sel-2',
                title: 'Paginación con OFFSET-FETCH',
                description: 'Implementá paginación: mostrá la tercera página de empleados, con 5 registros por página, ordenados por nombre. (Página 3 = saltear 10 registros).',
                level: 'Intermediate',
                schema: `Tabla: empleados
─────────────────────────────
  id      INT (PK)
  nombre  NVARCHAR(100)
  salario DECIMAL(10,2)`,
                initialCode: `SELECT nombre, salario
FROM empleados
ORDER BY nombre
OFFSET `,
                solution: `SELECT nombre, salario
FROM empleados
ORDER BY nombre
OFFSET 10 ROWS
FETCH NEXT 5 ROWS ONLY;`,
                hint: 'Para la página 3 con 5 registros por página: OFFSET = (3-1) * 5 = 10 filas a saltear.',
            },
        ],
        test: {
            id: 'test-select',
            title: 'Prueba Técnica: SELECT Avanzado',
            description: 'Evaluá tu dominio de las técnicas avanzadas de consulta.',
            questions: [
                {
                    id: 'q1',
                    question: '¿En qué orden se ejecuta lógicamente un SELECT con GROUP BY?',
                    options: [
                        'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY',
                        'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY',
                        'FROM → SELECT → WHERE → GROUP BY → ORDER BY',
                        'WHERE → FROM → SELECT → GROUP BY → ORDER BY',
                    ],
                    correctIndex: 1,
                    explanation: 'El orden lógico de ejecución es: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Esto explica por qué no podés usar alias del SELECT en el WHERE.',
                },
                {
                    id: 'q2',
                    question: '¿Cuál es la diferencia entre WHERE y HAVING?',
                    options: [
                        'No hay diferencia',
                        'WHERE filtra filas antes del GROUP BY; HAVING filtra grupos después del GROUP BY',
                        'HAVING filtra filas; WHERE filtra grupos',
                        'WHERE solo funciona con texto; HAVING con números',
                    ],
                    correctIndex: 1,
                    explanation: 'WHERE se aplica antes de agrupar (filtra filas individuales). HAVING se aplica después del GROUP BY (filtra grupos). Por eso HAVING puede usar funciones de agregación como AVG(), COUNT(), etc.',
                },
                {
                    id: 'q3',
                    question: '¿Qué hace TOP 5 WITH TIES?',
                    options: [
                        'Devuelve exactamente 5 filas',
                        'Devuelve las 5 primeras filas más todas las que empaten en el último valor',
                        'Devuelve 5 filas aleatorias',
                        'Es un error de sintaxis',
                    ],
                    correctIndex: 1,
                    explanation: 'WITH TIES incluye todas las filas que tengan el mismo valor que la última fila del TOP. Por ejemplo, si hay 3 empleados con el mismo salario en la posición 5, devuelve 7 filas.',
                },
            ],
        },
    },

    // ─── MÓDULO 5: JOINs ─────────────────────────────────────────────────────
    {
        id: 'module-joins',
        title: 'JOINs — Unión de Tablas',
        description: 'Combiná datos de múltiples tablas con INNER, LEFT, RIGHT y FULL OUTER JOIN. Con diagramas visuales.',
        icon: '🔗',
        level: 'Intermediate',
        theory: [
            {
                title: 'Tipos de JOIN y cuándo usarlos',
                content: `Los JOINs combinan filas de dos o más tablas basándose en una condición de unión (generalmente una clave foránea).

**INNER JOIN** → Solo devuelve filas que tienen coincidencia en AMBAS tablas. Es el más común.

**LEFT JOIN (LEFT OUTER JOIN)** → Devuelve TODAS las filas de la tabla izquierda, y las coincidencias de la derecha. Si no hay coincidencia, las columnas de la derecha son NULL.

**RIGHT JOIN (RIGHT OUTER JOIN)** → Devuelve TODAS las filas de la tabla derecha, y las coincidencias de la izquierda.

**FULL OUTER JOIN** → Devuelve TODAS las filas de AMBAS tablas. Donde no hay coincidencia, las columnas del otro lado son NULL.

**CROSS JOIN** → Producto cartesiano: combina cada fila de la izquierda con cada fila de la derecha.

**SELF JOIN** → Una tabla unida consigo misma (útil para jerarquías).`,
                codeExample: `-- INNER JOIN: solo pedidos con cliente existente
SELECT c.nombre, p.monto, p.fecha
FROM pedidos p
    INNER JOIN clientes c ON p.cliente_id = c.id;

-- LEFT JOIN: todos los clientes, tengan o no pedidos
SELECT c.nombre, p.monto
FROM clientes c
    LEFT JOIN pedidos p ON c.id = p.cliente_id;

-- Clientes SIN pedidos (filtrar NULLs del LEFT JOIN)
SELECT c.nombre
FROM clientes c
    LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;

-- FULL OUTER JOIN
SELECT c.nombre, p.monto
FROM clientes c
    FULL OUTER JOIN pedidos p ON c.id = p.cliente_id;

-- SELF JOIN: empleado y su jefe
SELECT e.nombre AS empleado, j.nombre AS jefe
FROM empleados e
    LEFT JOIN empleados j ON e.jefe_id = j.id;`,
            },
            {
                title: 'JOINs múltiples y buenas prácticas',
                content: `Podés encadenar múltiples JOINs en una sola consulta. Cada JOIN agrega una tabla más al resultado.

**Buenas prácticas:**
- Siempre usá alias de tabla (e, c, p) para mayor legibilidad
- Especificá el tipo de JOIN explícitamente (no uses la coma antigua)
- Asegurate de que la condición ON sea sobre columnas indexadas
- Evitá JOINs sobre expresiones calculadas (impiden el uso de índices)`,
                codeExample: `-- JOIN de 4 tablas
SELECT
    c.nombre                    AS cliente,
    p.fecha                     AS fecha_pedido,
    pr.nombre                   AS producto,
    cat.nombre                  AS categoria,
    dp.cantidad,
    dp.precio_unitario,
    dp.cantidad * dp.precio_unitario AS subtotal
FROM pedidos p
    INNER JOIN clientes c        ON p.cliente_id    = c.id
    INNER JOIN detalle_pedido dp ON p.id            = dp.pedido_id
    INNER JOIN productos pr      ON dp.producto_id  = pr.id
    LEFT  JOIN categorias cat    ON pr.categoria_id = cat.id
WHERE p.fecha >= '2024-01-01'
ORDER BY p.fecha DESC, c.nombre;`,
            },
        ],
        exercises: [
            {
                id: 'ex-join-1',
                title: 'INNER JOIN básico',
                description: 'Mostrá el nombre del empleado, el nombre de su departamento y su salario. Usá INNER JOIN entre `empleados` y `departamentos`.',
                level: 'Intermediate',
                schema: `Tabla: empleados
─────────────────────────────
  id        INT (PK)
  nombre    NVARCHAR(100)
  depto_id  INT (FK → departamentos.id)
  salario   DECIMAL(10,2)

Tabla: departamentos
─────────────────────────────
  id      INT (PK)
  nombre  NVARCHAR(50)
  piso    INT`,
                initialCode: `SELECT e.nombre, d.nombre AS departamento, e.salario
FROM empleados e
    INNER JOIN `,
                solution: `SELECT e.nombre, d.nombre AS departamento, e.salario
FROM empleados e
    INNER JOIN departamentos d ON e.depto_id = d.id
ORDER BY d.nombre, e.salario DESC;`,
                hint: 'Usá alias (e para empleados, d para departamentos) y uní con ON e.depto_id = d.id.',
            },
            {
                id: 'ex-join-2',
                title: 'LEFT JOIN — Encontrar registros sin relación',
                description: 'Listá todos los departamentos y, si tienen empleados, mostrá cuántos tienen. Incluí departamentos sin empleados (deben mostrar 0). Usá LEFT JOIN y COUNT.',
                level: 'Intermediate',
                schema: `Tabla: departamentos
─────────────────────────────
  id      INT (PK)
  nombre  NVARCHAR(50)

Tabla: empleados
─────────────────────────────
  id        INT (PK)
  nombre    NVARCHAR(100)
  depto_id  INT (FK → departamentos.id)`,
                initialCode: `SELECT d.nombre AS departamento, COUNT(e.id) AS total_empleados
FROM departamentos d
    LEFT JOIN `,
                solution: `SELECT d.nombre AS departamento, COUNT(e.id) AS total_empleados
FROM departamentos d
    LEFT JOIN empleados e ON d.id = e.depto_id
GROUP BY d.nombre
ORDER BY total_empleados DESC;`,
                hint: 'Con LEFT JOIN, los departamentos sin empleados tendrán e.id = NULL. COUNT(e.id) cuenta solo los no-NULL, devolviendo 0 para esos departamentos.',
            },
            {
                id: 'ex-join-3',
                title: 'JOIN de tres tablas',
                description: 'Mostrá cada pedido con: nombre del cliente, nombre del producto y monto. Necesitás unir `pedidos`, `clientes` y `productos`.',
                level: 'Intermediate',
                schema: `Tabla: clientes
─────────────────────────────
  id      INT (PK)
  nombre  NVARCHAR(100)

Tabla: pedidos
─────────────────────────────
  id           INT (PK)
  cliente_id   INT (FK → clientes.id)
  producto_id  INT (FK → productos.id)
  monto        DECIMAL(10,2)
  fecha        DATE

Tabla: productos
─────────────────────────────
  id      INT (PK)
  nombre  NVARCHAR(100)
  precio  DECIMAL(10,2)`,
                initialCode: `SELECT c.nombre AS cliente, pr.nombre AS producto, p.monto
FROM pedidos p
    INNER JOIN clientes c  ON `,
                solution: `SELECT c.nombre AS cliente, pr.nombre AS producto, p.monto, p.fecha
FROM pedidos p
    INNER JOIN clientes c   ON p.cliente_id  = c.id
    INNER JOIN productos pr ON p.producto_id = pr.id
ORDER BY p.fecha DESC;`,
                hint: 'Encadenás los JOINs uno después del otro. Cada uno agrega una tabla nueva al resultado.',
            },
        ],
        test: {
            id: 'test-joins',
            title: 'Prueba Técnica: JOINs',
            description: 'Evaluá tu comprensión de los diferentes tipos de JOIN.',
            questions: [
                {
                    id: 'q1',
                    question: 'Tenés una tabla Clientes (100 filas) y Pedidos (50 filas). ¿Cuántas filas máximo puede devolver un CROSS JOIN?',
                    options: ['150', '50', '5000', '100'],
                    correctIndex: 2,
                    explanation: 'Un CROSS JOIN devuelve el producto cartesiano: 100 × 50 = 5000 filas. Cada fila de Clientes se combina con cada fila de Pedidos.',
                },
                {
                    id: 'q2',
                    question: '¿Cómo encontrás clientes que NO tienen ningún pedido usando LEFT JOIN?',
                    options: [
                        'WHERE pedidos.id IS NOT NULL',
                        'WHERE pedidos.id IS NULL',
                        'HAVING COUNT(pedidos.id) = 0',
                        'WHERE clientes.id NOT IN pedidos',
                    ],
                    correctIndex: 1,
                    explanation: 'Con LEFT JOIN, los clientes sin pedidos tendrán NULL en todas las columnas de la tabla Pedidos. Filtrando WHERE pedidos.id IS NULL obtenés exactamente esos clientes.',
                },
                {
                    id: 'q3',
                    question: '¿Cuál es la diferencia entre INNER JOIN y LEFT JOIN?',
                    options: [
                        'INNER JOIN es más rápido siempre',
                        'INNER JOIN devuelve solo coincidencias; LEFT JOIN devuelve todas las filas de la tabla izquierda aunque no haya coincidencia',
                        'LEFT JOIN devuelve solo coincidencias; INNER JOIN devuelve todas las filas',
                        'No hay diferencia en el resultado',
                    ],
                    correctIndex: 1,
                    explanation: 'INNER JOIN solo devuelve filas donde existe coincidencia en ambas tablas. LEFT JOIN devuelve todas las filas de la tabla izquierda, rellenando con NULL donde no hay coincidencia en la tabla derecha.',
                },
            ],
        },
    },

    // ─── MÓDULO 6: Subqueries y CTEs ─────────────────────────────────────────
    {
        id: 'module-subqueries-cte',
        title: 'Subqueries y CTEs',
        description: 'Escribí consultas anidadas y usá CTEs para lógica compleja, legible y reutilizable.',
        icon: '🧩',
        level: 'Intermediate',
        theory: [
            {
                title: 'Subconsultas (Subqueries)',
                content: `Una **subconsulta** es una consulta dentro de otra consulta. Puede aparecer en:

- **WHERE**: para filtrar basándose en resultados de otra consulta
- **FROM**: como tabla derivada (inline view)
- **SELECT**: como columna calculada (subconsulta escalar)
- **HAVING**: para filtrar grupos

**Tipos:**
- **Correlacionada**: referencia columnas de la consulta exterior (se ejecuta una vez por fila)
- **No correlacionada**: independiente de la consulta exterior (se ejecuta una sola vez)

**EXISTS vs IN**: EXISTS es más eficiente cuando la subconsulta devuelve muchas filas.`,
                codeExample: `-- Subconsulta en WHERE (no correlacionada)
SELECT nombre, salario
FROM empleados
WHERE salario > (SELECT AVG(salario) FROM empleados);

-- Subconsulta en FROM (tabla derivada)
SELECT depto, promedio
FROM (
    SELECT departamento AS depto, AVG(salario) AS promedio
    FROM empleados
    GROUP BY departamento
) AS resumen_depto
WHERE promedio > 60000;

-- Subconsulta correlacionada: empleados que ganan más que el promedio de su depto
SELECT e.nombre, e.salario, e.departamento
FROM empleados e
WHERE e.salario > (
    SELECT AVG(e2.salario)
    FROM empleados e2
    WHERE e2.departamento = e.departamento
);

-- EXISTS: clientes que tienen al menos un pedido
SELECT nombre FROM clientes c
WHERE EXISTS (
    SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id
);`,
            },
            {
                title: 'CTEs — Common Table Expressions',
                content: `Un **CTE** (WITH ... AS) es una tabla temporal con nombre que existe solo durante la consulta. Es más legible que las subconsultas anidadas y se puede referenciar múltiples veces.

**Ventajas sobre subconsultas:**
- Más legible y mantenible
- Se puede referenciar varias veces en la misma consulta
- Permite CTEs recursivos (para jerarquías)

**CTEs recursivos:** permiten recorrer estructuras jerárquicas como organigramas o categorías anidadas.`,
                codeExample: `-- CTE simple
WITH empleados_senior AS (
    SELECT id, nombre, salario, departamento
    FROM empleados
    WHERE salario > 80000
)
SELECT departamento, COUNT(*) AS cantidad, AVG(salario) AS promedio
FROM empleados_senior
GROUP BY departamento;

-- Múltiples CTEs encadenados
WITH
ventas_por_mes AS (
    SELECT YEAR(fecha) AS anio, MONTH(fecha) AS mes, SUM(monto) AS total
    FROM ventas
    GROUP BY YEAR(fecha), MONTH(fecha)
),
promedio_mensual AS (
    SELECT AVG(total) AS promedio FROM ventas_por_mes
)
SELECT v.anio, v.mes, v.total,
       p.promedio,
       v.total - p.promedio AS diferencia
FROM ventas_por_mes v
CROSS JOIN promedio_mensual p
ORDER BY v.anio, v.mes;

-- CTE Recursivo: jerarquía de empleados
WITH jerarquia AS (
    -- Caso base: el CEO (sin jefe)
    SELECT id, nombre, jefe_id, 0 AS nivel
    FROM empleados WHERE jefe_id IS NULL
    UNION ALL
    -- Caso recursivo
    SELECT e.id, e.nombre, e.jefe_id, j.nivel + 1
    FROM empleados e
    INNER JOIN jerarquia j ON e.jefe_id = j.id
)
SELECT nombre, nivel FROM jerarquia ORDER BY nivel, nombre;`,
            },
        ],
        exercises: [
            {
                id: 'ex-sub-1',
                title: 'Empleados sobre el promedio',
                description: 'Usá una subconsulta para encontrar todos los empleados cuyo salario es mayor al salario promedio de TODA la empresa. Mostrá nombre, departamento y salario.',
                level: 'Intermediate',
                schema: `Tabla: empleados
─────────────────────────────
  id           INT (PK)
  nombre       NVARCHAR(100)
  departamento NVARCHAR(50)
  salario      DECIMAL(10,2)`,
                initialCode: `SELECT nombre, departamento, salario
FROM empleados
WHERE salario > (`,
                solution: `SELECT nombre, departamento, salario
FROM empleados
WHERE salario > (SELECT AVG(salario) FROM empleados)
ORDER BY salario DESC;`,
                hint: 'La subconsulta (SELECT AVG(salario) FROM empleados) calcula el promedio global. Usala directamente en el WHERE.',
            },
            {
                id: 'ex-sub-2',
                title: 'CTE para análisis por departamento',
                description: 'Usá un CTE llamado `stats_depto` que calcule por departamento: total de empleados, salario promedio y salario máximo. Luego consultá ese CTE para mostrar solo los departamentos con más de 3 empleados, ordenados por promedio descendente.',
                level: 'Intermediate',
                schema: `Tabla: empleados
─────────────────────────────
  id           INT (PK)
  nombre       NVARCHAR(100)
  departamento NVARCHAR(50)
  salario      DECIMAL(10,2)`,
                initialCode: `WITH stats_depto AS (
    SELECT
        departamento,
        COUNT(*)       AS total,
        AVG(salario)   AS promedio,
        MAX(salario)   AS maximo
    FROM empleados
    GROUP BY departamento
)
SELECT `,
                solution: `WITH stats_depto AS (
    SELECT
        departamento,
        COUNT(*)       AS total,
        AVG(salario)   AS promedio,
        MAX(salario)   AS maximo
    FROM empleados
    GROUP BY departamento
)
SELECT departamento, total, promedio, maximo
FROM stats_depto
WHERE total > 3
ORDER BY promedio DESC;`,
                hint: 'Después de definir el CTE, escribí un SELECT normal usando stats_depto como si fuera una tabla.',
            },
        ],
        test: {
            id: 'test-subqueries',
            title: 'Prueba Técnica: Subqueries y CTEs',
            description: 'Evaluá tu comprensión de subconsultas y expresiones de tabla comunes.',
            questions: [
                {
                    id: 'q1',
                    question: '¿Cuándo conviene usar EXISTS en lugar de IN?',
                    options: [
                        'Siempre, son equivalentes',
                        'Cuando la subconsulta devuelve muchas filas, EXISTS es más eficiente porque para al encontrar la primera coincidencia',
                        'IN es siempre más eficiente',
                        'EXISTS solo funciona con subconsultas correlacionadas',
                    ],
                    correctIndex: 1,
                    explanation: 'EXISTS para en cuanto encuentra la primera coincidencia (short-circuit evaluation), lo que lo hace más eficiente cuando la subconsulta devuelve muchas filas. IN evalúa todos los valores.',
                },
                {
                    id: 'q2',
                    question: '¿Cuántas veces se ejecuta una subconsulta correlacionada?',
                    options: [
                        'Una sola vez',
                        'Una vez por cada fila de la consulta exterior',
                        'Dos veces',
                        'Depende del índice',
                    ],
                    correctIndex: 1,
                    explanation: 'Una subconsulta correlacionada referencia columnas de la consulta exterior, por lo que debe ejecutarse una vez por cada fila que procesa la consulta exterior.',
                },
                {
                    id: 'q3',
                    question: '¿Cuál es la ventaja principal de un CTE sobre una subconsulta en FROM?',
                    options: [
                        'Los CTEs son más rápidos siempre',
                        'Los CTEs son más legibles, se pueden referenciar múltiples veces y permiten recursividad',
                        'Las subconsultas en FROM no existen en SQL Server',
                        'Los CTEs usan menos memoria',
                    ],
                    correctIndex: 1,
                    explanation: 'Los CTEs mejoran la legibilidad al nombrar la lógica, pueden referenciarse varias veces en la misma consulta (evitando repetición) y permiten CTEs recursivos para jerarquías.',
                },
            ],
        },
    },
];
