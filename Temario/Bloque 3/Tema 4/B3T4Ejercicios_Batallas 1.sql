
# Creación Tablas

CREATE TABLE clases (
 clase VARCHAR(45) PRIMARY KEY NOT NULL,
 tipo VARCHAR(20) NOT NULL,
 pais VARCHAR(45) NOT NULL,
 numArmas INT NOT NULL,
 calibre INT NOT NULL,
 desplazamiento INT NOT NULL
);

CREATE TABLE barcos (
 nombre VARCHAR(45) PRIMARY KEY NOT NULL, 
 clase VARCHAR(45) NOT NULL, 
 botado  INT,
 FOREIGN KEY (clase) REFERENCES clases(clase)
);

CREATE TABLE batallas (
 nombre VARCHAR(25) PRIMARY KEY NOT NULL,
 fecha DATE NOT NULL
);

CREATE TABLE resultados (
 barco VARCHAR(45) NOT NULL,
 batalla VARCHAR(45) NOT NULL,
 resultado VARCHAR(45) NOT NULL, 
 
 PRIMARY KEY (barco, batalla),
 FOREIGN KEY (barco) REFERENCES barcos(nombre),
 FOREIGN KEY (batalla) REFERENCES batallas(nombre)
);

#-------------------------------------------------------------------------
# Carga de datos
 
INSERT INTO clases VALUES ("Bismarck", "acorazado", "Germany", 8, 15, 42000);
INSERT INTO clases VALUES ("Iowa", "acorazado", "USA", 9, 16, 46000);
INSERT INTO clases VALUES ("Congo", "crucero", "Japan", 8, 14, 32000);
INSERT INTO clases VALUES ("North Carolina", "acorazado", "USA", 9, 16, 37000);
INSERT INTO clases VALUES ("Renown", "crucero", "Gt.Britain", 6, 15, 32000);
INSERT INTO clases VALUES ("Revenge", "acorazado", "Gt.Britain", 8, 15, 29000);
INSERT INTO clases VALUES ("Tennessee", "acorazado", "USA", 12, 14, 32000);
INSERT INTO clases VALUES ("Yamato", "acorazado", "Japan", 9, 18, 65000);
INSERT INTO clases VALUES ("Suffolk", "crucero", "Gt.Britain", 8, 8, 10000);
INSERT INTO clases VALUES ("Colorado", "acorazado", "USA", 9, 16, 33000);


INSERT INTO batallas VALUES("Sola Air Station", "1940/04/17");
INSERT INTO batallas VALUES("North Atlantic", "1941/05/24");
INSERT INTO batallas VALUES("Guadalcanal", str_to_date('15/11/1942', '%d/%m/%Y')); 
INSERT INTO batallas VALUES("North Cape", "1943/12/26");
INSERT INTO batallas VALUES("Surigao Strait", "1944/10/25");
INSERT INTO batallas VALUES("Murmansk","1942/05/01");


INSERT INTO barcos VALUES("California","Tennessee",1921);
INSERT INTO barcos VALUES("Haruna","Congo",1915);
INSERT INTO barcos VALUES("Hiei","Congo",1914);
INSERT INTO barcos VALUES("Iowa","Iowa",1941);
INSERT INTO barcos VALUES("Kirishima","Congo",1915);
INSERT INTO barcos VALUES("Congo","Congo",1913);
INSERT INTO barcos VALUES("Missouri","Iowa",1944);
INSERT INTO barcos VALUES("Musashi","Yamato",1942);
INSERT INTO barcos VALUES("New Jersey","Iowa",1943);
INSERT INTO barcos VALUES("North Carolina","North Carolina",1941);
INSERT INTO barcos VALUES("Ramillies","Revenge",1917);
INSERT INTO barcos VALUES("Renown","Renown",1913);
INSERT INTO barcos VALUES("Repulse","Renown",1916);
INSERT INTO barcos VALUES("Resolution","Revenge",1916);
INSERT INTO barcos VALUES("Revenge","Revenge",1915);
INSERT INTO barcos VALUES("Royal Oak", "Revenge",1916);
INSERT INTO barcos VALUES("Royal Sovereign","Revenge",1916);
INSERT INTO barcos VALUES("Suffolk","Suffolk",1924);
INSERT INTO barcos VALUES("Tennessee","Tennessee",1920);
INSERT INTO barcos VALUES("West Virginia","Colorado",1920);
INSERT INTO barcos VALUES("Washington","North Carolina",1941);
INSERT INTO barcos VALUES("Wisconsin","Iowa",1944);
INSERT INTO barcos VALUES("Yamato","Yamato",1941);


INSERT INTO resultados VALUES("Yamato","North Cape","hundido");
INSERT INTO resultados VALUES("California","Surigao Strait","ok");
INSERT INTO resultados VALUES("Washington","North Cape","hundido");
INSERT INTO resultados VALUES("Kirishima","Guadalcanal","da–ado");
INSERT INTO resultados VALUES("Kirishima","North Cape","hundido");
INSERT INTO resultados VALUES("North Carolina","North Cape","hundido");
INSERT INTO resultados VALUES("Tennessee","Surigao Strait","ok");
INSERT INTO resultados VALUES ("Washington","Guadalcanal","ok");
INSERT INTO resultados VALUES("West Virginia","Surigao Strait","ok");