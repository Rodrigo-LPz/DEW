// Activa el modo estricto: evita errores graves obligándote a declarar todas tus variables y prohibiendo malas prácticas.
"use strict";


// <========== Variables ==========>

// Controlador de la decisión de repetir la ejecución del programa (se establece inicialmente en "false" para evitar repeticiones innecesarias).
let repetirEjecucion = false;

// Dimensión mínima y máxima permitida para las filas y columnas del tablero.
const dimensionMinima = 4, dimensionMaxima = 10;

// Cantidad de filas, columnas y casillas sobre el tablero.
let nFilas, nColumnas, nCasillas;

// Matriz (array bidimensional) auxiliar que representa el campo de batalla:
    /**
     * Cada posición almacena:
     *     - "0" (agua).
     *     - "-1" (agua espaciadora, zona/casilla de agua bloqueada junto a un barco).
     *     - El tamaño del barco que la ocupa ("1", "2" o "3").
     * 
     *     Durante la partida, al disparar, la casilla cambia a:
     *         - "-2" (agua disparada).
     *         - "-3" (barco tocado).
     *         - "-4" (barco hundido).
     */
const tablero = [];

// Valor que representa una casilla de agua libre dentro del tablero.
const aguaLibre = 0;

// Valor que representa una casilla de agua bloqueada (adyacente a un barco, incluidas las diagonales), donde no se puede colocar otro barco.
const aguaBloqueada = -1;

// Valor que representa una casilla de agua ya disparada (disparo fallido).
const aguaDisparada = -2;

// Valor que representa una casilla de barco alcanzada (tocado), mientras el barco sigue a flote.
const barcoTocado = -3;

// Valor que representa una casilla de un barco hundido (al hundirse, todas sus casillas pasan a este valor).
const barcoHundido = -4;

// Tamaños de barco existentes en el juego (cada barco ocupa tantas casillas consecutivas como indica su tamaño).
const longitudBarcos = [1, 2, 3];

// Cantidad de barcos de cada tamaño (array paralelo a "longitudBarcos": cada posición corresponde al tamaño de la misma posición en "longitudBarcos").
const cantidadBarcos = [];

// Casillas totales que ocuparán los barcos y casillas que corresponden a cada tamaño de barco.
let casillasConBarcos, casillasPorLongitud;

// Barcos colocados en el tablero (array de objetos):
    /**
     * Cada objeto, cada barco, almacena/guarda los datos necesarios para pintar su imagen sobre la tabla y para controlar su estado durante la partida:
     *     - fila, columna → Casilla ancla del barco (la situada más arriba a la izquierda), donde se coloca su imagen.
     *     - longitud      → Tamaño del barco (número de casillas que ocupa la imagen).
     *     - orientacion   → "h" (la imagen se extiende hacia la derecha) o "v" (la imagen se gira y se extiende hacia abajo).
     *     - casillas      → Array de coordenadas [fila, columna] de todas las casillas que ocupa el barco (para saber a qué barco pertenece la casilla disparada).
     *     - impactos      → Número de casillas del barco que han sido alcanzadas (si llega a su longitud, el barco está hundido).
     *     - imagen        → Elemento "<img>" del barco en la página (se guarda al pintar el tablero, para poder cambiarla por la del barco hundido).
     */
const barcosColocados = [];

// Controlador de la visibilidad de los barcos durante la partida ("false" → ocultos hasta que se hunden; "true" → siempre visibles, útil para pruebas).
const barcosVisibles = false;

// Número de barcos hundidos durante la partida.
let barcosHundidos = 0;

// Número de disparos realizados durante la partida.
let disparosRealizados = 0;


/**
 * Solicita al usuario si desea volver a ejecutar el programa después de producirse una respuesta no válida.
 *     Se devuelve:
 *         "true"  → Si el usuario desea volver a intentarlo.
 *         "false" → Si el usuario no desea volver a intentarlo.
 *         "null"  → Si el usuario cancela la solicitud.
 */
function solicitarReintento(){
    // Bucle controlador de reintentos sobre la solicitud de confirmación.
    do{
        // Solicita al usuario si desea volver a intentarlo (recolector de respuesta por pantalla).
        let respuesta = prompt("¿Quieres retroceder, volver a intentarlo? ('Sí' o 'No')");

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (respuesta === null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola (como advertencia) que el usuario ha cancelado la solicitud.
            console.warn("[solicitarReintento] Solicitud cancelada por el usuario.");
            
            return null;
        }

        // Normaliza la respuesta eliminando los espacios y convirtiendo las letras a minúsculas (facilitar las comparaciones).
        respuesta = respuesta.toLowerCase().trim();

        // Condicional para comprobar que la respuesta esperada únicamente contenga letras.
            /**
             * Comprueba/Verifica que la respuesta únicamente pueda contener caracteres alfabéticos.
             *      Se permiten:
             *          Letras mayúsculas (se normaliza a minúscula) y minúsculas.
             *          Vocales acentuadas y con diéresis.
             *          'Ñ' (se normaliza a minúscula) y 'ñ'.
             */
        if (!/^[a-záéíóúüñ]+$/.test(respuesta)){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener letras.");
            
            /**
             * // Registra en la consola la respuesta introducida.
             * console.log(respuesta);
             */
            // Registra en la consola (como advertencia) la respuesta rechazada por contener caracteres no permitidos.
            console.warn(`[solicitarReintento] Respuesta rechazada (caracteres no permitidos): "${respuesta}".`);

        // Condicional para respuestas que únicamente contienen letras.
        } else{
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

                    /**
                     * // Registra en la consola la respuesta introducida.
                     * console.log(respuesta);
                     */
                    // Registra en la consola (como advertencia) la respuesta rechazada por no ser "Sí" ni "No".
                    console.warn(`[solicitarReintento] Respuesta rechazada (se esperaba 'Sí' o 'No'): "${respuesta}".`);

                    // Finaliza la ejecución del bloque "switch".
                    break;
            }
        }

    // Repite la solicitud (pregunta de reintento) hasta que no se haya recibido una respuesta válida.
    } while (true);
}


/**
 * Solicita al usuario un número entero comprendido entre un mínimo y un máximo, y repite la pregunta mientras la respuesta no sea válida y el usuario quiera reintentarlo.
 *     Parámetros:
 *         mensaje → Texto de la pregunta que se muestra al usuario.
 *         minimo  → Valor mínimo permitido (incluido).
 *         maximo  → Valor máximo permitido (incluido). Si no se indica, no hay límite superior.
 *     Se devuelve:
 *         El número introducido   → Si la respuesta es válida.
 *         "null"                  → Si el usuario cancela o no desea volver a intentarlo.
 */
function solicitarCantidad(mensaje, minimo, maximo = Infinity){
    // Extrae la primera línea del mensaje para identificar la pregunta en los registros de la consola (se descarta la línea de instrucciones).
    const pregunta = mensaje.split("\n")[0];

    // Bucle controlador de reintentos sobre la misma pregunta.
    do{
        // Solicita al usuario la respuesta (recolector de respuesta por pantalla).
        let respuesta = prompt(mensaje);

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (respuesta === null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            /**
             * // Registra en la consola la respuesta introducida.
             * console.log(respuesta);
             */
            // Registra en la consola (como advertencia) que el usuario ha cancelado la pregunta.
            console.warn(`[solicitarCantidad] Solicitud cancelada por el usuario en: "${pregunta}".`);

            return null;
        }

        // Normaliza la respuesta eliminando los espacios del principio y del final.
        respuesta = respuesta.trim();

        // Convierte la respuesta de texto a número.
        const respuestaNumerica = Number(respuesta);

        /**
         * Condicional para comprobar/verificar que la respuesta sea válida.
         *      La primera condición comprueba si es un número entero (se descartan respuestas vacías, textos, signos, decimales y notaciones como "0x0A" o "1e1").
         *      La segunda y tercera condición comprueban que esté dentro del rango permitido.
         */
        if (!/^\d+$/.test(respuesta) /*!Number.isInteger(respuestaNumerica)*/ || respuestaNumerica < minimo || respuestaNumerica > maximo){
            // Construye el mensaje de error según el rango permitido.
            const rango = (maximo === Infinity) ? `mayor o igual que ${minimo}` : `comprendido entre ${minimo} y ${maximo}`;

            // Muestreo de un mensaje de error indicando que la respuesta no es válida.
            alert(`ERROR: La respuesta únicamente puede contener un número entero ${rango}.`);

            /**
             * // Registra en la consola la respuesta introducida.
             * console.log(respuesta);
             */
            // Registra en la consola (como advertencia) la respuesta rechazada, la pregunta a la que pertenece y el rango permitido.
            console.warn(`[solicitarCantidad] Respuesta rechazada en "${pregunta}": "${respuesta}" (se esperaba un número entero ${rango}).`);

            // Si el usuario no desea volver a intentarlo (o cancela), se finaliza la solicitud.
            if (!solicitarReintento()) return null;

        // Condicional para respuestas válidas.
        } else return respuestaNumerica;

    // Repite la solicitud hasta recibir una respuesta válida o hasta que el usuario decida no reintentarlo.
    } while (true);
}


/**
 * Bloquea (marca con "-1") todas las casillas de agua que rodean a una casilla ocupada por un barco, incluidas las diagonales, para impedir que otro barco pueda colocarse junto a ella.
 *     Parámetros:
 *         tablero → Matriz (array bidimensional) que representa el campo de batalla.
 *         fila    → Índice de la fila de la casilla ocupada (empieza en 0).
 *         columna → Índice de la columna de la casilla ocupada (empieza en 0).
 */
function bloquearAlrededor(tablero, fila, columna){
    // Bucle para recorrer la fila anterior, la actual y la siguiente a la casilla ocupada.
    for (let i = fila - 1; i <= fila + 1; i++){
        // Bucle para recorrer la columna anterior, la actual y la siguiente a la casilla ocupada.
        for (let j = columna - 1; j <= columna + 1; j++){
            /**
             * Condicional para comprobar/verificar que la casilla vecina se pueda bloquear.
             *     La primera y segunda condición comprueban que la fila esté dentro del tablero (evita salirse por arriba o por abajo).
             *     La tercera y cuarta condición comprueban que la columna esté dentro del tablero (evita salirse por la izquierda o por la derecha).
             *     La quinta condición comprueba que la casilla sea agua libre (no se sobrescriben barcos ni casillas ya bloqueadas).
             */
            if (i >= 0 && i < tablero.length && j >= 0 && j < tablero[i].length && tablero[i][j] === aguaLibre){
                // Bloquea la casilla vecina.
                    /**
                     * Solo se bloquean casillas que valgan 0. Así:
                     *     La casilla central (el barco, que vale 1, 2 o 3) no se toca, aunque los bucles pasen por ella.
                     *     Otro barco que esté cerca no se sobrescribe.
                     *     Una casilla ya bloqueada (-1) se deja como está.
                     */
                tablero[i][j] = aguaBloqueada;
            }
        }
    }
}


/**
 * Busca, entre los barcos colocados, el que tiene su casilla ancla en la posición indicada.
 *     Parámetros:
 *         barcos  → Array de objetos con los barcos colocados.
 *         fila    → Índice de la fila de la casilla (empieza en 0).
 *         columna → Índice de la columna de la casilla (empieza en 0).
 *     Se devuelve:
 *         El objeto del barco → Si algún barco empieza (tiene su casilla ancla) en esa casilla.
 *         "null"              → Si ningún barco empieza en esa casilla.
 */
function buscarBarcoEnCasilla(barcos, fila, columna){
    // Bucle para recorrer cada uno de los barcos colocados.
    for (let k = 0; k < barcos.length; k++){
        // Condicional para comprobar si la casilla ancla del barco actual coincide con la casilla indicada.
        if (barcos[k].fila === fila && barcos[k].columna === columna) return barcos[k];
    }

    // Si ningún barco tiene su casilla ancla en esa posición, no hay imagen que pintar.
    return null;
}


/**
 * Busca, entre los barcos colocados, el que ocupa la posición indicada (en cualquiera de sus casillas, no solo en la casilla ancla).
 *     Parámetros:
 *         barcos  → Array de objetos con los barcos colocados.
 *         fila    → Índice de la fila de la casilla (empieza en 0).
 *         columna → Índice de la columna de la casilla (empieza en 0).
 *     Se devuelve:
 *         El objeto del barco → Si alguna de sus casillas coincide con la indicada.
 *         "null"              → Si ningún barco ocupa esa casilla.
 */
function buscarBarcoQueOcupa(barcos, fila, columna){
    // Bucle para recorrer cada uno de los barcos colocados.
    for (let k = 0; k < barcos.length; k++){
        // Bucle para recorrer cada una de las casillas del barco actual.
        for (let c = 0; c < barcos[k].casillas.length; c++){
            // Condicional para comprobar si la casilla actual del barco coincide con la casilla indicada.
            if (barcos[k].casillas[c][0] === fila && barcos[k].casillas[c][1] === columna) return barcos[k];
        }
    }

    // Si ningún barco ocupa esa casilla, es agua.
    return null;
}


/**
 * Pinta en la página el tablero recibido como una tabla HTML construida con el DOM. Todas las casillas se pintan como agua y, sobre la casilla ancla de cada barco, se coloca una única imagen que se extiende por todas las casillas que ocupa.
 *     Parámetros:
 *         tablero → Matriz (array bidimensional) con el contenido de cada casilla (determina las dimensiones de la tabla).
 *         barcos  → Array de objetos con los barcos colocados (determina dónde va cada imagen y cómo se orienta).
 */
function pintarTablero(tablero, barcos){
    // Contenedor de la página donde se insertará la tabla (etiqueta "<main>" del HTML).
    const contenedor = document.querySelector("main"); /* Busca en la página web la etiqueta "<main>" y la guarda en la variable contenedor. */

    // Ventana de anuncios de la partida, muestra el mensaje de inicio, el resultado de cada disparo y el final de la partida.
    const mensajeJuego = document.createElement("p");
    mensajeJuego.id = "mensajeJuego"; /* Identificador único, para poder encontrarlo después desde otras funciones con "querySelector("#mensajeJuego")". */
    mensajeJuego.classList.add("mensaje");
    mensajeJuego.textContent = `¡Comienza la batalla! Hay ${barcos.length} barco(s) escondidos. Haz clic en una casilla para disparar.`;
    contenedor.appendChild(mensajeJuego);

    // Crea la tabla (todavía no está en la página, solo en memoria) y le asigna su clase.
    const tabla = document.createElement("table"); /* Crea una etiqueta HTML de tabla "<table>" en la memoria del navegador (no se ve en pantalla todavía). */
    tabla.classList.add("tablero"); /* Añade la clase CSS "tablero" para poder darle diseño y color. */


    // <========== Cabecera (numeración de columnas) ==========>
    
    const filaCabecera = document.createElement("tr");

    // Casilla vacía de la esquina superior izquierda (cruce entre la numeración de filas y columnas. Soluciona el desfase creado por la numeración de los arrays al empezar por 0).
    filaCabecera.appendChild(document.createElement("th")); /* Crea una celda de cabecera vacía "<th>" y la mete dentro de la fila. Esto sirve para dejar el hueco de la esquina superior izquierda libre (justo donde se cruzan las filas y las columnas). */

    // Bucle para recorrer cada una de las columnas (tomando como referencia el número de columnas de la primera fila, ya que todas tienen la misma longitud).
    for (let j = 0; j < tablero[0].length; j++){
        const numeroColumna = document.createElement("th");
        numeroColumna.textContent = j + 1; /* Actualiza el valor sumándole uno para que no empiece por cero. */
        filaCabecera.appendChild(numeroColumna); /* Añade a la fila de cabecera. */
    }

    // Una vez creados todos los números, mete esa fila de cabecera ya completa dentro de la tabla.
    tabla.appendChild(filaCabecera);


    // <========== Casillas ==========>
    
    // Bucle para recorrer cada una de las filas del tablero.
    for (let i = 0; i < tablero.length; i++){
        const filaTabla = document.createElement("tr");

        // Numeración de la fila actual.
        const numeroFila = document.createElement("th");
        numeroFila.textContent = i + 1;
        filaTabla.appendChild(numeroFila);

        // Bucle para recorrer cada una de las casillas de la fila actual.
        for (let j = 0; j < tablero[i].length; j++){
            // Busca si en la casilla actual empieza (casilla ancla) alguno de los barcos colocados.
            const barco = buscarBarcoEnCasilla(barcos, i, j);

            // Todas las casillas tienen el agua de fondo (las del barco también, ya que la imagen del barco es transparente alrededor).
            const casilla = document.createElement("td");
            casilla.classList.add("agua");

            // Condicional para comprobar si en la casilla actual empieza un barco.
            if (barco !== null){
                // Imagen del barco.
                const imagenBarco = document.createElement("img");
                imagenBarco.src = `Images/Barcos/barco(${barco.longitud}).png`; /* Define la ruta del archivo de la imagen que se va a mostrar */
                imagenBarco.alt = `Barco de tamaño ${barco.longitud}`; /* Añade un texto alternativo a la imagen por accesibilidad. */
                imagenBarco.classList.add("imagenBarco");

                // Condicional para ocultar el barco al jugador (la imagen existe en la página, pero no se ve hasta que el barco se hunde).
                if (!barcosVisibles) imagenBarco.classList.add("oculto");

                // Condicional para girar la imagen únicamente en los barcos verticales.
                if (barco.orientacion === "v") imagenBarco.classList.add("vertical");

                // Pasa la longitud del barco al CSS como variable ("--longitud") para que la imagen ocupe tantas casillas como el barco.
                imagenBarco.style.setProperty("--longitud", barco.longitud); /* Pasa el tamaño del barco (su longitud) directamente al código CSS a través de la variable "--longitud". De esta forma "style.css" sabe exactamente cuántas casillas debe ocupar esa imagen a lo largo o a lo ancho. */

                casilla.appendChild(imagenBarco);

                // Guarda en el objeto del barco una referencia a su imagen (para poder cambiarla más adelante por la del barco hundido).
                barco.imagen = imagenBarco;
            }

            // Botón de disparo de la casilla (creado con JS, no en el HTML): cubre toda la casilla y es lo que recibe el clic del usuario.
            const botonCasilla = document.createElement("button");
            botonCasilla.classList.add("botonCasilla");
            botonCasilla.title = `Fila ${i + 1}, columna ${j + 1}`; /* Texto que aparece al dejar el ratón encima del botón. */

            // Evento de clic. Cada botón recuerda su propia fila, columna, casilla y botón (los de esta vuelta del bucle).
            botonCasilla.addEventListener("click", function(){
                disparar(tablero, barcos, i, j, casilla, botonCasilla);
            });

            casilla.appendChild(botonCasilla);

            filaTabla.appendChild(casilla);
        }

        tabla.appendChild(filaTabla);
    }

    // Inserta la tabla completa en la página (hasta este momento solo existía en memoria).
    contenedor.appendChild(tabla);
}


/**
 * Muestra un anuncio en la ventana de la partida, mensaje personalizado según el suceso.
 *     Parámetros:
 *         texto → Mensaje que se muestra al jugador.
 *         tipo  → Clase CSS según el tipo del suceso: "agua", "tocado", "hundido" o "victoria".
 */
function anunciar(texto, tipo){
    // Busca el cartel en la página (creado al pintar el tablero).
    const mensajeJuego = document.querySelector("#mensajeJuego");

    mensajeJuego.textContent = texto;

    // Sustituye todas las clases del cartel por "mensaje" y la del suceso actual.
    mensajeJuego.className = `mensaje ${tipo}`;
}


// Desactiva todos los botones de disparo del tablero para que no se pueda seguir disparando una vez terminada la partida.
function desactivarTablero(){
    // Busca todos los botones de disparo de la página (devuelve una lista, parecida a un array).
    const botones = document.querySelectorAll(".botonCasilla");

    // Bucle para recorrer cada uno de los botones y desactivarlo.
    for (let k = 0; k < botones.length; k++) botones[k].disabled = true;
}

// Crea el botón "Reiniciar" debajo del tablero (se muestra al terminar la partida). Al pulsarlo, recarga la página para empezar una partida nueva desde cero.
function mostrarBotonReiniciar(){
    // Contenedor de la página donde se insertará el botón (debajo del tablero, ya que se añade después de él).
    const contenedor = document.querySelector("main");

    // Botón de reinicio (creado con JS, no en el HTML).
    const botonReiniciar = document.createElement("button");
    botonReiniciar.textContent = "Reiniciar";
    botonReiniciar.classList.add("botonReiniciar");

    // Evento para recargar la página, haciendo que el script vuelva a ejecutarse desde el principio.
    botonReiniciar.addEventListener("click", function(){ location.reload(); }); /* "location.reload()" sirve para recargar la página. Equivale a "F5" o "Crtl + R". */

    contenedor.appendChild(botonReiniciar);
}


/**
 * Resuelve el disparo sobre una casilla: marca el resultado (agua o tocado) y, si el barco alcanzado ha recibido tantos impactos como su longitud, lo marca como hundido.
 *     Parámetros:
 *         tablero      → Matriz (array bidimensional) con el contenido de cada casilla.
 *         barcos       → Array de objetos con los barcos colocados.
 *         fila         → Índice de la fila de la casilla disparada (empieza en 0).
 *         columna      → Índice de la columna de la casilla disparada (empieza en 0).
 *         casilla      → Elemento "<td>" de la casilla disparada (donde se coloca la marca del disparo).
 *         botonCasilla → Elemento "<button>" de la casilla disparada (se desactiva tras el disparo).
 */
function disparar(tablero, barcos, fila, columna, casilla, botonCasilla){
    // Condicional para comprobar/verificar en la matriz si la casilla ya ha sido disparada (si es así, se ignora el clic).
    if (tablero[fila][columna] === aguaDisparada || tablero[fila][columna] === barcoTocado || tablero[fila][columna] === barcoHundido){
        console.warn(`[Disparo] Fila (${fila + 1}), columna (${columna + 1}): casilla ya disparada.`);
        return;
    }

    // Contador incremental de disparos.
    disparosRealizados++;
    
    // Desactiva el botón para que no se pueda disparar dos veces a la misma casilla (si no, un mismo impacto contaría varias veces).
    botonCasilla.disabled = true;

    // Marca del disparo (imagen de agua o de tocado) que se coloca sobre la casilla.
    const marcaDisparo = document.createElement("img");
    marcaDisparo.classList.add("marcaDisparo");

    // Condicional para comprobar si la casilla disparada es agua (libre o bloqueada).
    if (tablero[fila][columna] === aguaLibre || tablero[fila][columna] === aguaBloqueada){
        tablero[fila][columna] = aguaDisparada; /* Marca la matriz con el nuevo estado de la casilla (agua disparada). */
        marcaDisparo.src = "Images/Agua/agua.png";
        marcaDisparo.alt = "Agua";
        casilla.appendChild(marcaDisparo);

        anunciar(`¡Agua! (fila ${fila + 1}, columna ${columna + 1})`, "agua");

        // Registra en la consola el disparo fallido.
        console.log(`[Disparo] Fila (${fila + 1}), columna (${columna + 1}): AGUA.`);

    // Condicional para las casillas ocupadas por un barco.
    } else{
        tablero[fila][columna] = barcoTocado; /* Marca la matriz con el nuevo estado de la casilla (barco tocado). */
        marcaDisparo.src = "Images/Agua/tocado.png";
        marcaDisparo.alt = "Tocado";
        casilla.appendChild(marcaDisparo);

        // Busca el barco al que pertenece la casilla y le suma un impacto.
        const barco = buscarBarcoQueOcupa(barcos, fila, columna);
        barco.impactos++;

        // Condicional para comprobar si el barco ha recibido tantos impactos como casillas ocupa.
        if (barco.impactos === barco.longitud){
            // Bucle para marcar en la matriz todas las casillas del barco como hundidas.
            for (let k = 0; k < barco.casillas.length; k++) tablero[barco.casillas[k][0]][barco.casillas[k][1]] = barcoHundido;

            // Cambia la imagen del barco por la del barco hundido (se mantienen su posición, tamaño y orientación) y la coloca por encima de las marcas de tocado.
            barco.imagen.src = `Images/Barcos/barco(${barco.longitud})Hundido.png`;
            barco.imagen.alt = `Barco de tamaño ${barco.longitud} hundido`;
            barco.imagen.classList.add("hundido");
            barco.imagen.classList.remove("oculto"); /* "remove" es lo contrario de "add", quita la clase. Revela el barco (si estaba oculto) al hundirse. */

            // Contador incremental de barcos hundidos.
            barcosHundidos++;

            // Registra en la consola el barco hundido.
            console.log(`[Disparo] Fila (${fila + 1}), columna (${columna + 1}): ¡HUNDIDO! (barco de tamaño ${barco.longitud}).`);

            // Condicional para comprobar si se han hundido todos los barcos (fin de la partida).
            if (barcosHundidos === barcos.length){
                anunciar(`¡Has hundido toda la flota en ${disparosRealizados} disparos! Fin de la partida.`, "victoria");

                // Bloquea el tablero: ya solo queda agua, no tiene sentido seguir disparando.
                desactivarTablero();

                // Muestra el botón para empezar una partida nueva.
                mostrarBotonReiniciar();

                console.log(`[Partida] Flota hundida en ${disparosRealizados} disparos.`);

            } else anunciar(`¡Tocado y hundido! Barco de tamaño ${barco.longitud}. Quedan ${barcos.length - barcosHundidos} barco(s).`, "hundido");

        // Anuncia y lo registra en la consola el impacto y cuántas casillas le quedan al barco .
        } else{
            anunciar(`¡Tocado! (fila ${fila + 1}, columna ${columna + 1}). Impactos en el barco: ${barco.impactos} de ${barco.longitud}.`, "tocado");

            console.log(`[Disparo] Fila (${fila + 1}), columna (${columna + 1}): TOCADO (${barco.impactos} de ${barco.longitud}).`);
        }
    }

    // Registra en la consola el estado de la matriz tras el disparo (para comprobar que se actualiza).
    console.table(tablero);
}


/**
 * Solicita al usuario la orientación de un barco, y repite la pregunta mientras la respuesta no sea válida y el usuario quiera reintentarlo.
 *     Se devuelve:
 *         "h"    → Si el barco se coloca en horizontal (después se elegirá entre derecha o izquierda).
 *         "v"    → Si el barco se coloca en vertical (después se elegirá entre abajo o arriba).
 *         "null" → Si el usuario cancela o no desea volver a intentarlo.
 */
function solicitarOrientacion(){
    // Bucle controlador de reintentos sobre la solicitud de orientación.
    do{
        // Solicita al usuario la orientación del barco (recolector de respuesta por pantalla).
        let respuesta = prompt("¿Qué orientación tendrá el barco?\n(Opciones: 'H' (Horizontal) / 'V' (Vertical))");

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (respuesta === null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola (como advertencia) que el usuario ha cancelado la solicitud.
            console.warn("[solicitarOrientacion] Solicitud cancelada por el usuario.");

            return null;
        }

        // Normaliza la respuesta eliminando los espacios y convirtiendo las letras a minúsculas (facilitar las comparaciones).
        respuesta = respuesta.toLowerCase().trim();

        // Condicional para determinar la orientación elegida por el usuario.
        switch (respuesta){
            // Condicional para la orientación horizontal (se acepta la inicial o la palabra completa).
            case "h":
            case "horizontal":
                return "h";

            // Condicional para la orientación vertical (se acepta la inicial o la palabra completa).
            case "v":
            case "vertical":
                return "v";

            // Condicional para respuestas no esperadas por el sistema.
            default:
                // Muestreo de un mensaje de error indicando que la respuesta no es válida.
                alert("ERROR: La respuesta introducida no es válida.\n(Recuerde que debe responder 'H' para indicar una orientación horizontal o 'V' para una orientación vertical)");

                // Registra en la consola (como advertencia) la respuesta rechazada.
                console.warn(`[solicitarOrientacion] Respuesta rechazada (se esperaba 'H' o 'V'): "${respuesta}".`);

                // Si el usuario no desea volver a intentarlo (o cancela), se finaliza la solicitud.
                if (!solicitarReintento()) return null;

                // Finaliza la ejecución del bloque "switch".
                break;
        }

    // Repite la solicitud hasta recibir una respuesta válida o hasta que el usuario decida no reintentarlo.
    } while (true);
}


/**
 * Solicita al usuario la dirección hacia la que se extiende un barco desde su casilla inicial, ofreciendo únicamente las direcciones compatibles con la orientación elegida. Repite la pregunta mientras la respuesta no sea válida y el usuario quiera reintentarlo.
 *     Parámetros (orientacion):
 *             → "h" (horizontal)
 *             → "v" (vertical).
 *     Se devuelve:
 *         "derecha" o "izquierda" → Si la orientación es horizontal.
 *         "abajo" o "arriba"      → Si la orientación es vertical.
 *         "null"                  → Si el usuario cancela o no desea volver a intentarlo.
 */
function solicitarDireccion(orientacion){
    // Direcciones permitidas según la orientación elegida (un barco horizontal no puede extenderse hacia arriba o abajo, ni uno vertical hacia los lados).
    const direccionesPermitidas = (orientacion === "h") ? ["derecha", "izquierda"] : ["abajo", "arriba"];

    // Bucle controlador de reintentos sobre la solicitud de dirección.
    do{
        // Solicita al usuario la dirección del barco (recolector de respuesta por pantalla).
        let respuesta = prompt(`¿Hacia dónde se extiende el barco desde la casilla inicial?\n('${direccionesPermitidas[0]}' o '${direccionesPermitidas[1]}')`);

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (respuesta === null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola (como advertencia) que el usuario ha cancelado la solicitud.
            console.warn("[solicitarDireccion] Solicitud cancelada por el usuario.");

            return null;
        }

        // Normaliza la respuesta eliminando los espacios y convirtiendo las letras a minúsculas (facilitar las comparaciones).
        respuesta = respuesta.toLowerCase().trim();

        // Condicional para comprobar si la respuesta es una de las direcciones permitidas.
        if (direccionesPermitidas.includes(respuesta)){ /* "includes()" recorre el array y devuelve "true" si encuentra en él el valor indicado. */
            return respuesta;

        // Condicional para respuestas no válidas o incompatibles con la orientación elegida.
        } else{
            // Muestreo de un mensaje de error indicando las direcciones permitidas.
            alert(`ERROR: La respuesta introducida no es válida. Recuerde que debe responder con '${direccionesPermitidas[0]}' o '${direccionesPermitidas[1]}'.`);

            // Registra en la consola (como advertencia) la respuesta rechazada y las direcciones que se esperaban.
            console.warn(`[solicitarDireccion] Respuesta rechazada (se esperaba '${direccionesPermitidas[0]}' o '${direccionesPermitidas[1]}'): "${respuesta}".`);

            // Si el usuario no desea volver a intentarlo (o cancela), se finaliza la solicitud.
            if (!solicitarReintento()) return null;
        }

    // Repite la solicitud hasta recibir una respuesta válida o hasta que el usuario decida no reintentarlo.
    } while (true);
}


/**
 * Calcula las coordenadas de todas las casillas que ocuparía un barco a partir de su casilla inicial, su tamaño y su dirección.
 *     Parámetros:
 *         fila      → Índice de la fila de la casilla inicial (empieza en 0).
 *         columna   → Índice de la columna de la casilla inicial (empieza en 0).
 *         longitud  → Tamaño del barco (número de casillas que ocupa).
 *         direccion → "derecha", "izquierda", "abajo" o "arriba".
 *     Se devuelve:
 *         Array de coordenadas → Cada posición es un array [fila, columna] de una casilla del barco.
 */
function calcularCasillasBarco(fila, columna, longitud, direccion){
    // Array donde se almacenan las coordenadas de cada casilla del barco.
    const casillas = [];

    // Desplazamiento que se aplica a la fila y a la columna por cada casilla del barco (se inicializan sin movimiento).
    let desplazamientoFila = 0, desplazamientoColumna = 0;
    
    // Condicional para determinar el desplazamiento según la dirección elegida.
    switch (direccion){
        // Avanza una columna por casilla.
        case "derecha":
            desplazamientoColumna = 1;
            break;

        // Retrocede una columna por casilla.
        case "izquierda":
            desplazamientoColumna = -1;
            break;

        // Avanza una fila por casilla.
        case "abajo":
            desplazamientoFila = 1;
            break;

        // Retrocede una fila por casilla.
        case "arriba":
            desplazamientoFila = -1;
            break;
    }

    // Bucle para recorrer cada una de las casillas que ocupa el barco.
    for (let k = 0; k < longitud; k++){
        // Guarda las coordenadas de la casilla actual (la casilla inicial, k = 0, no se desplaza).
        casillas.push([fila + k * desplazamientoFila, columna + k * desplazamientoColumna]);
    }

    return casillas;
}


/**
 * Comprueba si un barco puede colocarse en las casillas indicadas.
 *     Parámetros:
 *         tablero  → Matriz (array bidimensional) que representa el campo de batalla.
 *         casillas → Array de coordenadas [fila, columna] que ocuparía el barco.
 *     Se devuelve:
 *         "true"  → Si todas las casillas existen dentro del tablero y son agua libre.
 *         "false" → Si alguna casilla se sale del tablero, pisa otro barco o está junto a uno (agua bloqueada).
 */
function comprobarPosicion(tablero, casillas){
    // Bucle para recorrer cada una de las casillas que ocuparía el barco.
    for (let k = 0; k < casillas.length; k++){
        // Extrae la fila y la columna de la casilla actual.
        const filaCasilla = casillas[k][0];
        const columnaCasilla = casillas[k][1];

        /**
         * Condicional para comprobar/verificar si la casilla actual impide la colocación.
         *     La primera y segunda condición comprueban si la fila se sale del tablero (por arriba o por abajo).
         *     La tercera y cuarta condición comprueban si la columna se sale del tablero (por la izquierda o por la derecha).
         *     La quinta condición comprueba si la casilla no es agua libre (es un barco o agua bloqueada).
         */
        if (filaCasilla < 0 || filaCasilla >= tablero.length || columnaCasilla < 0 || columnaCasilla >= tablero[filaCasilla].length || tablero[filaCasilla][columnaCasilla] !== aguaLibre) return false;
    }

    // Si ninguna casilla ha impedido la colocación, la posición es válida.
    return true;
}


/**
 * Coloca un barco en la matriz y bloquea las casillas de agua que lo rodean.
 *     Parámetros:
 *         tablero  → Matriz (array bidimensional) que representa el campo de batalla.
 *         casillas → Array de coordenadas [fila, columna] que ocupa el barco (previamente comprobadas).
 *         longitud → Tamaño del barco (valor que se almacena en cada una de sus casillas).
 */
function colocarBarco(tablero, casillas, longitud){
    // Bucle para escribir el barco en cada una de sus casillas.
    for (let k = 0; k < casillas.length; k++) tablero[casillas[k][0]][casillas[k][1]] = longitud;

    // Bucle para bloquear el agua alrededor de cada casilla del barco ("aguaBloqueada").
        // La llamada a la función "bloquearAlrededor" se hace después de escribir el barco, para así no sobreescribir una de sus propias casillas.
    for (let k = 0; k < casillas.length; k++) bloquearAlrededor(tablero, casillas[k][0], casillas[k][1]); 
}


/**
 * Solicita al usuario la posición, orientación y dirección de un barco, y lo coloca si la posición es válida. Repite la solicitud mientras la posición no sea válida y el usuario quiera reintentarlo.
 *     Parámetros:
 *         tablero      → Matriz (array bidimensional) que representa el campo de batalla.
 *         longitud     → Tamaño del barco a colocar.
 *         numeroBarco  → Número del barco actual dentro de los de su tamaño (empieza en 1).
 *         totalBarcos  → Cantidad total de barcos de ese tamaño.
 *     Se devuelve:
 *         "true" → Si el barco se ha colocado correctamente.
 *         "null" → Si el usuario cancela o no desea volver a intentarlo.
 */
function solicitarColocacionBarco(tablero, longitud, numeroBarco, totalBarcos){
    // Identificación del barco actual (se usa en las preguntas y en los registros de la consola).
    const identificacionBarco = `barco de tamaño ${longitud} (${numeroBarco} de ${totalBarcos})`;

    // Bucle controlador de reintentos sobre la colocación del barco.
    do{
        // Solicitud de la fila inicial del barco.
        const fila = solicitarCantidad(`¿En qué fila empieza el ${identificacionBarco}?\n(Se solicita un número entero comprendido entre 1 y ${tablero.length}, ambos incluidos)`, 1, tablero.length);

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (fila === null) return null;

        // Solicitud de la columna inicial del barco.
        const columna = solicitarCantidad(`¿En qué columna empieza el ${identificacionBarco}?\n(Se solicita un número entero comprendido entre 1 y ${tablero[0].length}, ambos incluidos)`, 1, tablero[0].length);

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (columna === null) return null;

        // Orientación y dirección del barco (por defecto horizontal y hacia la derecha: en los barcos de tamaño 1 son indiferentes, ya que solo ocupan una casilla).
            // Se declaran fuera del condicional para que sigan existiendo después de él (las variables "let" y "const" únicamente existen dentro del bloque { } donde se declaran).
        let orientacion = "h", direccion = "derecha";

        // Condicional para solicitar la orientación y la dirección únicamente a los barcos que ocupan más de una casilla.
        if (longitud > 1){
            // Solicitud de la orientación del barco.
            orientacion = solicitarOrientacion();

            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (orientacion === null) return null;

            // Solicitud de la dirección del barco (únicamente entre las compatibles con la orientación elegida).
            direccion = solicitarDireccion(orientacion);

            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (direccion === null) return null;
        }

        // Calcula las casillas que ocuparía el barco.
        const casillas = calcularCasillasBarco(fila - 1, columna - 1, longitud, direccion); /* Se resta 1 a la fila y la columna para convertir la numeración del usuario, desde 1, a la de los arrays, desde 0. */

        // Condicional para comprobar si el barco puede colocarse en las casillas calculadas.
        if (comprobarPosicion(tablero, casillas)){
            // Coloca el barco y bloquea el agua que lo rodea.
            colocarBarco(tablero, casillas, longitud);

            // Casilla ancla del barco (la situada más arriba a la izquierda): si el barco se extiende hacia la izquierda o hacia arriba, es la última casilla calculada; si no, la primera.
            const casillaAncla = (direccion === "izquierda" || direccion === "arriba") ? casillas[casillas.length - 1] : casillas[0];

            // Guarda los datos del barco para pintar su imagen y, durante la partida, controlar sus impactos.
            barcosColocados.push({ fila: casillaAncla[0], columna: casillaAncla[1], longitud: longitud, orientacion: orientacion, casillas: casillas, impactos: 0, imagen: null });

            // Registra en la consola la colocación del barco.
            console.log(`[Colocación] Colocado el ${identificacionBarco} en fila (${fila}), columna (${columna}), orientación "${orientacion}" y dirección "${direccion}".`);

            return true;

        // Condicional para posiciones no válidas.
        } else{
            // Muestreo de un mensaje de error indicando que el barco no puede colocarse en la posición indicada.
            alert("ERROR: El barco no puede colocarse en esa posición del tablero. Se sale del tablero, pisa otro barco o queda junto a uno (incluidas las diagonales).");

            // Registra en la consola (como advertencia) la posición rechazada.
            console.warn(`[Colocación] Posición rechazada para el ${identificacionBarco} en fila (${fila}), columna (${columna}), orientación "${orientacion}" y dirección "${direccion}".`);

            // Si el usuario no desea volver a intentarlo (o cancela), se finaliza la solicitud.
            if (!solicitarReintento()) return null;
        }

    // Repite la solicitud hasta colocar el barco o hasta que el usuario decida no reintentarlo.
    } while (true);
}


/**
 * Recorre todos los tamaños de barco y solicita la colocación de cada uno de ellos.
 *     Parámetros:
 *         tablero → Matriz (array bidimensional) que representa el campo de batalla.
 *     Se devuelve:
 *         "true"  → Si se ha colocado la flota completa.
 *         "false" → Si el usuario ha cancelado la colocación en algún momento.
 */
function colocarFlota(tablero){
    // Bucle para recorrer cada uno de los tamaños de barco (se empieza por el mayor, ya que los barcos grandes son más difíciles de encajar con el tablero lleno).
    for (let i = longitudBarcos.length - 1; i >= 0; i--){
        // Bucle para recorrer cada uno de los barcos del tamaño actual.
        for (let k = 0; k < cantidadBarcos[i]; k++){
            // Condicional para comprobar si el usuario ha cancelado la colocación del barco actual.
            if (solicitarColocacionBarco(tablero, longitudBarcos[i], k + 1, cantidadBarcos[i]) === null) return false;
        }
    }

    return true;
}


// <========== Main ==========>

// Bucle controlador de reintentos (se fuerza a que su contenido se ejecute mínimo una vez desde el arranque/inicio del programa).
do{
    // Estructura de control de flujo para la captura de posibles excepciones y errores de ejecución que se produzcan mientras el programa está arrancado.
    try{
        // Reseteo, vacía el tablero para que no se mezcle con el de una ejecución anterior.
        tablero.length = 0;

        // Reseteo, vacía la cantidad de barcos para que no se mezcle con la de una ejecución anterior.
        cantidadBarcos.length = 0;

        // Reseteo, vacía los barcos colocados para que no se mezclen con los de una ejecución anterior.
        barcosColocados.length = 0;

        // Reseteo de los contadores de la partida.
        barcosHundidos = 0;
        disparosRealizados = 0;

        alert("Inicializando el juego.\nDetalle los datos de las siguientes instrucciones que se le soliciten.\nMapeando el campo de batalla...");


        // <========== Filas ==========>
        
        // Solicitud del número de filas.
        nFilas = solicitarCantidad(`¿Cuántas filas tendrá?\n(Se solicita un número entero positivo comprendido entre ${dimensionMinima} y ${dimensionMaxima}, ambos incluidos)`, dimensionMinima, dimensionMaxima);

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (nFilas === null){
            // Detiene la repetición del programa.
            repetirEjecucion = false;

            // Finaliza la ejecución del bucle "do-while" que controla la repetición del programa.
            break;
        }

        // Registra en la consola la cantidad de filas introducidas.
        console.log(`[Filas] Número de filas establecido: ${nFilas}`);


        // <========== Columnas ==========>

        // Solicitud del número de columnas.
        nColumnas = solicitarCantidad(`¿Cuántas columnas tendrá?\n(Se solicita un número entero positivo comprendido entre ${dimensionMinima} y ${dimensionMaxima}, ambos incluidos)`, dimensionMinima, dimensionMaxima);

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (nColumnas === null){
            // Detiene la repetición del programa.
            repetirEjecucion = false;

            // Finaliza la ejecución del bucle "do-while" que controla la repetición del programa.
            break;
        }

        // Registra en la consola la cantidad de columnas introducidas.
        console.log(`[Columnas] Número de columnas establecido: ${nColumnas}`);


        // <========== Matriz auxiliar ==========>

        // Bucle para recorrer cada una de las filas del tablero.
        for (let i = 0; i < nFilas; i++){
            // Crea una fila vacía (array) dentro del tablero.
            tablero.push([]);

            // Bucle para recorrer cada una de las columnas de la fila actual.
            for (let j = 0; j < nColumnas; j++){
                // Inicializa la casilla con agua (0).
                tablero[i].push(aguaLibre);
            }
        }

        // Registra en la consola el tablero inicializado (en formato tabla).
        console.log(`[Matriz] Tablero inicializado con agua (${nFilas} filas x ${nColumnas} columnas):`);
        console.table(tablero);


        // <========== Tablero ==========>
        
        // Calcula el número de casillas totales dentro del tablero.
        nCasillas = nFilas * nColumnas;

        alert(`Dadas las directrices, el campo de batalla se compondrá de un total de ${nCasillas} casillas/posiciones.`);

        // Registra en la consola el número total de casillas calculado.
        console.log(`[Tablero] Casillas totales: ${nCasillas}`);


        // <========== Barcos ==========>
        
        // Calcula las casillas que ocuparán los barcos (un tercio aproximado del tablero, redondeando hacia abajo para no superar dicho tercio).
        casillasConBarcos = Math.floor(nCasillas / 3); /* "Math.floor" elimina la parte decimal del resultado de la división (redondea siempre hacia abajo). */

        // Calcula las casillas que corresponden a cada tamaño de barco (se reparten a partes iguales entre todos los tamaños existentes).
        casillasPorLongitud = Math.floor(casillasConBarcos / longitudBarcos.length);

        // Registra en la consola las casillas con barcos y las casillas por tamaño.
        console.log(`[Barcos] Casillas destinadas a barcos: ${casillasConBarcos} (un tercio de ${nCasillas}). Casillas por tamaño: ${casillasPorLongitud}`);

        // Mensaje resumen con la cantidad de barcos de cada tamaño (se completa dentro del bucle).
        let resumenBarcos = "Campo de batalla cargado. Distribuyendo la flota... ";

        // Bucle para recorrer cada uno de los tamaños de barco.
        for (let i = 0; i < longitudBarcos.length; i++){
            // Calcula cuántos barcos del tamaño actual caben en las casillas asignadas (redondeando hacia abajo, ya que no pueden existir barcos incompletos).
            cantidadBarcos.push(Math.floor(casillasPorLongitud / longitudBarcos[i]));

            // Añade al resumen la cantidad de barcos del tamaño actual.
            resumenBarcos += `\n\t- Barcos de tamaño ${longitudBarcos[i]}: ${cantidadBarcos[i]}`;

            // Registra en la consola la cantidad de barcos del tamaño actual y las casillas que ocupan.
            console.log(`[Barcos] Tamaño ${longitudBarcos[i]}: ${cantidadBarcos[i]} barco(s), ocupando ${cantidadBarcos[i] * longitudBarcos[i]} casilla(s)`);

            // Condicional para comprobar si no hay espacio suficiente para ningún barco del tamaño actual.
            if (cantidadBarcos[i] === 0){
                // Añade al resumen el aviso de falta de espacio.
                resumenBarcos += `\n\nADVERTENCIA: No hay espacio suficiente para ningún barco de tamaño ${longitudBarcos[i]}.`;

                // Registra en la consola (como advertencia) la falta de espacio para el tamaño actual.
                console.warn(`[Barcos] Sin espacio para barcos de tamaño ${longitudBarcos[i]} en un tablero de ${nCasillas} casillas.`);
            }
        }
        
        // Muestreo de un mensaje informativo con la distribución de la flota.
        alert(resumenBarcos);

        // Registra en la consola la cantidad de barcos de cada tamaño.
        console.log("[Barcos] Distribución final (cantidadBarcos):", cantidadBarcos);
        

        // <========== Colocación ==========>

        // Muestreo de un mensaje informativo indicando el inicio de la colocación de la flota.
        alert("Proceda a colocar la flota.\nIndique la casilla inicial de cada barco y, después, su orientación y la dirección hacia la que se extiende.");

        // Condicional para comprobar si el usuario ha cancelado la colocación de la flota.
        if (!colocarFlota(tablero)){
            // Detiene la repetición del programa.
            repetirEjecucion = false;

            // Finaliza la ejecución del bucle "do-while" que controla la repetición del programa.
            break;
        }

        // Registra en la consola el estado final de la matriz, con los barcos colocados y el agua bloqueada.
        console.log("[Colocación] Flota completa. Estado final del tablero:");
        console.table(tablero);

        // Registra en la consola los barcos colocados (casilla ancla, longitud y orientación de cada uno).
        console.log("[Colocación] Barcos colocados (barcosColocados):", barcosColocados);


        // <========== Tablero final ==========>

        // Pinta en la página el tablero final, con cada barco en su posición.
        pintarTablero(tablero, barcosColocados);


    // Captura de posibles excepciones/errores de tipo genérico, "error", que ocurran/se produzcan durante el proceso de ejecución del programa (se lanza cuando se produce un fallo que no ha sido controlado previamente por el código, bajo las condiciones establecidas por el programa).
    } catch (error){
        // Muestreo por pantalla de un mensaje de error al usuario indicando que se ha producido un fallo durante la ejecución del programa.
        alert("ERROR: Se ha producido un fallo durante la ejecución del programa: " + error.message);

        // Muestreo por consola de un mensaje de error indicando que se ha producido un fallo durante la ejecución del programa.
        console.error("ERROR: Se ha producido un fallo inesperado (no controlado) durante la ejecución del programa:", error);

        // Finaliza/Detiene la posibilidad de volver a ejecutar el programa después de producirse una excepción.
        repetirEjecucion = false;
    }

// Comprueba si el usuario ha solicitado volver a ejecutar el programa.
} while (repetirEjecucion === true);