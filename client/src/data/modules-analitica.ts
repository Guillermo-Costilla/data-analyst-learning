import type { Module } from '../types';

export const modulesAnalitica: Module[] = [
    // ─── MÓDULO 7: Funciones de Ventana ──────────────────────────────────────
    {
        id: 'module-window-functions',
        title: 'Funciones de Ventana (Window Functions)',
        description: 'Análisis avanzado con ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, totales acumulados y más.',
        icon: '🪟',
        level: 'Advanced',
        theory: [
            {
                title: '¿Qué son las Window Functions?',
                content: `Las **funciones de ventana** realizan cálculos sobre un conjunto de filas relacionadas con la fila actual, sin colapsar el resultado como lo haría GROUP BY.

La cláusula **OVER()** define la "ventana" (el conjunto de filas) sobre la que opera la función.

**Componentes de OVER():**
- **PARTITION BY**: divide las filas en grupos (como GROUP BY pero sin colapsar)
- **ORDER BY**: define el orden dentro de cada partición
- **ROWS/RANGE BETWEEN**: define el marco de filas (para funciones de agregación)

**Categorías:**
1. **Ranking**: ROW_NUMBER, RANK, DENSE_RANK, NTILE
2. **Offset**: LAG, LEAD, FIRST_VALUE, LAST_VALUE
3. **Agregación**: SUM, AVG, COUNT, MIN, MAX (con OVER)`,
                codeExample: `-- ROW_NUMBER: número único por fila
SELECT nombre, departamento, salario,
    ROW_NUMBER() OVER(ORDER BY salario DESC) AS ranking_global,
    ROW_NUMBER() OVER(PARTITION BY departamento ORDER BY salario DESC) AS ranking_depto
FROM empleados;

-- RANK vs DENSE_RANK (diferencia con empates)
SELECT nombre, salario,
    RANK()       OVER(ORDER BY salario DESC) AS rank,       -- 1,2,2,4
    DENSE_RANK() OVER(ORDER BY salario DESC) AS dense_rank  -- 1,2,2,3
FROM empleados;

-- NTILE: dividir en cuartiles
SELECT nombre, salario,
    NTILE(4) OVER(ORDER BY salario) AS cuartil
FROM empleados;`,
            },
            {
                title: 'LAG, LEAD y comparaciones temporales',
                content: `**LAG(columna, n)** accede al valor de n filas ANTES de la fila actual.
**LEAD(columna, n)** accede al valor de n filas DESPUÉS de la fila actual.

Son fundamentales para análisis de series temporales: comparar con el período anterior, calcular variaciones, detectar tendencias.

**FIRST_VALUE / LAST_VALUE**: acceden al primer o último valor de la ventana.`,
                codeExample: `-- LAG: comparar ventas con el mes anterior
SELECT
    anio, mes, total_ventas,
    LAG(total_ventas, 1, 0) OVER(ORDER BY anio, mes) AS ventas_mes_anterior,
    total_ventas - LAG(total_ventas, 1, 0) OVER(ORDER BY anio, mes) AS variacion,
    ROUND(
        100.0 * (total_ventas - LAG(total_ventas,1,0) OVER(ORDER BY anio, mes))
        / NULLIF(LAG(total_ventas,1,0) OVER(ORDER BY anio, mes), 0),
    2) AS variacion_pct
FROM ventas_mensuales
ORDER BY anio, mes;

-- Total acumulado (running total)
SELECT
    fecha, monto,
    SUM(monto) OVER(ORDER BY fecha
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS acumulado
FROM ventas;

-- Media móvil de 3 períodos
SELECT
    fecha, monto,
    AVG(monto) OVER(ORDER BY fecha
                    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS media_movil_3
FROM ventas;`,
            },
        ],
        exercises: [
            {
                id: 'ex-win-1',
                title: 'Ranking por departamento',
                description: 'Asigná un ranking de salario dentro de cada departamento usando DENSE_RANK (para que no haya saltos en caso de empate). Mostrá nombre, departamento, salario y el ranking. Ordená por departamento y ranking.',
                level: 'Advanced',
                schema: `Tabla: empleados
─────────────────────────────
  id           INT (PK)
  nombre       NVARCHAR(100)
  departamento NVARCHAR(50)
  salario      DECIMAL(10,2)`,
                initialCode: `SELECT
    nombre,
    departamento,
    salario,
    DENSE_RANK() OVER(`,
                solution: `SELECT
    nombre,
    departamento,
    salario,
    DENSE_RANK() OVER(PARTITION BY departamento ORDER BY salario DESC) AS ranking
FROM empleados
ORDER BY departamento, ranking;`,
                hint: 'Usá PARTITION BY departamento para que el ranking se reinicie en cada departamento, y ORDER BY salario DESC para que el mayor salario sea el #1.',
            },
            {
                id: 'ex-win-2',
                title: 'Total acumulado de ventas',
                description: 'Calculá el total acumulado de ventas ordenado por fecha. Para cada fila mostrá: fecha, monto de esa venta y el acumulado hasta esa fecha.',
                level: 'Advanced',
                schema: `Tabla: ventas
─────────────────────────────
  id         INT (PK)
  fecha      DATE
  monto      DECIMAL(10,2)
  region     NVARCHAR(50)`,
                initialCode: `SELECT
    fecha,
    monto,
    SUM(monto) OVER(`,
                solution: `SELECT
    fecha,
    monto,
    SUM(monto) OVER(ORDER BY fecha
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS acumulado
FROM ventas
ORDER BY fecha;`,
                hint: "Usá SUM(monto) OVER(ORDER BY fecha ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW). 'UNBOUNDED PRECEDING' significa desde el inicio.",
            },
            {
                id: 'ex-win-3',
                title: 'Comparación mes anterior con LAG',
                description: 'Para cada venta mensual, mostrá el monto del mes anterior (usando LAG) y la variación absoluta respecto al mes anterior. Si no hay mes anterior, mostrá 0.',
                level: 'Advanced',
                schema: `Tabla: ventas_mensuales
─────────────────────────────
  id     INT (PK)
  anio   INT
  mes    INT
  total  DECIMAL(10,2)`,
                initialCode: `SELECT
    anio, mes, total,
    LAG(total, 1, 0) OVER(`,
                solution: `SELECT
    anio,
    mes,
    total,
    LAG(total, 1, 0) OVER(ORDER BY anio, mes)                          AS mes_anterior,
    total - LAG(total, 1, 0) OVER(ORDER BY anio, mes)                  AS variacion
FROM ventas_mensuales
ORDER BY anio, mes;`,
                hint: 'LAG(total, 1, 0) toma el valor de 1 fila atrás; el tercer parámetro (0) es el valor por defecto cuando no hay fila anterior.',
            },
        ],
        test: {
            id: 'test-window',
            title: 'Prueba Técnica: Funciones de Ventana',
            description: 'Evaluá tu dominio de las window functions.',
            questions: [
                {
                    id: 'q1',
                    question: '¿Cuál es la diferencia entre RANK() y DENSE_RANK()?',
                    options: [
                        'No hay diferencia',
                        'RANK() deja huecos en la numeración cuando hay empates; DENSE_RANK() no deja huecos',
                        'DENSE_RANK() deja huecos; RANK() no',
                        'RANK() solo funciona con números',
                    ],
                    correctIndex: 1,
                    explanation: 'Si dos filas empatan en posición 2, RANK() asigna 2,2,4 (salta el 3). DENSE_RANK() asigna 2,2,3 (sin saltos). ROW_NUMBER() siempre asigna números únicos: 2,3,4.',
                },
                {
                    id: 'q2',
                    question: '¿Qué hace PARTITION BY dentro de OVER()?',
                    options: [
                        'Elimina duplicados',
                        'Divide las filas en grupos para que la función se calcule independientemente en cada grupo',
                        'Ordena las filas',
                        'Limita el número de filas',
                    ],
                    correctIndex: 1,
                    explanation: 'PARTITION BY divide el conjunto de filas en particiones. La función de ventana se calcula de forma independiente dentro de cada partición, similar a GROUP BY pero sin colapsar las filas.',
                },
                {
                    id: 'q3',
                    question: '¿Para qué sirve LAG() en análisis de datos?',
                    options: [
                        'Para ordenar filas',
                        'Para acceder al valor de una fila anterior, útil en comparaciones período-a-período',
                        'Para calcular promedios',
                        'Para eliminar duplicados',
                    ],
                    correctIndex: 1,
                    explanation: 'LAG() permite acceder al valor de n filas anteriores dentro de la ventana. Es fundamental para calcular variaciones respecto al período anterior (mes anterior, año anterior, etc.) sin necesidad de un self-join.',
                },
            ],
        },
    },

    // ─── MÓDULO 8: Normalización ──────────────────────────────────────────────
    {
        id: 'module-normalizacion',
        title: 'Normalización de Datos (1FN, 2FN, 3FN)',
        description: 'Diseñá bases de datos sin redundancia ni anomalías aplicando las formas normales.',
        icon: '📐',
        level: 'Intermediate',
        theory: [
            {
                title: '¿Por qué normalizar?',
                content: `La **normalización** es el proceso de organizar una base de datos para reducir la redundancia y mejorar la integridad de los datos.

**Problemas de una tabla no normalizada:**
- **Anomalía de inserción**: no podés agregar datos sin tener otros datos
- **Anomalía de actualización**: si un dato se repite, hay que actualizarlo en muchos lugares
- **Anomalía de eliminación**: al borrar una fila, perdés información relacionada
- **Redundancia**: el mismo dato guardado múltiples veces

Las **Formas Normales** son reglas progresivas. Cada forma normal incluye las anteriores.`,
                codeExample: `-- Tabla NO normalizada (muchos problemas)
-- pedidos_sin_normalizar:
-- id | cliente_nombre | cliente_email | producto1 | precio1 | producto2 | precio2
-- 1  | Ana García     | ana@mail.com  | Laptop    | 1500    | Mouse     | 25
-- 2  | Ana García     | ana@mail.com  | Teclado   | 80      | NULL      | NULL

-- Problemas:
-- 1. Si Ana cambia su email, hay que actualizar múltiples filas
-- 2. ¿Qué pasa si un pedido tiene 3 productos? ¿Agrego producto3?
-- 3. No podés buscar fácilmente todos los pedidos de un producto`,
            },
            {
                title: 'Primera Forma Normal (1FN)',
                content: `**1FN**: Cada celda debe contener un único valor atómico (indivisible). No puede haber grupos repetidos ni listas en una columna.

**Reglas:**
1. Cada columna tiene un único tipo de dato
2. Cada celda contiene un único valor (no listas)
3. Cada fila es única (hay una clave primaria)
4. No hay columnas repetidas (producto1, producto2, producto3...)`,
                codeExample: `-- VIOLA 1FN: múltiples valores en una celda
-- id | cliente | telefonos
-- 1  | Ana     | '11-1234, 11-5678'   ← MALO: lista en una celda
-- 2  | Carlos  | '11-9999'

-- VIOLA 1FN: columnas repetidas
-- id | cliente | tel1       | tel2       | tel3
-- 1  | Ana     | '11-1234'  | '11-5678'  | NULL

-- CUMPLE 1FN: una fila por teléfono
CREATE TABLE cliente_telefonos (
    cliente_id INT,
    telefono   NVARCHAR(20),
    tipo       NVARCHAR(10),  -- 'celular', 'fijo'
    PRIMARY KEY (cliente_id, telefono)
);
-- id | cliente_id | telefono    | tipo
-- 1  | 1          | '11-1234'   | 'celular'
-- 2  | 1          | '11-5678'   | 'fijo'
-- 3  | 2          | '11-9999'   | 'celular'`,
            },
            {
                title: 'Segunda Forma Normal (2FN)',
                content: `**2FN**: Cumple 1FN + cada columna no-clave depende de la clave primaria COMPLETA (no de una parte de ella).

Solo aplica cuando la clave primaria es compuesta (más de una columna).

**Problema**: dependencia parcial — una columna depende solo de PARTE de la clave primaria.`,
                codeExample: `-- VIOLA 2FN: clave primaria compuesta (pedido_id, producto_id)
-- pedido_id | producto_id | cantidad | precio_producto | nombre_producto
--     1     |     10      |    2     |     1500        |    'Laptop'
-- precio_producto y nombre_producto dependen SOLO de producto_id
-- no de la clave completa (pedido_id, producto_id) → DEPENDENCIA PARCIAL

-- SOLUCIÓN: separar en dos tablas
CREATE TABLE detalle_pedido (
    pedido_id   INT,
    producto_id INT,
    cantidad    INT,
    PRIMARY KEY (pedido_id, producto_id)
);

CREATE TABLE productos (
    id      INT PRIMARY KEY,
    nombre  NVARCHAR(100),
    precio  DECIMAL(10,2)
    -- precio y nombre dependen SOLO del id del producto ✓
);`,
            },
            {
                title: 'Tercera Forma Normal (3FN)',
                content: `**3FN**: Cumple 2FN + no hay dependencias transitivas. Cada columna no-clave depende DIRECTAMENTE de la clave primaria, no de otra columna no-clave.

**Dependencia transitiva**: A → B → C (C depende de B, que depende de A). C debería estar en otra tabla.`,
                codeExample: `-- VIOLA 3FN: dependencia transitiva
-- empleados:
-- id | nombre | depto_id | depto_nombre | depto_piso
--  1 | Ana    |    5     | 'Ventas'     |     3
-- depto_nombre y depto_piso dependen de depto_id, no del id del empleado
-- Dependencia transitiva: id → depto_id → depto_nombre

-- SOLUCIÓN: separar departamentos
CREATE TABLE departamentos (
    id     INT PRIMARY KEY,
    nombre NVARCHAR(50),
    piso   INT
);

CREATE TABLE empleados (
    id       INT PRIMARY KEY,
    nombre   NVARCHAR(100),
    depto_id INT FOREIGN KEY REFERENCES departamentos(id)
    -- Solo guardamos la FK, no los datos del departamento ✓
);

-- Ahora si cambia el nombre del departamento, solo se actualiza en UN lugar`,
            },
        ],
        exercises: [
            {
                id: 'ex-norm-1',
                title: 'Identificar violaciones de 1FN',
                description: 'Tenés una tabla `pedidos_raw` con columnas: id, cliente, productos (texto con lista separada por comas), total. Escribí el CREATE TABLE correcto que cumpla 1FN, separando los productos en su propia tabla.',
                level: 'Intermediate',
                schema: `Tabla actual (NO normalizada):
pedidos_raw
─────────────────────────────
  id        INT
  cliente   NVARCHAR(100)
  productos NVARCHAR(500)  ← "Laptop, Mouse, Teclado"
  total     DECIMAL(10,2)`,
                initialCode: `-- Tabla normalizada para pedidos
CREATE TABLE pedidos (
    id      INT PRIMARY KEY IDENTITY(1,1),
    cliente NVARCHAR(100) NOT NULL,
    total   DECIMAL(10,2)
);

-- Tabla para los productos de cada pedido (1FN)
CREATE TABLE `,
                solution: `CREATE TABLE pedidos (
    id      INT PRIMARY KEY IDENTITY(1,1),
    cliente NVARCHAR(100) NOT NULL,
    total   DECIMAL(10,2)
);

CREATE TABLE pedido_productos (
    id         INT PRIMARY KEY IDENTITY(1,1),
    pedido_id  INT NOT NULL FOREIGN KEY REFERENCES pedidos(id),
    producto   NVARCHAR(100) NOT NULL,
    cantidad   INT DEFAULT 1,
    precio     DECIMAL(10,2)
);`,
                hint: 'La solución es crear una tabla separada donde cada fila represente UN producto de UN pedido, con una FK al pedido.',
            },
            {
                id: 'ex-norm-2',
                title: 'Aplicar 3FN: eliminar dependencias transitivas',
                description: 'La tabla `empleados_raw` tiene: id, nombre, ciudad_id, ciudad_nombre, pais_nombre. Hay una dependencia transitiva: id → ciudad_id → ciudad_nombre → pais_nombre. Creá las tablas normalizadas que cumplan 3FN.',
                level: 'Intermediate',
                schema: `Tabla actual (viola 3FN):
empleados_raw
─────────────────────────────
  id           INT
  nombre       NVARCHAR(100)
  ciudad_id    INT
  ciudad_nombre NVARCHAR(50)   ← depende de ciudad_id
  pais_nombre  NVARCHAR(50)    ← depende de ciudad_id`,
                initialCode: `-- Tabla de países
CREATE TABLE paises (
    id     INT PRIMARY KEY,
    nombre NVARCHAR(50)
);

-- Tabla de ciudades
CREATE TABLE `,
                solution: `CREATE TABLE paises (
    id     INT PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL
);

CREATE TABLE ciudades (
    id       INT PRIMARY KEY,
    nombre   NVARCHAR(50) NOT NULL,
    pais_id  INT NOT NULL FOREIGN KEY REFERENCES paises(id)
);

CREATE TABLE empleados (
    id         INT PRIMARY KEY IDENTITY(1,1),
    nombre     NVARCHAR(100) NOT NULL,
    ciudad_id  INT NOT NULL FOREIGN KEY REFERENCES ciudades(id)
);`,
                hint: 'Necesitás 3 tablas: paises, ciudades (con FK a paises) y empleados (con FK a ciudades). Así cada dato está en un solo lugar.',
            },
        ],
        test: {
            id: 'test-normalizacion',
            title: 'Prueba Técnica: Normalización',
            description: 'Evaluá tu comprensión de las formas normales.',
            questions: [
                {
                    id: 'q1',
                    question: 'Una tabla tiene la columna "telefonos" con valores como "11-1234, 11-5678". ¿Qué forma normal viola?',
                    options: ['2FN', '3FN', '1FN', 'No viola ninguna'],
                    correctIndex: 2,
                    explanation: 'Viola la 1FN porque la columna contiene múltiples valores (lista) en una sola celda. La 1FN exige que cada celda tenga un único valor atómico.',
                },
                {
                    id: 'q2',
                    question: '¿Qué es una dependencia transitiva?',
                    options: [
                        'Cuando una columna depende de la clave primaria',
                        'Cuando una columna no-clave depende de otra columna no-clave (A→B→C)',
                        'Cuando hay dos claves primarias',
                        'Cuando una tabla tiene muchas columnas',
                    ],
                    correctIndex: 1,
                    explanation: 'Una dependencia transitiva ocurre cuando C depende de B, y B depende de A (la PK). Entonces C no depende directamente de A. Esto viola la 3FN y se soluciona moviendo B y C a una tabla separada.',
                },
                {
                    id: 'q3',
                    question: '¿La 2FN solo aplica cuando...?',
                    options: [
                        'La tabla tiene muchas columnas',
                        'La clave primaria es compuesta (más de una columna)',
                        'La tabla tiene datos numéricos',
                        'Siempre aplica igual que 1FN',
                    ],
                    correctIndex: 1,
                    explanation: 'La 2FN solo es relevante cuando la clave primaria está compuesta por más de una columna. Si la PK es simple (una sola columna), automáticamente se cumple la 2FN.',
                },
            ],
        },
    },

    // ─── MÓDULO 9: Modelo Estrella ────────────────────────────────────────────
    {
        id: 'module-modelo-estrella',
        title: 'Modelo Estrella y Data Warehouse',
        description: 'Diseñá esquemas estrella con tablas de hechos y dimensiones para análisis de datos eficiente.',
        icon: '⭐',
        level: 'Advanced',
        theory: [
            {
                title: '¿Qué es el Modelo Estrella?',
                content: `El **Modelo Estrella** (Star Schema) es un diseño de base de datos optimizado para análisis y reportes (OLAP), a diferencia del modelo normalizado que es para transacciones (OLTP).

**Componentes:**
- **Tabla de Hechos (Fact Table)**: contiene las métricas del negocio (ventas, cantidades, montos). Tiene claves foráneas a todas las dimensiones.
- **Tablas de Dimensiones (Dimension Tables)**: contienen los atributos descriptivos (quién, qué, cuándo, dónde). Son desnormalizadas intencionalmente para mejorar el rendimiento de consultas.

**Ventajas:**
- Consultas más simples y rápidas
- Fácil de entender para usuarios de negocio
- Optimizado para herramientas de BI (Power BI, Tableau)

**Diferencia con Copo de Nieve (Snowflake):** el copo de nieve normaliza las dimensiones, creando más tablas pero menos redundancia.`,
                codeExample: `-- TABLA DE HECHOS: ventas
CREATE TABLE fact_ventas (
    id              INT PRIMARY KEY IDENTITY(1,1),
    -- Claves foráneas a dimensiones
    fecha_id        INT NOT NULL FOREIGN KEY REFERENCES dim_fecha(id),
    producto_id     INT NOT NULL FOREIGN KEY REFERENCES dim_producto(id),
    cliente_id      INT NOT NULL FOREIGN KEY REFERENCES dim_cliente(id),
    vendedor_id     INT NOT NULL FOREIGN KEY REFERENCES dim_vendedor(id),
    -- Métricas (hechos)
    cantidad        INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento       DECIMAL(5,2) DEFAULT 0,
    monto_total     AS (cantidad * precio_unitario * (1 - descuento/100)) PERSISTED
);

-- DIMENSIÓN FECHA (muy importante en DW)
CREATE TABLE dim_fecha (
    id           INT PRIMARY KEY,
    fecha        DATE NOT NULL,
    anio         INT,
    trimestre    INT,
    mes          INT,
    nombre_mes   NVARCHAR(20),
    semana       INT,
    dia          INT,
    nombre_dia   NVARCHAR(20),
    es_feriado   BIT DEFAULT 0,
    es_fin_semana BIT
);

-- DIMENSIÓN PRODUCTO
CREATE TABLE dim_producto (
    id          INT PRIMARY KEY,
    codigo      NVARCHAR(20),
    nombre      NVARCHAR(100),
    categoria   NVARCHAR(50),
    subcategoria NVARCHAR(50),
    marca       NVARCHAR(50),
    precio_lista DECIMAL(10,2)
);

-- DIMENSIÓN CLIENTE
CREATE TABLE dim_cliente (
    id          INT PRIMARY KEY,
    codigo      NVARCHAR(20),
    nombre      NVARCHAR(100),
    segmento    NVARCHAR(50),  -- 'Retail', 'Mayorista', 'Corporativo'
    ciudad      NVARCHAR(50),
    provincia   NVARCHAR(50),
    pais        NVARCHAR(50)
);`,
            },
            {
                title: 'Validaciones para evitar duplicados en dimensiones (SCD)',
                content: `Un problema crítico en Data Warehouses es evitar insertar registros duplicados en las tablas de dimensiones.

**Técnicas:**

**1. MERGE (UPSERT):** inserta si no existe, actualiza si existe. Es la forma más robusta.

**2. IF NOT EXISTS:** verifica antes de insertar.

**3. SCD Tipo 1:** sobreescribe el registro existente (sin historial).
**SCD Tipo 2:** crea una nueva fila con fechas de vigencia (mantiene historial).

Para análisis de datos, el **MERGE** es la herramienta estándar para cargar dimensiones.`,
                codeExample: `-- MERGE para cargar dimensión cliente sin duplicados
MERGE dim_cliente AS destino
USING (
    SELECT codigo, nombre, segmento, ciudad, provincia, pais
    FROM staging_clientes
) AS origen
ON destino.codigo = origen.codigo
WHEN MATCHED AND (
    destino.nombre    <> origen.nombre OR
    destino.segmento  <> origen.segmento OR
    destino.ciudad    <> origen.ciudad
) THEN
    -- Actualizar si cambió algún dato
    UPDATE SET
        destino.nombre   = origen.nombre,
        destino.segmento = origen.segmento,
        destino.ciudad   = origen.ciudad
WHEN NOT MATCHED BY TARGET THEN
    -- Insertar si es nuevo
    INSERT (codigo, nombre, segmento, ciudad, provincia, pais)
    VALUES (origen.codigo, origen.nombre, origen.segmento,
            origen.ciudad, origen.provincia, origen.pais);

-- Verificar duplicados antes de insertar (alternativa simple)
INSERT INTO dim_producto (codigo, nombre, categoria)
SELECT s.codigo, s.nombre, s.categoria
FROM staging_productos s
WHERE NOT EXISTS (
    SELECT 1 FROM dim_producto d WHERE d.codigo = s.codigo
);`,
            },
            {
                title: 'Consultas analíticas sobre el Modelo Estrella',
                content: `Las consultas sobre un modelo estrella son muy expresivas. Siempre parten de la tabla de hechos y hacen JOIN con las dimensiones necesarias.

**Patrón típico:**
1. FROM fact_tabla
2. JOIN dim_* para cada dimensión que necesitás filtrar o mostrar
3. WHERE para filtrar por atributos de dimensiones
4. GROUP BY por atributos de dimensiones
5. Métricas calculadas en el SELECT`,
                codeExample: `-- Ventas por categoría y trimestre
SELECT
    f.anio,
    f.trimestre,
    p.categoria,
    SUM(v.monto_total)   AS total_ventas,
    COUNT(v.id)          AS cantidad_transacciones,
    AVG(v.monto_total)   AS ticket_promedio,
    SUM(v.cantidad)      AS unidades_vendidas
FROM fact_ventas v
    INNER JOIN dim_fecha    f ON v.fecha_id    = f.id
    INNER JOIN dim_producto p ON v.producto_id = p.id
    INNER JOIN dim_cliente  c ON v.cliente_id  = c.id
WHERE f.anio = 2024
  AND c.segmento = 'Retail'
GROUP BY f.anio, f.trimestre, p.categoria
ORDER BY f.trimestre, total_ventas DESC;

-- Top 10 productos más vendidos
SELECT TOP 10
    p.nombre,
    p.categoria,
    SUM(v.monto_total) AS total_ventas
FROM fact_ventas v
    INNER JOIN dim_producto p ON v.producto_id = p.id
GROUP BY p.nombre, p.categoria
ORDER BY total_ventas DESC;`,
            },
        ],
        exercises: [
            {
                id: 'ex-star-1',
                title: 'Consulta sobre modelo estrella',
                description: 'Usando el modelo estrella de ventas, escribí una consulta que muestre las ventas totales por mes y categoría de producto para el año 2024. Mostrá: nombre del mes, categoría, total de ventas y cantidad de transacciones. Ordená por mes y total descendente.',
                level: 'Advanced',
                schema: `fact_ventas: id, fecha_id, producto_id, cliente_id, cantidad, monto_total
dim_fecha: id, anio, mes, nombre_mes, trimestre
dim_producto: id, nombre, categoria, subcategoria
dim_cliente: id, nombre, segmento, ciudad`,
                initialCode: `SELECT
    f.nombre_mes,
    p.categoria,
    SUM(v.monto_total)  AS total_ventas,
    COUNT(v.id)         AS transacciones
FROM fact_ventas v
    INNER JOIN dim_fecha f    ON `,
                solution: `SELECT
    f.nombre_mes,
    p.categoria,
    SUM(v.monto_total)  AS total_ventas,
    COUNT(v.id)         AS transacciones
FROM fact_ventas v
    INNER JOIN dim_fecha    f ON v.fecha_id    = f.id
    INNER JOIN dim_producto p ON v.producto_id = p.id
WHERE f.anio = 2024
GROUP BY f.mes, f.nombre_mes, p.categoria
ORDER BY f.mes, total_ventas DESC;`,
                hint: 'Uní fact_ventas con dim_fecha y dim_producto. Filtrá por f.anio = 2024 en el WHERE. Agrupá por mes y categoría.',
            },
            {
                id: 'ex-star-2',
                title: 'MERGE para cargar dimensión sin duplicados',
                description: 'Escribí un MERGE que cargue la tabla `dim_cliente` desde `staging_clientes`. Si el cliente ya existe (mismo codigo), actualizá nombre y segmento. Si no existe, insertalo.',
                level: 'Advanced',
                schema: `dim_cliente: id (PK, IDENTITY), codigo (UNIQUE), nombre, segmento, ciudad
staging_clientes: codigo, nombre, segmento, ciudad`,
                initialCode: `MERGE dim_cliente AS destino
USING staging_clientes AS origen
ON destino.codigo = origen.codigo
WHEN MATCHED THEN
    UPDATE SET `,
                solution: `MERGE dim_cliente AS destino
USING staging_clientes AS origen
ON destino.codigo = origen.codigo
WHEN MATCHED THEN
    UPDATE SET
        destino.nombre   = origen.nombre,
        destino.segmento = origen.segmento,
        destino.ciudad   = origen.ciudad
WHEN NOT MATCHED BY TARGET THEN
    INSERT (codigo, nombre, segmento, ciudad)
    VALUES (origen.codigo, origen.nombre, origen.segmento, origen.ciudad);`,
                hint: 'WHEN MATCHED actualiza los datos existentes. WHEN NOT MATCHED BY TARGET inserta los registros nuevos.',
            },
        ],
        test: {
            id: 'test-estrella',
            title: 'Prueba Técnica: Modelo Estrella',
            description: 'Evaluá tu comprensión del diseño dimensional para Data Warehouses.',
            questions: [
                {
                    id: 'q1',
                    question: '¿Cuál es la diferencia principal entre OLTP y OLAP?',
                    options: [
                        'OLTP es para análisis, OLAP para transacciones',
                        'OLTP es para transacciones diarias (normalizado); OLAP es para análisis y reportes (desnormalizado)',
                        'Son lo mismo',
                        'OLAP es más antiguo que OLTP',
                    ],
                    correctIndex: 1,
                    explanation: 'OLTP (Online Transaction Processing) está optimizado para operaciones de inserción/actualización frecuentes, usa esquemas normalizados. OLAP (Online Analytical Processing) está optimizado para consultas analíticas complejas, usa esquemas desnormalizados como el modelo estrella.',
                },
                {
                    id: 'q2',
                    question: '¿Qué contiene una tabla de hechos (Fact Table)?',
                    options: [
                        'Atributos descriptivos como nombre, ciudad, categoría',
                        'Las métricas del negocio (montos, cantidades) y claves foráneas a las dimensiones',
                        'Solo las claves primarias',
                        'Los datos de los clientes',
                    ],
                    correctIndex: 1,
                    explanation: 'La tabla de hechos contiene las métricas cuantitativas del negocio (ventas, cantidades, costos) y las claves foráneas que la conectan con todas las tablas de dimensiones.',
                },
                {
                    id: 'q3',
                    question: '¿Qué hace el comando MERGE en SQL Server?',
                    options: [
                        'Une dos tablas como un JOIN',
                        'Realiza INSERT si no existe el registro, UPDATE si ya existe (UPSERT)',
                        'Combina dos bases de datos',
                        'Elimina duplicados',
                    ],
                    correctIndex: 1,
                    explanation: 'MERGE (también llamado UPSERT) permite en una sola operación: actualizar registros que ya existen y insertar los que no existen, basándose en una condición de coincidencia.',
                },
            ],
        },
    },
];
