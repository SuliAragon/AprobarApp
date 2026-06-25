-- INIT database
CREATE TABLE Provincias (
  codpro INT PRIMARY KEY,
  nombre VARCHAR(20)
);

CREATE TABLE Pueblos (
  codpue INT PRIMARY KEY,
  nombre VARCHAR(20),
  codpro INT,
  FOREIGN KEY (codpro) REFERENCES Provincias (codpro)
);

CREATE TABLE Clientes (
  codcli INT PRIMARY KEY,
  nombre VARCHAR(20),
  direccion VARCHAR(20),
  codpostal INT,
  codpue INT REFERENCES Pueblos(codpue)
);

CREATE TABLE Vendedores (
  codven INT PRIMARY KEY,
  nombre VARCHAR(20),
  direccion VARCHAR(20),
  codpostal INT,
  codpue INT REFERENCES Pueblos(codpue),
  codjefe INT REFERENCES Vendedores(codven)
);

CREATE TABLE Articulos (
  codart INT PRIMARY KEY,
  descrip VARCHAR(20),
  precio REAL,
  stock INT,
  stock_min INT
);

CREATE TABLE Facturas (
  codfac INT PRIMARY KEY,
  fecha DATE,
  codcli INT REFERENCES Clientes (codcli),
  codven INT REFERENCES Vendedores (codven),
  iva INT,
  dto INT
);

CREATE TABLE Lineas_fac (
  codfac INT REFERENCES Facturas (codfac),
  linea INT,
  cant INT,
  codart INT REFERENCES Articulos (codart),
  precio INT,
  dto INT,
  PRIMARY KEY (codfac, linea)
);


INSERT INTO provincias (codpro, nombre) VALUES (15,'Provincia A');
INSERT INTO provincias (codpro, nombre) VALUES (23,'Provincia B');
INSERT INTO pueblos (codpue,nombre, codpro) VALUES (12,'Pueblo 1', 15);
INSERT INTO pueblos (codpue,nombre, codpro) VALUES (26,'Pueblo 2', 23);
 
INSERT INTO clientes (codcli, nombre, direccion, codpostal, codpue) VALUES (100,'Cliente 100', 'Calle Falsa 123', 28001, 12);
INSERT INTO clientes  (codcli, nombre, direccion, codpostal, codpue) VALUES (101,'Cliente 101', 'Avenida Siempre Viva', 28002, 26);
 
INSERT INTO vendedores (codven, nombre, direccion, codpostal, codpue, codjefe) VALUES (10,'Vendedor 10', 'Calle Mayor 100', 28001, 1, NULL);
INSERT INTO vendedores VALUES (20,'Vendedor 20', 'Calle San Juan 200', 28002, 2, 10);
 
INSERT INTO articulos (codart, descrip, precio, stock, stock_min) VALUES (1000,'Articulo 1', 10.5, 1000, 100);
INSERT INTO articulos (codart, descrip, precio, stock, stock_min) VALUES (2000,'Articulo 2', 20.0, 2500, 200);
 
INSERT INTO facturas (codfac, fecha, codcli, codven, iva, dto) VALUES (150, '2024-01-01', 100, 10, 21.0, 5.0);
INSERT INTO facturas (codfac, fecha, codcli, codven, iva, dto) VALUES (260, '2024-02-01', 100, 20, 16.0, 10.0);
 
INSERT INTO lineas_fac (codfac, linea, cant, codart, precio, dto) VALUES (150, 1, 2, 1000, 100.5, 5.0);
INSERT INTO lineas_fac (codfac, linea, cant, codart, precio, dto) VALUES (150, 2, 1, 2000, 200.0, 10.0);

INSERT INTO provincias VALUES (1, 'Aaa');
INSERT INTO provincias VALUES (2, 'Bbb');
INSERT INTO pueblos VALUES (7, 'Aaaaa aa Aaa' ,1);
INSERT INTO pueblos VALUES (8, 'Bbbbb bb Bbb' ,2);
INSERT INTO clientes VALUES (1, 'Ana', 'Calle A', 28001, 7);
INSERT INTO clientes VALUES (2, 'Bob', 'Calle B', 38002, 8);
INSERT INTO vendedores VALUES (1, 'Alvaro', 'Calle AaA', 88001, 7, 01);
INSERT INTO vendedores VALUES (2, 'Beatriz', 'Calle BbB', 99002, 8, 02);
INSERT INTO articulos VALUES (110, 'Galletas', 19, 40, 29);
INSERT INTO articulos VALUES (120, 'Zumo', 18, 50, 48);
INSERT INTO facturas VALUES (1001, '2000-01-02', 7, 1, 16,0);
INSERT INTO facturas VALUES (1002, '2000-10-20', 8, 2, 21,0);
INSERT INTO lineas_fac VALUES (1001, 10, 5, 110, 190, 121);
INSERT INTO lineas_fac VALUES (1002, 20, 5, 120, 190, 123);
INSERT INTO Pueblos VALUES (331442, 'Alcalá de Henares', 2);
INSERT INTO Pueblos VALUES (441223, 'Terrassa', 2);
INSERT INTO Clientes VALUES (11223344, 'Juan Pérez', 'Calle Mayor, 1', 28801, 331442);
INSERT INTO Clientes VALUES(22334455, 'María López', 'Avenida Diagonal, 45', 08221, 441223);
INSERT INTO Vendedores VALUES (33445566, 'Carlos Martín', 'Calle Luna, 7', 28802, 331442, NULL);
INSERT INTO Vendedores VALUES(44556677, 'Laura Sánchez', 'Calle Sol, 8', 08222, 441223, 33445566);
INSERT INTO Articulos VALUES (55667788, 'Ordenador Portátil', 899.99, 50, 10);
INSERT INTO Articulos VALUES (66778899, 'Teléfono Móvil', 699.99, 100, 20);
INSERT INTO Facturas VALUES(77889900, '2024-11-01', 11223344, 33445566, 21, 5);
INSERT INTO Facturas VALUES(88990011, '2024-11-15', 22334455, 44556677, 21, 10);
INSERT INTO Lineas_fac VALUES (77889900, 1, 2, 55667788, 899.99, 5);
INSERT INTO Lineas_fac VALUES (77889900, 2, 1, 66778899, 699.99, 10);
INSERT INTO Provincias VALUES (50, 'GRANADA');
INSERT INTO Provincias VALUES (51, 'MÁLAGA');
INSERT INTO Pueblos VALUES (2001, 'CENES DE LA VEGA', 50);
INSERT INTO Pueblos VALUES (2002, 'BENALMÁDENA', 51);
INSERT INTO Clientes VALUES (100501, 'PEDRO', 'CALLE ESPAÑA', 30190, 2002);
INSERT INTO Clientes VALUES (100502, 'MARÍA', 'CALLE AFRICA', 40501, 2001);
INSERT INTO Vendedores  VALUES (2090, 'EMPRESA 1', 'CALLE DINAMARCA', 13009, 2002, 400);
INSERT INTO Vendedores VALUES (2091, 'EMPRESA 2', 'CALLE ALEMANIA', 30069, 2003, 401);
INSERT INTO Provincias VALUES (101, 'Zaragoza');
INSERT INTO Provincias VALUES (102, 'Teruel');
INSERT INTO Pueblos VALUES (111, 'Botorrita', 1);
INSERT INTO Pueblos VALUES (2222, 'Torralba', 2);
INSERT INTO Clientes VALUES (112, 'Borja', 'calle 1', 50013, 1);
INSERT INTO Clientes VALUES (222, 'Alberto', 'calle 2', 50014, 2);
INSERT INTO Vendedores VALUES (12, 'Nacho', 'calle 3', 50018, 1, 1);
INSERT INTO Vendedores VALUES (22, 'Pedro', 'calle 4', 50019, 2, 2);
INSERT INTO Articulos VALUES (13, 'articulo 1', 5, 8, 1);
INSERT INTO Articulos VALUES (23, 'articulo 2', 7, 10, 1);
INSERT INTO Facturas VALUES (14, '2024/05/11', 2, 2, 21, 7);
INSERT INTO Facturas VALUES (25, '2024/07/11', 1, 2, 21, 7);
INSERT INTO Lineas_Fac VALUES (14, 1, 6, 1, 12, 7);
INSERT INTO Lineas_Fac VALUES (14, 2, 7, 2, 45, 9);
 
                  