// Activa el modo estricto: evita errores graves obligándote a declarar todas tus variables y prohibiendo malas prácticas.
"use strict";

// Clase para almacenar los datos correspondientes a cada calle.
class calle{
    // Constructor para inicializar los atributos de la clase calle.
    constructor(carteles, puertas, numeroPuerta, escaparates, hora, minutos, semaforo, coches){
        this.cantidadCarteles = carteles;
        this.cantidadPuertas = puertas;
        this.numeroPrimeraPuerta = numeroPuerta;
        this.cantidadEscaparates = escaparates;
        this.horaReloj = hora;
        this.minutosReloj = minutos;
        this.colorLuzSemaforo = semaforo;
        this.cantidadCoches = coches;
    }
}

// Array para almacenar las instancias de la clase calle.
const calles = [];

// Array para almacenar el HTML generado de cada calle.
const paginasCalles = [];

// Controlador de la decisión de repetir la ejecución del programa (se establece inicialmente en "false" para evitar repeticiones innecesarias).
var decisionRepetirEjecucion = false;

/**
 * Solicita al usuario si desea volver a ejecutar el programa después de producirse una respuesta no válida.
 *      Se devuelve:
 *          "true"  → Si el usuario desea volver a intentarlo.
 *          "false" → Si el usuario no desea volver a intentarlo.
 *          "null"  → Si el usuario cancela la solicitud.
 */
function solicitarReintento(){
    // Bucle controlador de reintentos sobre la solicitud de confirmación.
    do{
        // Solicita al usuario si desea volver a intentarlo (recolector de respuesta por pantalla).
        var respuesta = prompt("¿Quieres retroceder, volver a intentarlo? ('Sí' o 'No')");

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (respuesta === null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");
            return null;

        // Condicional para comprobar que la respuesta esperada únicamente contenga letras.
            /**
             * Comprueba/Verifica que la respuesta únicamente pueda contener caracteres alfabéticos.
             *      Se permiten:
             *          Letras mayúsculas y minúsculas.
             *          Vocales acentuadas y con diéresis.
             *          'Ñ' y 'ñ'.
             */
        } else if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+$/.test(respuesta)){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener letras.");
            
            // Registra en la consola la respuesta introducida.
            console.log (respuesta);

        // Condicional para respuestas que únicamente contienen letras.
        } else{
            // Normaliza la respuesta eliminando los espacios y convirtiendo las letras a minúsculas (facilitar las comparaciones).
            respuesta = respuesta.toLowerCase().trim();
            
            // Condicional para determinar si el usuario desea repetir la ejecución.
            switch (respuesta){
                // Condicional para el estado afirmativo de la respuesta.
                    // Como ambos casos de respuesta están consecutivos y el primero no tiene instrucciones, los dos ejecutan el mismo bloque de código. "fall-through" permite agrupar varios valores que deben recibir el mismo tratamiento operativo.
                case "sí":
                case "si":
                    return true;

                // Condicional para el estado negativo de la respuesta.
                case "no":
                    return false;

                // Condicional para respuestas no esperadas por el sistema.
                default:
                    alert("ERROR: La respuesta introducida no es válida. Recuerde que debe responder con un 'Sí' o 'No'.");

                    // Registra en la consola la respuesta introducida.
                    console.log (respuesta);

                    // Finaliza la ejecución del bloque "switch".
                    break;
            }
        }

    // Repite la solicitud (pregunta de reintento) hasta que no se haya recibido una respuesta válida.
    } while (true);
}

/**
 * Solicita al usuario un número entero comprendido entre un mínimo y un máximo, y repite la pregunta mientras la respuesta no sea válida y el usuario quiera reintentarlo.
 *      Parámetros:
 *          mensaje → Texto de la pregunta que se muestra al usuario.
 *          minimo  → Valor mínimo permitido (incluido).
 *          maximo  → Valor máximo permitido (incluido). Si no se indica, no hay límite superior.
 *      Se devuelve:
 *          El número introducido   → Si la respuesta es válida.
 *          "null"                  → Si el usuario cancela o no desea volver a intentarlo.
 */
function solicitarCantidad(mensaje, minimo, maximo = Infinity){
    // Bucle controlador de reintentos sobre la misma pregunta.
    do{
        // Solicita al usuario la respuesta (recolector de respuesta por pantalla).
        var respuesta = prompt(mensaje);

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (respuesta === null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola la respuesta introducida (null al cancelar).
            console.log (respuesta);

            return null;
        }

        // Convierte la respuesta de texto a número.
        var respuestaNumerica = Number(respuesta);

        /**
         * Condicional para comprobar/verificar que la respuesta sea válida.
         *      La primera condición comprueba si la respuesta está vacía.
         *      La segunda condición comprueba si es un número entero (se descartan textos y decimales).
         *      La tercera y cuarta condición comprueban que esté dentro del rango permitido.
         */
        if (respuesta.trim() == "" || !Number.isInteger(respuestaNumerica) || respuestaNumerica < minimo || respuestaNumerica > maximo){
            // Construye el mensaje de error según el rango permitido.
            var rango = (maximo == Infinity) ? `mayor o igual que ${minimo}` : `comprendido entre ${minimo} y ${maximo}`;

            // Muestreo de un mensaje de error indicando que la respuesta no es válida.
            alert(`ERROR: La respuesta únicamente puede contener un número entero ${rango}.`);

            // Registra en la consola la respuesta introducida.
            console.log(respuesta);

            // Si el usuario no desea volver a intentarlo (o cancela), se finaliza la solicitud.
            if (!solicitarReintento()){
                return null;
            }

        // Condicional para respuestas válidas.
        } else{
            return respuestaNumerica;
        }

    // Repite la solicitud hasta recibir una respuesta válida o hasta que el usuario decida no reintentarlo.
    } while (true);
}

// Bucle controlador de reintentos (se fuerza a que su contenido se ejecute mínimo una vez desde el arranque/inicio del programa).
do{
    // Estructura de control de flujo para la captura de posibles excepciones y errores de ejecución que se produzcan mientras el programa está arrancado.
    try{
        // Vacía las páginas guardadas para que no se mezclen con las de una ejecución anterior.
        paginasCalles.length = 0;

        // <========== Bloque de código para la solicitud sobre la cantidad de calles que hay en el camino ==========>

        // Solicita al usuario la cantidad de calles (recolector de respuesta por pantalla).
        var cantidadCalles = solicitarCantidad("¿Cuántas calles hay? (Se solicita un número entero positivo o cero)", 0);

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (cantidadCalles === null){
            // Detiene la repetición del programa.
            decisionRepetirEjecucion = false;

            // Finaliza la ejecución del bucle "do-while" que controla la repetición del programa.
            break;
        }

        // Registra en la consola la cantidad de calles introducidas.
        console.log (cantidadCalles);

        // Bucle para recorrer cada una de las calles.
        for (let i = 0; i < cantidadCalles; i++){
            // Identifica el número de la calle que se está procesando.
            var numeroCalle = i + 1;

            // Muestreo de un mensaje informativo indicando la calle que se va a procesar.
            alert(`Procesando la calle ${numeroCalle}... `);
            alert("Calle cargada. Proceda a introducir los datos para la calle.");
            
            /**
             * // Crea una nueva pestaña/ventana para mostrar los datos de la calle actual.
             * var ventanaNueva = window.open("", "_blank");
             */
            
            /**
             * // Abre reemplazando en la misma pestaña/ventana el contenido actual para mostrar los datos de la calle escogida.
             * var ventanaNueva = window.open("", "_self");
             */

            // Objeto que, en lugar de escribir en la página, va acumulando en "contenido" todo el HTML de la calle.
                /**
                 * " var ventanaNueva = { ... } " → Las llaves crean un objeto literal, igual que un objeto de la clase "calle", pero sin necesitar clase.
                 * " document: { ... } " → Es un objeto anidado dentro del objeto "ventanaNueva", cuyo propósito es simular el objeto 'document' real del navegador.
                 * " contenido: "" " → Es una propiedad que empieza siendo una cadena de texto vacía. Aquí se irá acumulando el HTML de la calle generado.
                 * " write(texto){ this.contenido += texto; } " → Es una método que empieza recibiendo una cadena de texto vacía, después lo concatena "+=" en la propiedad 'contenido' de este mismo objeto.
                 * " close(){} " → Es una función vacía. Existe porque en el código se llama a "ventanaNueva.document.close()" al final de cada calle; si no existiera, daría error. No necesita hacer nada.
                 */
            var ventanaNueva = { document: { contenido: "", write(texto){ this.contenido += texto; }, close(){} } };
            
            // Comprueba si el navegador ha bloqueado la apertura de la nueva pestaña/ventana.
            if (ventanaNueva === null){
                alert("ERROR: El navegador ha bloqueado la apertura de una nueva pestaña/ventana.");
                break;
            }

            /**
             * // Prepara el documento de la nueva pestaña/ventana.
             * ventanaNueva.document.write("<!DOCTYPE html>");
             * ventanaNueva.document.write("<html lang='es'>");
             * ventanaNueva.document.write("<head>");
             * ventanaNueva.document.write("<meta charset='UTF-8'>");
             * ventanaNueva.document.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
             * ventanaNueva.document.write("<title>Calle " + numeroCalle + "</title>");
             * ventanaNueva.document.write("<link rel='icon' href='Images/Icono/planeta.png'>");
             * ventanaNueva.document.write("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css' integrity='sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==' crossorigin='anonymous' referrerpolicy='no-referrer'>");
             * ventanaNueva.document.write("<link rel='stylesheet' href='CSS/style.css'>");
             * ventanaNueva.document.write("</head>");
             * ventanaNueva.document.write("<body>");
             * ventanaNueva.document.write("<header>");
             * ventanaNueva.document.write("</header>");
             * ventanaNueva.document.write("<main>");
             */

            
            // <========== Bloque de código para la solicitud sobre la cantidad de carteles que hay en el camino ==========>

            // Solicita al usuario la cantidad de carteles (recolector de respuesta por pantalla).
            var cantidadCarteles = solicitarCantidad("¿Cuántos carteles hay en el camino? (Se solicita un número entero positivo o cero)", 0);

            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (cantidadCarteles === null){                
                // Detiene la repetición del programa.
                decisionRepetirEjecucion = false;

                // Finaliza la ejecución del bucle "for" que recorre las calles.
                break;

            // Condicional para la respuesta esperada cero (0).
            } else if (cantidadCarteles === 0){
                ventanaNueva.document.write ("<div>");
                ventanaNueva.document.write ("<h3>");
                ventanaNueva.document.write ("No hay carteles por el camino");
                ventanaNueva.document.write ("</h3>");
                ventanaNueva.document.write ("</div>");

            // Condicional para respuestas esperadas.
            } else{
                // Registra en la consola la cantidad de carteles introducidos.
                console.log (cantidadCarteles);

                ventanaNueva.document.write ("<div>");

                // Bucle para mostrar los carteles introducidos por el usuario (usando un contador propio para así no modificar la cantidad original introducida de carteles).
                for (let j = 0; j < cantidadCarteles; j++){
                    ventanaNueva.document.write("<img src='Images/Carteles/americano.png'>");

                    // Registra en la consola el número del cartel mostrado.
                    console.log (j + 1);
                }

                ventanaNueva.document.write ("</div>");
            }

            // Salto de línea.
            ventanaNueva.document.write ("<br>");


            // <========== Bloque de código para la solicitud sobre la cantidad de puertas que hay en el camino ==========>

            // Solicita al usuario la cantidad de puertas (recolector de respuesta por pantalla).
            var cantidadPuertas = solicitarCantidad("¿Cuántas puertas hay en el camino? (Se solicita un número entero positivo o cero)", 0);
            
            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (cantidadPuertas === null){
                // Detiene la repetición del programa.
                decisionRepetirEjecucion = false;

                // Finaliza la ejecución del bucle "for" que recorre las calles.
                break;
                
            // Condicional para la respuesta esperada cero (0).
            } else if (cantidadPuertas === 0){
                // Sin puertas no hay número de primera puerta (evita arrastrar el de la calle anterior).
                var numeroPrimeraPuerta = null;
                
                ventanaNueva.document.write ("<div>");
                ventanaNueva.document.write ("<h3>");
                ventanaNueva.document.write ("No hay puertas por el camino");
                ventanaNueva.document.write ("</h3>");
                ventanaNueva.document.write ("</div>");

            // Condicional para respuestas esperadas.
            } else{
                // Registra en la consola la cantidad de puertas introducidas.
                console.log (cantidadPuertas);

                // Solicita al usuario el número de la primera puerta (recolector de respuesta por pantalla).
                var numeroPrimeraPuerta = solicitarCantidad("¿Cuál es el número de la primera puerta? (Se solicita un número entero positivo)", 1);
            
                // Condicional para comprobar si el usuario ha cancelado la solicitud.
                if (numeroPrimeraPuerta === null){
                    // Detiene la repetición del programa.
                    decisionRepetirEjecucion = false;

                    // Finaliza la ejecución del bucle "for" que recorre las calles.
                    break;
                }

                // Número de la puerta (copia para no modificar el de la primera puerta).
                let numeroPuertaActual = numeroPrimeraPuerta;

                ventanaNueva.document.write ("<div class = \"puertaEnumerada\">");

                // Bucle para mostrar las puertas (usando un contador propio para así no modificar la cantidad original introducida de puertas).
                for (let j = 0; j < cantidadPuertas; j++){
                    ventanaNueva.document.write ("<div class = \"puerta\">");
                    ventanaNueva.document.write ("<h3>");
                    ventanaNueva.document.write ("Nº " + numeroPuertaActual);
                    ventanaNueva.document.write ("</h3>");
                    ventanaNueva.document.write ("<img src='Images/Puertas/maderaRoja.png'>");
                    ventanaNueva.document.write ("</div>");

                    // Registra en la consola el número de la puerta mostrada.
                    console.log (numeroPuertaActual);

                    // Incrementa en dos unidades el número de la siguiente puerta.
                    numeroPuertaActual += 2; /* Es igual a poner "numeroPuertaActual = numeroPuertaActual + 2" */
                }

                ventanaNueva.document.write ("</div>");
            }

            // Salto de línea.
            ventanaNueva.document.write ("<br>");


            // <========== Bloque de código para la solicitud sobre la cantidad de escaparates que hay en el camino ==========>

            // Solicita al usuario la cantidad de escaparates (recolector de respuesta por pantalla).
            var cantidadEscaparates = solicitarCantidad("¿Cuántos escaparates hay en el camino? (Se solicita un número entero positivo o cero)", 0);

            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (cantidadEscaparates === null){
                // Detiene la repetición del programa.
                decisionRepetirEjecucion = false;

                // Finaliza la ejecución del bucle "for" que recorre las calles.
                break;

            // Condicional para la respuesta esperada cero (0).
            } else if (cantidadEscaparates === 0){
                ventanaNueva.document.write ("<div>");
                ventanaNueva.document.write ("<h3>");
                ventanaNueva.document.write ("No hay escaparates por el camino");
                ventanaNueva.document.write ("</h3>");
                ventanaNueva.document.write ("</div>");

            // Condicional para respuestas esperadas.
            } else{
                // Registra en la consola la cantidad de escaparates introducidos.
                console.log (cantidadEscaparates);

                ventanaNueva.document.write ("<div>");

                // Bucle para mostrar los escaparates (usando un contador propio para así no modificar la cantidad original introducida de escaparates).
                for (let j = 0; j < cantidadEscaparates; j++){
                    ventanaNueva.document.write("<img src='Images/Escaparates/tiendaCarniceria.png'>");

                    // Registra en la consola el número del escaparate mostrado.
                    console.log (j + 1);
                }
                
                ventanaNueva.document.write ("</div>");
            }

            // Salto de línea.
            ventanaNueva.document.write ("<br>");


            // <========== Bloque de código para la solicitud sobre la hora del reloj ==========>

            ventanaNueva.document.write ("<div class = \"relojSemaforo\">");

            // Solicita al usuario la hora del reloj (recolector de respuesta por pantalla).
            var horaReloj = solicitarCantidad("¿Qué hora es? (Introduzca un número comprendido entre 0 y 23)", 0, 23);

            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (horaReloj === null){
                // Detiene la repetición del programa.
                decisionRepetirEjecucion = false;

                // Finaliza la ejecución del bucle "for" que recorre las calles.
                break;
            }

            // Solicita al usuario los minutos del reloj (recolector de respuesta por pantalla).
            var minutosReloj = solicitarCantidad("¿Cuántos minutos son? (Introduzca un número comprendido entre 0 y 59)", 0, 59);

            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (minutosReloj === null){
                // Detiene la repetición del programa.
                decisionRepetirEjecucion = false;

                // Finaliza la ejecución del bucle "for" que recorre las calles.
                break;
            }
                
            ventanaNueva.document.write ("<div class = \"reloj\">");
            ventanaNueva.document.write ("<div class = \"horas\">");
            ventanaNueva.document.write (horaReloj);
            ventanaNueva.document.write ("</div>");
            ventanaNueva.document.write ("<div>");
            ventanaNueva.document.write (":");
            ventanaNueva.document.write ("</div>");
            ventanaNueva.document.write ("<div class = \"minutos\">");
            ventanaNueva.document.write (minutosReloj);
            ventanaNueva.document.write ("</div>");
            ventanaNueva.document.write ("</div>");


            // <========== Bloque de código para la solicitud sobre el color de las luces del semáforo ==========>

            // Solicita al usuario el color de las luces del semáforo (recolector de respuesta por pantalla).
            var colorLuzSemaforo = prompt("¿Cuál es el color de luz del semáforo? ('Rojo', 'Verde' o 'Ámbar')");

            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (colorLuzSemaforo === null){
                // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
                alert("La ejecución ha sido cancelada.");

                // Registra en la consola el color introducido.
                console.log (colorLuzSemaforo);
                
                // Detiene la repetición del programa.
                decisionRepetirEjecucion = false;

                // Finaliza la ejecución del bucle "for" que recorre las calles.
                break;

            // Condicional para comprobar que la respuesta esperada únicamente contenga letras.
            } else if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+$/.test(colorLuzSemaforo)){
                // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
                alert("ERROR: La respuesta únicamente puede contener letras.");
                
                // Registra en la consola el color introducido.
                console.log (colorLuzSemaforo);

                // Solicita al usuario si desea volver a intentarlo.
                decisionRepetirEjecucion = solicitarReintento();

                // Finaliza la ejecución del bucle "for" que recorre las calles.
                break;

            // Condicional para respuestas esperadas.
            } else{
                // Normaliza la entrada.
                    /** 
                     * Elimina los espacios y convierte la respuesta a minúsculas para facilitar las comparaciones.
                     *      Se sustituye:
                     *          "if (colorLuzSemaforo == "rojo" || colorLuzSemaforo == "ROJO" || colorLuzSemaforo == "Rojo"){"
                     *      Por:
                     *          "if (colorLuzSemaforo == "rojo"){"
                     */
                colorLuzSemaforo = colorLuzSemaforo.toLowerCase().trim();
                
                // Condicional para determinar el color de la luz del semáforo.
                switch (colorLuzSemaforo){
                    // Condicional para la luz roja del semáforo.
                    case "rojo":
                        ventanaNueva.document.write ("<div class = \"semaforo\">");
                        ventanaNueva.document.write("<img src='Images/ColorSemaforo/rojo.png'>");
                        ventanaNueva.document.write ("</div>");

                        // Registra en la consola el color introducido.
                        console.log (colorLuzSemaforo);

                        // Detiene la repetición del programa después de recibir una respuesta válida, bloque "do-while".
                        decisionRepetirEjecucion = false;

                        // Finaliza la ejecución del bloque "switch".
                        break;

                    // Condicional para la luz ámbar del semáforo.
                    case "ámbar":
                    case "ambar":
                        ventanaNueva.document.write ("<div class = \"semaforo\">");
                        ventanaNueva.document.write("<img src='Images/ColorSemaforo/ambar.png'>");
                        ventanaNueva.document.write ("</div>");

                        // Registra en la consola el color introducido.
                        console.log (colorLuzSemaforo);

                        // Detiene la repetición del programa después de recibir una respuesta válida, bloque "do-while".
                        decisionRepetirEjecucion = false;

                        // Finaliza la ejecución del bloque "switch".
                        break;

                    // Condicional para la luz verde del semáforo.
                    case "verde":
                        ventanaNueva.document.write ("<div class = \"semaforo\">");
                        ventanaNueva.document.write("<img src='Images/ColorSemaforo/verde.png'>");
                        ventanaNueva.document.write ("</div>");

                        // Registra en la consola el color introducido.
                        console.log (colorLuzSemaforo);

                        // Detiene la repetición del programa después de recibir una respuesta válida, bloque "do-while".
                        decisionRepetirEjecucion = false;

                        // Finaliza la ejecución del bloque "switch".
                        break;

                    // Condicional para respuestas no esperadas.
                    default:
                        ventanaNueva.document.write ("<div class = \"semaforo\">");
                        alert("ERROR: El color introducido no coincide con uno de los solicitados ('Rojo', 'Verde' o 'Ámbar').");
                        ventanaNueva.document.write ("</div>");

                        // Registra en la consola el color introducido.
                        console.log (colorLuzSemaforo);

                        // Solicita al usuario si desea volver a intentarlo.
                        decisionRepetirEjecucion = solicitarReintento();

                        // Finaliza la ejecución del bloque "switch".
                        break;
                }
            }

            ventanaNueva.document.write ("</div>");

            // Salto de línea.
            ventanaNueva.document.write ("<br>");


            // <========== Bloque de código para la solicitud sobre la cantidad de coches que hay en el camino ==========>

            // Solicita al usuario la cantidad de coches (recolector de respuesta por pantalla).
            var cantidadCoches = solicitarCantidad("¿Cuántos coches hay en la carretera/camino? (Se solicita un número entero positivo o cero)", 0);

            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (cantidadCoches === null){
                // Detiene la repetición del programa.
                decisionRepetirEjecucion = false;

                // Finaliza la ejecución del bucle "for" que recorre las calles.
                break;
            
            // Condicional para la respuesta esperada cero (0).
            } else if (cantidadCoches === 0){
                ventanaNueva.document.write ("<div>");
                ventanaNueva.document.write ("<h3>");
                ventanaNueva.document.write ("No hay coches en la carretera/camino");
                ventanaNueva.document.write ("</h3>");
                ventanaNueva.document.write ("</div>");

            // Condicional para respuestas esperadas.
            } else{
                // Registra en la consola la cantidad de coches introducidos.
                console.log (cantidadCoches);

                ventanaNueva.document.write ("<div>");

                // Bucle para mostrar los coches (usando un contador propio para así no modificar la cantidad original introducida de coches).
                for (let j = 0; j < cantidadCoches; j++){
                    ventanaNueva.document.write("<img src='Images/Coches/azul.png'>");

                    // Registra en la consola el número del coche mostrado.
                    console.log (j + 1);
                }

                ventanaNueva.document.write ("</div>");
            }


            // <========== Bloque de código para crear la calle ==========>

            // Crea una nueva instancia de la clase calle con los datos proporcionados. Estos serán guardados en el array.
            const nuevaCalle = new calle(cantidadCarteles, cantidadPuertas, numeroPrimeraPuerta, cantidadEscaparates, horaReloj, minutosReloj, colorLuzSemaforo, cantidadCoches);
            
            // Guarda el objeto (la nueva calle) dentro del Array.
            calles.push(nuevaCalle);

            
            ventanaNueva.document.write("</main>");
            ventanaNueva.document.write("<footer>");
            ventanaNueva.document.write("</footer>");
            ventanaNueva.document.write("</body>");
            ventanaNueva.document.write("</html>");
            ventanaNueva.document.close();

            // Guarda el HTML de la calle para mostrarlo al final si el usuario la elige.
            paginasCalles.push(ventanaNueva.document.contenido);
        }

        // Condicional para comprobar que se han completado todas las calles (si se ha cancelado o se va a reintentar, no se muestra nada).
        if (cantidadCalles > 0 && paginasCalles.length === cantidadCalles){
            // Solicita al usuario la calle que desea ver (recolector de respuesta por pantalla).
            var calleElegida = solicitarCantidad(`¿Qué calle desea/quiere visualizar? (Introduzca un número comprendido entre 1 y ${cantidadCalles})`, 1, cantidadCalles);

            // Condicional para comprobar que el usuario no ha cancelado la solicitud.
            if (calleElegida !== null){
                // Registra en la consola la calle elegida.
                console.log (calleElegida);

                // Muestra únicamente la calle elegida.
                document.write(paginasCalles[calleElegida - 1]);
            }
        }

    // Captura de posibles excepciones/errores de tipo genérico, "error", que ocurran/se produzcan durante el proceso de ejecución del programa (se lanza cuando se produce un fallo que no ha sido controlado previamente por el código, bajo las condiciones establecidas por el programa).
    } catch (error){
        // Muestreo por pantalla de un mensaje de error al usuario indicando que se ha producido un fallo durante la ejecución del programa.
        alert("ERROR: Se ha producido un fallo durante la ejecución del programa: " + error.message);

        // Muestreo por consola de un mensaje de error indicando que se ha producido un fallo durante la ejecución del programa.
        console.error ("ERROR: Se ha producido un fallo durante la ejecución del programa:", error);

        // Finaliza/Detiene la posibilidad de volver a ejecutar el programa después de producirse una excepción.
        decisionRepetirEjecucion = false;
    }

// Comprueba si el usuario ha solicitado volver a ejecutar el programa.
} while (decisionRepetirEjecucion == true);