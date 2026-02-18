import type { Module } from '../types';

export const modulesBasicos: Module[] = [
    // ─── MÓDULO 1: DDL, DML, DCL, DQL, TCL ───────────────────────────────────
    {
        id: 'module-ddl-dml',
        title: 'DDL, DML, DCL, DQL y TCL',
        description: 'Conocé los 5 sublenguajes de SQL: estructura, datos, permisos, consultas y transacciones.',
        icon: '📋',
        level: 'Beginner',
        theory: [
            {
                title: '¿Qué es SQL y sus sublenguajes?',
                content: `SQL (Structured Query Language) no es un único lenguaje, sino que se divide en 5 sublenguajes según su propósito:

**DDL – Data Definition Language** (Lenguaje de Definición de Datos)
Define la estructura de la base de datos: crea, modifica y elimina tablas, índices y esquemas.
Comandos: CREATE, ALTER, DROP, TRUNCATE

**DML – Data Manipulation Language** (Lenguaje de Manipulación de Datos)
Trabaja con los datos dentro de las tablas: insertar, actualizar, eliminar.
Comandos: INSERT, UPDATE, DELETE

**DQL – Data Query Language** (Lenguaje de Consulta de Datos)
Consulta y recupera datos. Algunos lo consideran parte de DML.
Comandos: SELECT

**DCL – Data Control Language** (Lenguaje de Control de Datos)
Gestiona permisos y accesos a la base de datos.
Comandos: GRANT, REVOKE

**TCL – Transaction Control Language** (Lenguaje de Control de Transacciones)
Controla las transacciones para garantizar integridad de datos.
Comandos: BEGIN TRANSACTION, COMMIT, ROLLBACK, SAVEPOINT`,
                codeExample: `-- DDL: Crear tabla
CREATE TABLE productos (
    id       INT PRIMARY KEY IDENTITY(1,1),
    nombre   NVARCHAR(100) NOT NULL,
    precio   DECIMAL(10,2),
    stock    INT DEFAULT 0
);

-- DML: Insertar datos
INSERT INTO productos (nombre, precio, stock)
VALUES ('Laptop', 1500.00, 10);

-- DQL: Consultar datos
SELECT nombre, precio FROM productos WHERE stock > 0;

-- DML: Actualizar
UPDATE productos SET precio = 1400.00 WHERE nombre = 'Laptop';

-- DML: Eliminar
DELETE FROM productos WHERE stock = 0;

-- TCL: Transacción
BEGIN TRANSACTION;
    UPDATE productos SET stock = stock - 1 WHERE id = 1;
    INSERT INTO ventas (producto_id, fecha) VALUES (1, GETDATE());
COMMIT;

-- DCL: Permisos
GRANT SELECT ON productos TO usuario_ventas;
REVOKE DELETE ON productos FROM usuario_ventas;`,
            },
            {
                title: 'DDL en detalle: CREATE, ALTER, DROP',
                content: `**CREATE TABLE** define la estructura de una nueva tabla con sus columnas, tipos de datos y restricciones.

**ALTER TABLE** modifica una tabla existente: agregar/eliminar columnas, cambiar tipos, agregar constraints.

**DROP TABLE** elimina la tabla y todos sus datos permanentemente.

**TRUNCATE TABLE** elimina todos los datos pero mantiene la estructura (más rápido que DELETE sin WHERE).

Tipos de datos más usados en SQL Server:
- INT, BIGINT → números enteros
- DECIMAL(p,s), FLOAT → números decimales
- NVARCHAR(n), VARCHAR(n) → texto
- DATE, DATETIME, DATETIME2 → fechas
- BIT → booleano (0/1)`,
                codeExample: `-- Crear tabla con constraints
CREATE TABLE empleados (
    id          INT PRIMARY KEY IDENTITY(1,1),
    nombre      NVARCHAR(100) NOT NULL,
    email       NVARCHAR(200) UNIQUE,
    salario     DECIMAL(10,2) CHECK (salario > 0),
    depto_id    INT FOREIGN KEY REFERENCES departamentos(id),
    activo      BIT DEFAULT 1,
    fecha_alta  DATE DEFAULT GETDATE()
);

-- Agregar columna
ALTER TABLE empleados ADD telefono NVARCHAR(20);

-- Modificar tipo de columna
ALTER TABLE empleados ALTER COLUMN telefono NVARCHAR(30);

-- Eliminar columna
ALTER TABLE empleados DROP COLUMN telefono;

-- Eliminar tabla
DROP TABLE IF EXISTS empleados;`,
            },
        ],
        exercises: [
            {
                id: 'ex-ddl-1',
                title: 'Crear tu primera tabla',
                description: 'Creá una tabla llamada `clientes` con las columnas: id (INT, PK, autoincremental), nombre (NVARCHAR 100, NOT NULL), email (NVARCHAR 200, UNIQUE) y fecha_registro (DATE, valor por defecto la fecha actual).',
                level: 'Beginner',
                schema: `-- No hay tablas previas. Debés crearla desde cero.`,
                initialCode: `CREATE TABLE clientes (
    id `,
                solution: `CREATE TABLE clientes (
    id             INT PRIMARY KEY IDENTITY(1,1),
    nombre         NVARCHAR(100) NOT NULL,
    email          NVARCHAR(200) UNIQUE,
    fecha_registro DATE DEFAULT GETDATE()
);`,
                hint: 'Usá IDENTITY(1,1) para el autoincremental, NOT NULL para nombre, UNIQUE para email y DEFAULT GETDATE() para la fecha.',
            },
            {
                id: 'ex-ddl-2',
                title: 'Insertar y consultar datos',
                description: 'Insertá 2 empleados en la tabla `empleados` (nombre, departamento, salario) y luego consultá todos los empleados del departamento "Ventas".',
                level: 'Beginner',
                schema: `Tabla: empleados
─────────────────────────────
  id           INT (PK, IDENTITY)
  nombre       NVARCHAR(100)
  departamento NVARCHAR(50)
  salario      DECIMAL(10,2)`,
                initialCode: `-- Primero insertá los datos
INSERT INTO empleados (nombre, departamento, salario)
VALUES `,
                solution: `INSERT INTO empleados (nombre, departamento, salario)
VALUES ('Ana García', 'Ventas', 55000),
       ('Carlos López', 'Ventas', 60000);

SELECT * FROM empleados WHERE departamento = 'Ventas';`,
                hint: 'Podés insertar múltiples filas en un solo INSERT separando los VALUES con comas.',
            },
            {
                id: 'ex-ddl-3',
                title: 'Transacción con ROLLBACK',
                description: 'Escribí una transacción que intente actualizar el salario de un empleado. Si el nuevo salario es menor a 30000, hacé ROLLBACK; si no, COMMIT.',
                level: 'Intermediate',
                schema: `Tabla: empleados
─────────────────────────────
  id      INT (PK)
  nombre  NVARCHAR(100)
  salario DECIMAL(10,2)`,
                initialCode: `BEGIN TRANSACTION;
    UPDATE empleados SET salario = 25000 WHERE id = 1;
    
    IF `,
                solution: `BEGIN TRANSACTION;
    UPDATE empleados SET salario = 25000 WHERE id = 1;
    
    IF (SELECT salario FROM empleados WHERE id = 1) < 30000
        ROLLBACK;
    ELSE
        COMMIT;`,
                hint: 'Usá IF con una subconsulta para verificar el valor después del UPDATE, antes de decidir COMMIT o ROLLBACK.',
            },
        ],
        test: {
            id: 'test-ddl-dml',
            title: 'Prueba Técnica: DDL, DML, DCL, DQL y TCL',
            description: 'Evaluá tus conocimientos sobre los sublenguajes de SQL.',
            questions: [
                {
                    id: 'q1',
                    question: '¿Qué comando se usa para eliminar todos los datos de una tabla sin eliminar su estructura, de forma más eficiente que DELETE?',
                    options: ['DROP TABLE', 'DELETE FROM tabla', 'TRUNCATE TABLE', 'REMOVE TABLE'],
                    correctIndex: 2,
                    explanation: 'TRUNCATE TABLE elimina todos los registros sin registrar cada eliminación individualmente, lo que lo hace más rápido que DELETE. No elimina la estructura de la tabla.',
                },
                {
                    id: 'q2',
                    question: '¿A qué sublenguaje pertenece el comando GRANT?',
                    options: ['DDL', 'DML', 'DCL', 'TCL'],
                    correctIndex: 2,
                    explanation: 'GRANT pertenece al DCL (Data Control Language). Se usa para otorgar permisos a usuarios sobre objetos de la base de datos.',
                },
                {
                    id: 'q3',
                    question: '¿Qué hace ROLLBACK en una transacción?',
                    options: [
                        'Guarda los cambios permanentemente',
                        'Deshace todos los cambios desde el BEGIN TRANSACTION',
                        'Crea un punto de guardado',
                        'Elimina la transacción del log',
                    ],
                    correctIndex: 1,
                    explanation: 'ROLLBACK deshace todos los cambios realizados desde el inicio de la transacción (BEGIN TRANSACTION), dejando la base de datos en su estado anterior.',
                },
                {
                    id: 'q4',
                    question: '¿Cuál es la diferencia entre DELETE y TRUNCATE?',
                    options: [
                        'No hay diferencia',
                        'DELETE puede tener WHERE, TRUNCATE no; DELETE es más lento y se puede hacer ROLLBACK',
                        'TRUNCATE puede tener WHERE, DELETE no',
                        'DELETE elimina la tabla, TRUNCATE solo los datos',
                    ],
                    correctIndex: 1,
                    explanation: 'DELETE permite filtrar con WHERE y registra cada eliminación en el log (se puede hacer ROLLBACK). TRUNCATE elimina todo sin WHERE, es más rápido y en SQL Server también se puede hacer ROLLBACK si está dentro de una transacción.',
                },
            ],
        },
    },

    // ─── MÓDULO 2: Variables y Funciones ─────────────────────────────────────
    {
        id: 'module-variables',
        title: 'Variables y Funciones',
        description: 'Aprendé a declarar variables, usar funciones de sistema y crear tus propias funciones en SQL Server.',
        icon: '🔧',
        level: 'Beginner',
        theory: [
            {
                title: 'Variables en SQL Server',
                content: `En SQL Server, las variables se declaran con **DECLARE** y se les asigna valor con **SET** o **SELECT**.

Las variables locales siempre empiezan con **@**.

**Tipos de variables:**
- Variables escalares: almacenan un único valor
- Variables de tabla: almacenan un conjunto de filas (como una tabla temporal)

**Ámbito:** Las variables solo existen dentro del batch o procedimiento donde se declaran.`,
                codeExample: `-- Declarar y asignar variables
DECLARE @nombre    NVARCHAR(100);
DECLARE @salario   DECIMAL(10,2);
DECLARE @fecha     DATE;

SET @nombre  = 'María González';
SET @salario = 75000.00;
SET @fecha   = GETDATE();

-- También se puede asignar con SELECT
SELECT @salario = AVG(salario) FROM empleados;

PRINT 'Salario promedio: ' + CAST(@salario AS NVARCHAR);

-- Variable de tabla
DECLARE @resultados TABLE (
    nombre  NVARCHAR(100),
    salario DECIMAL(10,2)
);

INSERT INTO @resultados
SELECT nombre, salario FROM empleados WHERE salario > 50000;

SELECT * FROM @resultados;`,
            },
            {
                title: 'Funciones de Sistema más usadas',
                content: `SQL Server tiene cientos de funciones integradas. Las más importantes para análisis de datos:

**Funciones de fecha:**
- GETDATE() → fecha y hora actual
- YEAR(), MONTH(), DAY() → extraer partes de una fecha
- DATEDIFF(parte, inicio, fin) → diferencia entre fechas
- DATEADD(parte, cantidad, fecha) → sumar/restar tiempo
- FORMAT(fecha, 'formato') → formatear fecha como texto

**Funciones de texto:**
- LEN(texto) → longitud
- UPPER(), LOWER() → mayúsculas/minúsculas
- TRIM(), LTRIM(), RTRIM() → quitar espacios
- SUBSTRING(texto, inicio, largo) → extraer parte
- REPLACE(texto, buscar, reemplazar)
- CONCAT(a, b, ...) → concatenar
- STRING_SPLIT(texto, separador) → dividir texto

**Funciones numéricas:**
- ROUND(n, decimales), CEILING(), FLOOR()
- ABS() → valor absoluto
- ISNULL(valor, reemplazo) → reemplazar NULL
- COALESCE(v1, v2, ...) → primer valor no NULL
- CAST(valor AS tipo), CONVERT(tipo, valor)`,
                codeExample: `-- Funciones de fecha
SELECT
    GETDATE()                              AS ahora,
    YEAR(GETDATE())                        AS anio,
    MONTH(GETDATE())                       AS mes,
    DATEDIFF(YEAR, '1990-05-15', GETDATE()) AS edad,
    DATEADD(MONTH, 3, GETDATE())           AS en_3_meses,
    FORMAT(GETDATE(), 'dd/MM/yyyy')        AS fecha_formato;

-- Funciones de texto
SELECT
    UPPER('hola mundo')              AS mayusculas,
    LEN('SQL Server')                AS longitud,
    SUBSTRING('Análisis', 1, 6)      AS parte,
    REPLACE('Juan-García', '-', ' ') AS sin_guion,
    ISNULL(NULL, 'Sin datos')        AS con_default;

-- Funciones numéricas
SELECT
    ROUND(3.14159, 2)   AS redondeado,
    CEILING(4.1)        AS techo,
    FLOOR(4.9)          AS piso,
    ABS(-150)           AS absoluto;`,
            },
            {
                title: 'Crear Funciones Propias (UDF)',
                content: `Podés crear tus propias funciones con **CREATE FUNCTION**. Hay dos tipos principales:

**Funciones escalares:** devuelven un único valor.
**Funciones de tabla (TVF):** devuelven una tabla de resultados.

Las funciones se invocan igual que las funciones de sistema.`,
                codeExample: `-- Función escalar: calcular edad
CREATE FUNCTION dbo.fn_CalcularEdad(@fechaNacimiento DATE)
RETURNS INT
AS
BEGIN
    RETURN DATEDIFF(YEAR, @fechaNacimiento, GETDATE())
           - CASE WHEN FORMAT(GETDATE(),'MMdd') < FORMAT(@fechaNacimiento,'MMdd')
                  THEN 1 ELSE 0 END;
END;
GO

-- Usar la función
SELECT nombre, dbo.fn_CalcularEdad(fecha_nacimiento) AS edad
FROM empleados;

-- Función de tabla: empleados por departamento
CREATE FUNCTION dbo.fn_EmpleadosPorDepto(@depto NVARCHAR(50))
RETURNS TABLE
AS
RETURN (
    SELECT id, nombre, salario
    FROM empleados
    WHERE departamento = @depto
);
GO

-- Usar la función de tabla
SELECT * FROM dbo.fn_EmpleadosPorDepto('Ventas');`,
            },
        ],
        exercises: [
            {
                id: 'ex-var-1',
                title: 'Declarar y usar variables',
                description: 'Declará una variable @salario_minimo de tipo DECIMAL(10,2) con valor 45000. Luego usala para consultar todos los empleados cuyo salario sea mayor a esa variable.',
                level: 'Beginner',
                schema: `Tabla: empleados
─────────────────────────────
  id           INT (PK)
  nombre       NVARCHAR(100)
  departamento NVARCHAR(50)
  salario      DECIMAL(10,2)`,
                initialCode: `DECLARE @salario_minimo DECIMAL(10,2);
SET @salario_minimo = `,
                solution: `DECLARE @salario_minimo DECIMAL(10,2);
SET @salario_minimo = 45000;

SELECT nombre, departamento, salario
FROM empleados
WHERE salario > @salario_minimo
ORDER BY salario DESC;`,
                hint: 'Después de declarar y asignar la variable, usala en el WHERE igual que usarías un número literal.',
            },
            {
                id: 'ex-var-2',
                title: 'Funciones de fecha',
                description: 'Escribí una consulta que muestre el nombre de cada empleado, su fecha de contratación, cuántos años lleva en la empresa (usando DATEDIFF) y la fecha de su próxima revisión salarial (exactamente 1 año después de su contratación, usando DATEADD).',
                level: 'Beginner',
                schema: `Tabla: empleados
─────────────────────────────
  id               INT (PK)
  nombre           NVARCHAR(100)
  fecha_contrato   DATE
  salario          DECIMAL(10,2)`,
                initialCode: `SELECT
    nombre,
    fecha_contrato,
    DATEDIFF(`,
                solution: `SELECT
    nombre,
    fecha_contrato,
    DATEDIFF(YEAR, fecha_contrato, GETDATE())      AS anios_empresa,
    DATEADD(YEAR, 1, fecha_contrato)               AS proxima_revision
FROM empleados
ORDER BY fecha_contrato;`,
                hint: 'DATEDIFF(YEAR, fecha_inicio, fecha_fin) calcula la diferencia en años. DATEADD(YEAR, 1, fecha) suma 1 año.',
            },
        ],
        test: {
            id: 'test-variables',
            title: 'Prueba Técnica: Variables y Funciones',
            description: 'Evaluá tu comprensión de variables y funciones en SQL Server.',
            questions: [
                {
                    id: 'q1',
                    question: '¿Cómo se declara correctamente una variable en SQL Server?',
                    options: ['VAR @nombre VARCHAR(50)', 'DECLARE @nombre VARCHAR(50)', 'DIM @nombre AS VARCHAR(50)', 'SET @nombre VARCHAR(50)'],
                    correctIndex: 1,
                    explanation: 'En SQL Server las variables se declaran con DECLARE y siempre empiezan con @.',
                },
                {
                    id: 'q2',
                    question: '¿Qué función devuelve el primer valor no NULL de una lista?',
                    options: ['ISNULL()', 'NULLIF()', 'COALESCE()', 'NVL()'],
                    correctIndex: 2,
                    explanation: 'COALESCE(v1, v2, v3...) devuelve el primer valor no NULL de la lista. ISNULL solo acepta 2 parámetros.',
                },
                {
                    id: 'q3',
                    question: '¿Cuál es la diferencia entre una función escalar y una función de tabla (TVF)?',
                    options: [
                        'No hay diferencia',
                        'La escalar devuelve un único valor; la TVF devuelve un conjunto de filas',
                        'La TVF devuelve un único valor; la escalar devuelve filas',
                        'Las TVF no existen en SQL Server',
                    ],
                    correctIndex: 1,
                    explanation: 'Las funciones escalares retornan un único valor (INT, VARCHAR, etc.). Las Table-Valued Functions (TVF) retornan una tabla que puede usarse en FROM.',
                },
            ],
        },
    },

    // ─── MÓDULO 3: Procedimientos Almacenados ────────────────────────────────
    {
        id: 'module-stored-procs',
        title: 'Procedimientos Almacenados',
        description: 'Creá lógica reutilizable en el servidor con parámetros de entrada, salida y manejo de errores.',
        icon: '⚙️',
        level: 'Intermediate',
        theory: [
            {
                title: '¿Qué es un Procedimiento Almacenado?',
                content: `Un **Stored Procedure** (SP) es un bloque de código SQL guardado en el servidor con un nombre, que puede ejecutarse cuando se necesite.

**Ventajas:**
- Reutilización: se escribe una vez, se usa muchas veces
- Rendimiento: el plan de ejecución se cachea
- Seguridad: los usuarios ejecutan el SP sin ver el código subyacente
- Mantenimiento: cambios centralizados

**Parámetros:**
- **INPUT** (por defecto): el llamador pasa un valor al SP
- **OUTPUT**: el SP devuelve un valor al llamador
- Con valores por defecto: el parámetro es opcional`,
                codeExample: `-- SP básico sin parámetros
CREATE PROCEDURE dbo.sp_ListarEmpleados
AS
BEGIN
    SELECT id, nombre, departamento, salario
    FROM empleados
    ORDER BY nombre;
END;
GO

-- Ejecutar
EXEC dbo.sp_ListarEmpleados;

-- SP con parámetro de entrada
CREATE PROCEDURE dbo.sp_EmpleadosPorDepto
    @departamento NVARCHAR(50)
AS
BEGIN
    SELECT nombre, salario
    FROM empleados
    WHERE departamento = @departamento
    ORDER BY salario DESC;
END;
GO

EXEC dbo.sp_EmpleadosPorDepto @departamento = 'Ventas';

-- SP con parámetro OUTPUT
CREATE PROCEDURE dbo.sp_ContarEmpleados
    @departamento NVARCHAR(50),
    @total        INT OUTPUT
AS
BEGIN
    SELECT @total = COUNT(*)
    FROM empleados
    WHERE departamento = @departamento;
END;
GO

-- Usar el OUTPUT
DECLARE @cantidad INT;
EXEC dbo.sp_ContarEmpleados 'Ventas', @cantidad OUTPUT;
PRINT 'Total: ' + CAST(@cantidad AS NVARCHAR);`,
            },
            {
                title: 'Manejo de Errores con TRY/CATCH',
                content: `SQL Server usa **TRY/CATCH** para capturar errores en tiempo de ejecución, similar a otros lenguajes de programación.

Dentro del bloque CATCH podés usar:
- ERROR_MESSAGE() → texto del error
- ERROR_NUMBER() → número del error
- ERROR_SEVERITY() → gravedad
- ERROR_LINE() → línea donde ocurrió

Es buena práctica combinar TRY/CATCH con transacciones para garantizar integridad.`,
                codeExample: `CREATE PROCEDURE dbo.sp_TransferirSaldo
    @cuenta_origen  INT,
    @cuenta_destino INT,
    @monto          DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Descontar del origen
        UPDATE cuentas
        SET saldo = saldo - @monto
        WHERE id = @cuenta_origen;
        
        -- Verificar saldo suficiente
        IF (SELECT saldo FROM cuentas WHERE id = @cuenta_origen) < 0
            THROW 50001, 'Saldo insuficiente', 1;
        
        -- Acreditar al destino
        UPDATE cuentas
        SET saldo = saldo + @monto
        WHERE id = @cuenta_destino;
        
        COMMIT;
        PRINT 'Transferencia exitosa';
        
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT 'Error: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO`,
            },
        ],
        exercises: [
            {
                id: 'ex-sp-1',
                title: 'Crear un SP con parámetro',
                description: 'Creá un procedimiento almacenado llamado `sp_BuscarEmpleado` que reciba un parámetro @nombre_parcial (NVARCHAR 50) y devuelva todos los empleados cuyo nombre contenga ese texto (usando LIKE).',
                level: 'Intermediate',
                schema: `Tabla: empleados
─────────────────────────────
  id           INT (PK)
  nombre       NVARCHAR(100)
  departamento NVARCHAR(50)
  salario      DECIMAL(10,2)`,
                initialCode: `CREATE PROCEDURE dbo.sp_BuscarEmpleado
    @nombre_parcial NVARCHAR(50)
AS
BEGIN
    `,
                solution: `CREATE PROCEDURE dbo.sp_BuscarEmpleado
    @nombre_parcial NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, departamento, salario
    FROM empleados
    WHERE nombre LIKE '%' + @nombre_parcial + '%'
    ORDER BY nombre;
END;
GO

-- Probar el SP
EXEC dbo.sp_BuscarEmpleado @nombre_parcial = 'García';`,
                hint: "Usá LIKE '%' + @nombre_parcial + '%' para buscar el texto en cualquier posición del nombre.",
            },
            {
                id: 'ex-sp-2',
                title: 'SP con TRY/CATCH y transacción',
                description: 'Creá un SP llamado `sp_AumentarSalario` que reciba @empleado_id y @porcentaje. Dentro de una transacción con TRY/CATCH, actualizá el salario. Si el nuevo salario supera 200000, lanzá un error con THROW y hacé ROLLBACK.',
                level: 'Intermediate',
                schema: `Tabla: empleados
─────────────────────────────
  id      INT (PK)
  nombre  NVARCHAR(100)
  salario DECIMAL(10,2)`,
                initialCode: `CREATE PROCEDURE dbo.sp_AumentarSalario
    @empleado_id INT,
    @porcentaje  DECIMAL(5,2)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        UPDATE empleados
        SET salario = salario * (1 + @porcentaje / 100)
        WHERE id = @empleado_id;
        `,
                solution: `CREATE PROCEDURE dbo.sp_AumentarSalario
    @empleado_id INT,
    @porcentaje  DECIMAL(5,2)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        UPDATE empleados
        SET salario = salario * (1 + @porcentaje / 100)
        WHERE id = @empleado_id;

        IF (SELECT salario FROM empleados WHERE id = @empleado_id) > 200000
            THROW 50002, 'El salario resultante supera el máximo permitido.', 1;

        COMMIT;
        PRINT 'Salario actualizado correctamente.';
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT 'Error: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO`,
                hint: 'Después del UPDATE, verificá el nuevo salario con una subconsulta. Si supera el límite, usá THROW para lanzar el error y el CATCH hará el ROLLBACK.',
            },
        ],
        test: {
            id: 'test-sp',
            title: 'Prueba Técnica: Procedimientos Almacenados',
            description: 'Evaluá tu comprensión de los stored procedures.',
            questions: [
                {
                    id: 'q1',
                    question: '¿Cómo se ejecuta un procedimiento almacenado en SQL Server?',
                    options: ['RUN sp_nombre', 'CALL sp_nombre', 'EXEC sp_nombre', 'START sp_nombre'],
                    correctIndex: 2,
                    explanation: 'En SQL Server se usa EXEC (o EXECUTE) para ejecutar un stored procedure.',
                },
                {
                    id: 'q2',
                    question: '¿Qué hace SET NOCOUNT ON dentro de un SP?',
                    options: [
                        'Desactiva el SP',
                        'Evita que se envíe el mensaje "N filas afectadas" al cliente, mejorando el rendimiento',
                        'Cuenta las filas automáticamente',
                        'Limita el número de resultados',
                    ],
                    correctIndex: 1,
                    explanation: 'SET NOCOUNT ON suprime el mensaje "(N row(s) affected)" que SQL Server envía por defecto. Esto reduce el tráfico de red y mejora el rendimiento, especialmente en SPs con muchas operaciones.',
                },
                {
                    id: 'q3',
                    question: '¿Qué función dentro de CATCH devuelve el texto del error ocurrido?',
                    options: ['GET_ERROR()', 'ERROR_TEXT()', 'ERROR_MESSAGE()', 'CATCH_MESSAGE()'],
                    correctIndex: 2,
                    explanation: 'ERROR_MESSAGE() devuelve el texto descriptivo del error capturado en el bloque CATCH.',
                },
            ],
        },
    },
];
