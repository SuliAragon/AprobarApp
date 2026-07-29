import { withTemarioReference } from "./temario-explanation-references.mjs";
import type { QuizQuestion } from "./question-bank";

const explanationsByQuestionNumber: Record<number, string> = {
  1: "Ext2 es un sistema de ficheros propio del ecosistema Linux. NTFS y las familias FAT16 y FAT32 fueron diseñados para sistemas Windows, por lo que no encajan en la pregunta.",
  2: "Round Robin reparte el procesador en intervalos de tiempo fijos llamados quantum o time-slice. Cuando vence el quantum, el proceso vuelve a la cola de listos si todavia no ha terminado.",
  3: "La paginacion divide la memoria en paginas y marcos de tamano fijo. El ultimo marco asignado a un proceso puede quedar parcialmente sin usar, lo que produce fragmentacion interna; la externa es caracteristica de particiones variables.",
  4: "En la notacion octal de chmod, 7 equivale a lectura, escritura y ejecucion; 5, a lectura y ejecucion; y 4, a solo lectura. Por eso 754 otorga rwx al propietario, r-x al grupo y r-- al resto.",
  5: "Los permisos solicitados son rwx para el propietario (7), rw- para el grupo (6) y r-- para otros usuarios (4). La combinacion octal resultante es 764.",
  6: "Un daemon es un proceso de servicio que se ejecuta en segundo plano y normalmente no esta asociado a una terminal interactiva. Puede permanecer activo a la espera de peticiones, pero su rasgo definitorio es trabajar en background.",
  7: "Lollipop es el nombre comercial de Android 5.x, no una distribucion GNU/Linux. Red Hat, SUSE y Debian si son distribuciones Linux.",
  8: "Los estados clasicos de un proceso son listo, en ejecucion y bloqueado, entre otros segun el modelo. Ocioso describe habitualmente a la CPU sin trabajo, no el estado de un proceso.",
  9: "En la jerarquia de Linux, /etc contiene la configuracion global del sistema y de muchos servicios. /bin guarda ejecutables esenciales, /boot ficheros de arranque y /root es el directorio personal del superusuario.",
  10: "Android 2.0 recibio el nombre de Eclair. Cupcake corresponde a 1.5, Donut a 1.6 y Honeycomb a la rama 3.x.",
  11: "Android 8.1 pertenece a la version Oreo. Lollipop es Android 5, Marshmallow es 6 y Pie es 9.",
  12: "Segun la referencia temporal del temario y del test, la version vigente indicada es iOS 17. Es una pregunta de versionado, por lo que debe interpretarse con la fecha de actualizacion del material.",
  13: "La capa Media de iOS proporciona tecnologias de audio, video, graficos y acceso a contenidos multimedia. Core OS esta mas cerca del nucleo y Cocoa Touch concentra las APIs de interfaz de usuario.",
  14: "En la arquitectura de Firefox OS, Gonk es la capa inferior que enlaza con el kernel Linux y el hardware. Gecko es el motor de ejecucion y Gaia es la interfaz de usuario basada en tecnologias web.",
  15: "Samba implementa SMB/CIFS en sistemas UNIX y Linux para compartir archivos e impresoras e interoperar con equipos Windows. LDAP, Active Directory y Kerberos cumplen funciones distintas de directorio, dominio o autenticacion.",
  16: "Un proceso zombie ya ha finalizado, pero conserva temporalmente su entrada en la tabla de procesos hasta que su padre recoge su estado de terminacion mediante wait. No sigue ejecutando instrucciones ni es un proceso huerfano.",
  17: "HKEY_LOCAL_MACHINE\\Software\\Classes contiene asociaciones y configuracion de clases aplicables al equipo completo. HKEY_CURRENT_USER solo afecta al usuario actual y HKEY_CURRENT_CONFIG contiene el perfil de hardware en uso.",
  18: "Las tres categorias habituales de servicios cloud de Microsoft son IaaS, PaaS y SaaS. Informatica con servidor no es una de esas categorias de servicio estandar.",
  19: "Microsoft Application Virtualization, App-V, permite publicar y ejecutar aplicaciones Win32 virtualizadas sin instalarlas de la manera tradicional en cada equipo. WSL ejecuta entornos Linux, mientras que Hello y Defender tienen otros fines.",
  20: "El i-nodo o inode almacena metadatos del fichero en sistemas UNIX: propietario, permisos, tamano, fechas y punteros a bloques de datos. El nombre del fichero se guarda en el directorio, que lo asocia con su i-nodo.",
  21: "CentOS procede de la familia Red Hat, no de Debian. Ubuntu, Knoppix y Trisquel pertenecen al ecosistema Debian o derivan de el.",
  22: "ls lista el contenido del directorio, pwd muestra la ruta del directorio actual, cat escribe el contenido completo de un archivo en la salida estandar y more lo pagina para lectura interactiva.",
  23: "Android 5.1 forma parte de la familia Lollipop. Marshmallow llego con Android 6, Pie con Android 9 y Oreo con Android 8.",
  24: "Continuum es la denominacion usada en Windows 10 para adaptar la interfaz al modo de uso y al dispositivo. Modern UI se asocia a Windows 8 y Aero a versiones anteriores de Windows.",
  25: "Windows 8 introdujo la interfaz Modern UI, tambien conocida en su momento como Metro. Continuum se incorporo en Windows 10 y Aero corresponde al estilo visual de Windows Vista y 7.",
  26: "De acuerdo con los limites recogidos en el temario, JFS2 admite archivos de hasta 16 TB. Las restantes cifras no coinciden con el limite indicado para este sistema de ficheros.",
  27: "La afirmacion incorrecta es atribuir a Reiser4 un limite maximo de 4 TB. Reiser4 evoluciona ReiserFS, incorpora journaling y contempla caracteristicas como compresion y cifrado.",
  28: "XFS esta preparado para volúmenes y archivos de gran escala; el temario le atribuye la gestion de archivos de hasta 6 EB. Las otras alternativas no alcanzan ese limite en la referencia utilizada.",
  29: "Ext4 utiliza extents, rangos contiguos de bloques descritos como una unidad. Esto reduce la fragmentacion y evita mantener una referencia individual para cada bloque de un archivo grande.",
  30: "APFS ofrece cifrado nativo, ademas de snapshots y otras funciones modernas de Apple. Por ello es falsa la afirmacion de que solo admite encriptacion no nativa.",
  31: "Windows Insider es el programa de pruebas de Microsoft que permite recibir compilaciones preliminares de Windows antes de su disponibilidad general. No es una funcion de cifrado ni una capa Linux.",
  32: "Active Directory se organiza jerarquicamente: los bosques agrupan uno o varios dominios y, dentro de los dominios, se crean unidades organizativas para administrar objetos y aplicar politicas.",
  33: "Peppermint OS esta basada en Ubuntu, por lo que utiliza su ecosistema de paquetes y repositorios. Manjaro y Arch pertenecen a la familia Arch, y Ututo tiene otro origen.",
  34: "En la clasificacion del material, Peppermint OS se apoya en Lubuntu. Kubuntu, Xubuntu y Edubuntu son sabores distintos del ecosistema Ubuntu, pero no responden a esa relacion concreta.",
  35: "Pacman es el gestor de paquetes de Arch Linux y de sus derivadas, como Manjaro. Linux Mint y Elementary OS se apoyan en APT y Q4OS se integra en el entorno Debian.",
  36: "El directorio /sbin contiene ejecutables destinados a tareas de administracion del sistema, muchos de ellos orientados al superusuario. /bin contiene comandos esenciales de uso general y /etc guarda configuracion.",
  37: "Los registros del sistema se almacenan habitualmente bajo /var, en especial en /var/log. /tmp se usa para ficheros temporales y /etc para configuracion.",
  38: "El descriptor 1 es la salida estandar y el 2 es la salida de error. La redireccion 1>&2 hace que stdout se envie al mismo destino al que este apuntando stderr.",
  39: "La expresion 2>&1 copia el destino del descriptor 1 en el descriptor 2. Asi, la salida de error se mezcla con la salida estandar actual.",
  40: "El descriptor 2 corresponde a stderr y el operador >> anade la salida al final de un archivo sin sobrescribirlo. Por tanto, 2>> es la forma de concatenar los errores en un fichero.",
  41: "La umask elimina permisos del modo inicial. Partiendo del modo 777 empleado en el planteamiento, aplicar 036 deja 741: se quitan escritura y ejecucion al grupo, y escritura y ejecucion al resto.",
  42: "Desde Android 5 el runtime principal es ART, y Android 10 sigue utilizandolo. Dalvik es el runtime anterior; ARM es una arquitectura de procesador y JRE se refiere al entorno Java estandar.",
  43: "Android es de codigo abierto en gran parte, se apoya en el kernel Linux y dispone de Google Play como catalogo de aplicaciones. No utiliza un sistema de ficheros propio y aislado de los mecanismos habituales del sistema.",
  44: "NFU, Not Frequently Used, conserva contadores de referencia y puede identificar paginas no referenciadas en el ciclo anterior. LRU se basa en el uso mas lejano en el tiempo y NRU clasifica segun los bits de referencia y modificacion.",
  45: "NRU, Not Recently Used, selecciona una pagina que no ha sido usada recientemente mediante los bits de referencia y modificacion. Es distinto de LRU, que requiere conocer cual fue la usada hace mas tiempo.",
  46: "El peor ajuste escoge el hueco libre mas grande, lo que exige examinar los huecos disponibles para saber cual es. Por eso es incorrecto afirmar que no necesita una busqueda exhaustiva; primer, siguiente y mejor ajuste se describen correctamente.",
  47: "FCFS es no apropiativo: el proceso que obtiene la CPU la conserva hasta terminar o bloquearse voluntariamente. Round Robin, SRTF y la prioridad con reparto temporal permiten desalojar al proceso en ejecucion.",
  48: "El planificador a medio plazo controla el grado de multiprogramacion suspendiendo procesos y reanudandolos cuando conviene. El de corto plazo elige el siguiente proceso listo y el de largo plazo admite trabajos al sistema.",
  49: "Una politica de planificacion busca justicia, predecibilidad y evitar la inanicion, entre otros objetivos. Lo deseable es minimizar, no maximizar, el tiempo de respuesta percibido por el usuario.",
  50: "En un sistema de ficheros UNIX, los bloques de datos pueden almacenar el contenido de archivos y tambien las entradas de directorios. Los i-nodos se situan antes de la zona de datos y cada i-nodo representa un unico fichero.",
  51: "MIUI, One UI y OriginOS son capas de personalizacion de Android de distintos fabricantes. PenPoint OS fue un sistema orientado a tabletas con lapiz, no una capa de personalizacion Android.",
  52: "Un proceso de 32 bits no puede cargar una DLL de 64 bits, ni al reves, porque deben coincidir las arquitecturas. Las RPC entre procesos de 32 y 64 bits pueden funcionar tanto localmente como entre equipos, por lo que limitarlo al mismo equipo es falso.",
  53: "El sistema operativo es software que gestiona los recursos del hardware, no el conjunto completo de hardware y software del ordenador. Entre sus funciones si estan controlar permisos, planificar CPU y tratar interrupciones.",
  54: "FCFS, SJF y Round Robin son algoritmos de planificacion de CPU. Un algoritmo de agrupacion puede referirse a otras tecnicas informaticas, pero no es una politica de planificacion de procesos.",
  55: "Un proceso es una instancia de un programa en ejecucion y un thread es una unidad de ejecucion dentro de un proceso. Proceso terminal, threat y gestion de entrada/salida no nombran esa instancia.",
  56: "iOS es un sistema de tipo UNIX organizado en las capas Core OS, Core Services, Media y Cocoa Touch. Android y Firefox OS tienen arquitecturas y nombres de capas distintos.",
  57: "SJF, Shortest Job First, prioriza los trabajos cuya rafaga de CPU prevista es mas corta. FCFS respeta el orden de llegada y Round Robin reparte tiempo mediante quantums.",
  58: "En la planificacion no apropiativa el sistema no desaloja a un proceso que ya tiene la CPU; este la libera al terminar o bloquearse. Por ello un proceso que no cede el control puede retrasar indefinidamente a los demas.",
  59: "UNIX separa la ejecucion en modo usuario y modo kernel. El modo kernel permite ejecutar instrucciones privilegiadas y acceder a recursos protegidos; las aplicaciones ordinarias se ejecutan en modo usuario.",
  60: "Los algoritmos de reemplazo de paginas intentan reducir la tasa de fallos de pagina, ya que cada fallo obliga a traer una pagina desde almacenamiento secundario y penaliza mucho el rendimiento.",
};

function getQuestionNumber(id: string) {
  const match = id.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function withB2T4Explanation(question: QuizQuestion): QuizQuestion {
  const explanation = explanationsByQuestionNumber[getQuestionNumber(question.id)];

  if (!explanation) {
    return question;
  }

  return withTemarioReference({ ...question, explanation }, "B2T4");
}
