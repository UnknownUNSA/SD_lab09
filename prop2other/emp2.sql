-- Crear la base de datos
CREATE DATABASE emp2;
USE emp2;

-- Crear la tabla de Departamentos
CREATE TABLE Departamentos (
    IDDpto INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15),
    Fax VARCHAR(15)
);

-- Crear la tabla de Proyectos con la columna IDDpto para la relación uno a muchos
CREATE TABLE Proyectos (
    IDProy INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Fec_Inicio DATE NOT NULL,
    Fec_Termino DATE,
    IDDpto INT,
    FOREIGN KEY (IDDpto) REFERENCES Departamentos(IDDpto)
);

-- Crear la tabla de Ingenieros
CREATE TABLE Ingenieros (
    IDIng INT AUTO_INCREMENT PRIMARY KEY,
    Especialidad VARCHAR(100) NOT NULL,
    Cargo VARCHAR(50) NOT NULL
);

-- Crear tabla intermedia para relacionar Proyectos e Ingenieros (muchos a muchos)
CREATE TABLE Proyectos_Ingenieros (
    IDProy INT,
    IDIng INT,
    PRIMARY KEY (IDProy, IDIng),
    FOREIGN KEY (IDProy) REFERENCES Proyectos(IDProy),
    FOREIGN KEY (IDIng) REFERENCES Ingenieros(IDIng)
);

-- Crear índices secundarios para búsquedas rápidas
CREATE INDEX idx_nombre_departamento ON Departamentos(Nombre);
CREATE INDEX idx_nombre_proyecto ON Proyectos(Nombre);
CREATE INDEX idx_especialidad_ingeniero ON Ingenieros(Especialidad);

-- Procedimientos almacenados para inserción de datos
DELIMITER //
CREATE PROCEDURE InsertarDepartamento(
    IN p_Nombre VARCHAR(100),
    IN p_Telefono VARCHAR(15),
    IN p_Fax VARCHAR(15)
)
BEGIN
    INSERT INTO Departamentos (Nombre, Telefono, Fax) VALUES (p_Nombre, p_Telefono, p_Fax);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE InsertarProyecto(
    IN p_Nombre VARCHAR(100),
    IN p_Fec_Inicio DATE,
    IN p_Fec_Termino DATE,
    IN p_IDDpto INT
)
BEGIN
    INSERT INTO Proyectos (Nombre, Fec_Inicio, Fec_Termino, IDDpto) VALUES (p_Nombre, p_Fec_Inicio, p_Fec_Termino, p_IDDpto);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE InsertarIngeniero(
    IN p_Especialidad VARCHAR(100),
    IN p_Cargo VARCHAR(50)
)
BEGIN
    INSERT INTO Ingenieros (Especialidad, Cargo) VALUES (p_Especialidad, p_Cargo);
END //
DELIMITER ;

-- Sentencias preparadas para inserción de datos
PREPARE stmt_insert_departamento FROM 'INSERT INTO Departamentos (Nombre, Telefono, Fax) VALUES (?, ?, ?)';
PREPARE stmt_insert_proyecto FROM 'INSERT INTO Proyectos (Nombre, Fec_Inicio, Fec_Termino, IDDpto) VALUES (?, ?, ?, ?)';
PREPARE stmt_insert_ingeniero FROM 'INSERT INTO Ingenieros (Especialidad, Cargo) VALUES (?, ?)';

-- Restricciones para mantener la consistencia de los datos
ALTER TABLE Proyectos
    ADD CONSTRAINT chk_fechas CHECK (Fec_Termino >= Fec_Inicio);

-- Iniciar transacción
START TRANSACTION;

-- Ejemplo de inserción de datos
CALL InsertarDepartamento('Arequipa', '123456789', '987654321');
CALL InsertarProyecto('Proyecto JAKA', '2024-01-01', '2024-12-31', 1);
CALL InsertarIngeniero('Ing. Barto', 'Jefe de Proyecto');

-- Confirmar transacción
COMMIT;

-- Asignar valores y ejecutar la sentencia preparada para insertar un departamento
SET @nombre_dpto = 'Lima';
SET @telefono_dpto = '234567890';
SET @fax_dpto = '876543210';
EXECUTE stmt_insert_departamento USING @nombre_dpto, @telefono_dpto, @fax_dpto;

-- Asignar valores y ejecutar la sentencia preparada para insertar un proyecto
SET @nombre_proy = 'Proyecto Lima';
SET @fec_inicio_proy = '2024-02-01';
SET @fec_termino_proy = '2024-11-30';
SET @iddpto_proy = 2; -- Suponiendo que el IDDpto del departamento 'Lima' es 2
EXECUTE stmt_insert_proyecto USING @nombre_proy, @fec_inicio_proy, @fec_termino_proy, @iddpto_proy;

-- Asignar valores y ejecutar la sentencia preparada para insertar un ingeniero
SET @especialidad_ing = 'Ing. Perez';
SET @cargo_ing = 'Analista';
EXECUTE stmt_insert_ingeniero USING @especialidad_ing, @cargo_ing;
