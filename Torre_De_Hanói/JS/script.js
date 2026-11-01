// Activa el modo estricto: evita errores graves obligándote a declarar todas tus variables y prohibiendo malas prácticas.
"use strict";


// <========== Variables ==========>

// Número de discos de la partida (la torre tendrá tantas celdas de alto como discos).
const nDiscos = 5;

// Número de torres del juego.
const nTorres = 3;

// Colores de los discos, del más pequeño (posición 0) al más grande (array paralelo al tamaño de los discos: el disco de tamaño 1 usa "coloresDiscos[0]").
//const coloresDiscos = ["red", "orange", "green", "blue", "purple"];
//const coloresDiscos = ["#E63946", "#F4A261", "#2A9D8F", "#457B9D", "#7B2CBF"];
const coloresDiscos = ["#FF5E6C", "#FF9F43", "#FFD84D", "#4CD3A0", "#4DA8F0"];

// Clave con la que se guarda el mejor tiempo en el "localStorage" del navegador.
const claveMejorTiempo = "torreHanoiMejorTiempo";

// Clave con la que se guarda la partida en curso en el "localStorage" del navegador (botones "Guardar" y "Restaurar").
const clavePartidaGuardada = "torreHanoiPartidaGuardada";

// Objetos del juego, reúne todas las propiedades de la partida.
    /**
     * Propiedades:
     *     - torres             → Array auxiliar que controla el orden de los discos. Contiene un array por torre; cada uno guarda los tamaños de sus discos de ABAJO (posición 0) a ARRIBA (última posición). Ejemplo al empezar con 5 discos: "[[5, 4, 3, 2, 1], [], []]"; todos en la primera torre, el 5 (el disco más grande) abajo y el 1 (el disco más pequeño) arriba.
     *     - movimientos        → Número de movimientos realizados.
     *     - jugador            → Nombre del jugador (necesario para guardar la partida).
     *     - partidaIniciada    → Tiene como valor base/predeterminado "false" hasta pulsar el botón "INICIO", de esta forma nos aseguraremos de que el usuario no pueda mover los discos  antes de iniciar la partida.
     *     - torreSeleccionada  → Índice de la torre cuyo disco de arriba se ha seleccionado para mover. Tiene como valor base/predeterminado "null" para asegurar que no se haya seleccionado ningún disco sin que el usuario lo haya hecho antes.
     *     - inicioPartida      → Objeto de tiempo ("Date") con la fecha y hora exactas en que empezó la partida.
     *     - segundos           → Segundos transcurridos desde el inicio de la partida.
     *     - temporizador       → Identificador del "setInterval" del reloj (necesario para detenerlo con "clearInterval"). Tiene "null" como valor predeterminado si el reloj está parado.
     */
const torresHanoi = {
    torres: [],
    movimientos: 0,
    jugador: "",
    partidaIniciada: false,
    torreSeleccionada: null,
    inicioPartida: null,
    segundos: 0,
    temporizador: null
};


/**
 * Coloca todos los discos en la primera torre, ordenados por tamaño (el más grande abajo), y deja vacías las demás.
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 *             "prepararTorres(torresHanoi)" Funcionaría igual, pero así la función no depende del nombre de la variable de fuera.
 */
function prepararTorres(juego){
    // Reseteo, vacía las torres para que no se mezclen con las de una partida anterior.
    juego.torres.length = 0;

    // Bucle para crear un array vacío por cada torre.
    for (let i = 0; i < nTorres; i++) juego.torres.push([]);

    // Bucle para colocar los discos en la primera torre, del más grande (abajo, se añade primero) al más pequeño (arriba, se añade el último).
    for (let tamano = nDiscos; tamano >= 1; tamano--) juego.torres[0].push(tamano);

    console.log("[prepararTorres] Estado inicial de las torres:", juego.torres);
}


// Crea con el DOM toda la página del juego: [marcadores, ventana de mensajes, panel de control y las torres con sus celdas (vacías; los discos se pintan aparte con la función "pintarDiscos")].
function pintarJuego(){
    // Título del juego (se inserta dentro del "<header>" del HTML).
    const titulo = document.createElement("h1"); /* Crea una etiqueta HTML de tipo encabezado "<h1>". */
    titulo.textContent = "Torre de Hanói"; /* Sobrescribe/Actualiza el valor o contenido de la etiqueta a la que corresponde. */
    document.querySelector("header").appendChild(titulo); /* Añade la etiqueta creada como contenido de la etiqueta correspondiente. */

    // Contenedor de la página donde se insertará el juego (etiqueta "<main>" del HTML).
    const contenedor = document.querySelector("main"); /* Busca en la página web la etiqueta "<main>" y la guarda en la variable contenedor. */


    // <========== Panel de control ==========>

    const panel = document.createElement("section");
    panel.classList.add("panel");

    // Campo para el nombre del jugador (necesario para guardar la partida).
    const campoJugador = document.createElement("input");
    campoJugador.type = "text";
    campoJugador.id = "nombreJugador";
    campoJugador.maxLength = 25;
    campoJugador.placeholder = "Nombre del jugador";
    panel.appendChild(campoJugador);

    // Botones del juego. Cada uno con su identificador para asignarle su evento correspondiente.
    const textosBotones = ["INICIO", "Guardar", "Restaurar"];
    const idsBotones = ["botonInicio", "botonGuardar", "botonRestaurar"]; /* Array paralelo a "textosBotones" almacena los ID's de cada uno de los botones. */

    // Bucle para crear cada uno de los botones.
    for (let i = 0; i < textosBotones.length; i++){
        const boton = document.createElement("button");
        boton.type = "button";
        boton.id = idsBotones[i];
        boton.textContent = textosBotones[i];
        panel.appendChild(boton);
    }

    contenedor.appendChild(panel);


    // <========== Marcadores ==========>

    const marcadores = document.createElement("section");
    marcadores.classList.add("marcadores");

    // Textos de cada marcador, el identificador de su valor correspondiente y el valor inicial (arrays paralelos).
    const textosMarcadores = ["Movimientos: ", "Tiempo de partida: ", "Mejor tiempo: "];
    const idsMarcadores = ["movimientos", "tiempoPartida", "mejorTiempo"];
    const valoresIniciales = ["0", "00:00", "--:--"];

    // Bucle para crear cada uno de los marcadores (un párrafo con el texto y un "<span>" con el valor de dicho texto).
    for (let i = 0; i < textosMarcadores.length; i++){
        const parrafo = document.createElement("p");
        parrafo.textContent = textosMarcadores[i];

        const valor = document.createElement("span");
        valor.id = idsMarcadores[i];
        valor.textContent = valoresIniciales[i];

        parrafo.appendChild(valor);
        marcadores.appendChild(parrafo);
    }

    contenedor.appendChild(marcadores);


    // <========== Mensajes ==========>

    // Ventana de mensajes del juego.
    const mensajeJuego = document.createElement("p");
    mensajeJuego.id = "mensajeJuego"; /* Identificador único, para encontrarlo después desde otras funciones con "querySelector("#mensajeJuego")". */
    mensajeJuego.classList.add("mensaje");
    mensajeJuego.textContent = `Escribe tu nombre en el campo superior y pulsa sobre el botón "INICIO" para comenzar la partida.`;
    contenedor.appendChild(mensajeJuego);


    // <========== Torres ==========>

    const tablero = document.createElement("section");
    tablero.classList.add("tablero");

    // Bucle para crear cada una de las torres.
    for (let i = 0; i < nTorres; i++){
        const torre = document.createElement("div");
        torre.classList.add("torre");
        torre.id = `torre${i + 1}`;

        // Bucle para crear las celdas de la torre [de arriba (celda 1) a abajo (celda "nDiscos")].
        for (let j = 1; j <= nDiscos; j++){
            const celda = document.createElement("div");
            celda.classList.add("celda");
            celda.id = `t${i + 1}c${j}`;
            torre.appendChild(celda);
        }

        tablero.appendChild(torre);
    }

    contenedor.appendChild(tablero);
}


/**
 * Crea un disco a partir de una división, "<div>", cuyo ancho y color dependen de su tamaño.
 *     Parámetros:
 *         tamano → Tamaño del disco [de 1 (el más pequeño), a "nDiscos" (el más grande)].
 *     Se devuelve:
 *         El elemento "<div>" del disco, listo para meterlo en una celda.
 */
function crearDisco(tamano){
    const disco = document.createElement("div");
    disco.classList.add("disco");
    disco.id = `disco${tamano}`;

    // Ancho del disco en porcentaje de la celda: el más pequeño ocupa un 30% y cada tamaño siguiente un 15% más grande (30, 45, 60, 75, 90).
    disco.style.width = `${30 + (tamano - 1) * 15}%`;

    // Color del disco, tomado del array "coloresDiscos" (posición = tamaño - 1).
    disco.style.backgroundColor = coloresDiscos[tamano - 1];

    return disco;
}


/**
 * Pinta los discos en las celdas según el array auxiliar de las torres. Primero vacía todas las celdas y después coloca cada disco en la suya.
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 */
function pintarDiscos(juego){
    const celdas = document.querySelectorAll(".celda"); /* Busca todas las celdas de la página. */

    // Bucle para vaciar cada celda.
    for (let i = 0; i < celdas.length; i++) celdas[i].replaceChildren(); /* Elimina/Vacía todo el contenido de la etiqueta).*/

    // Bucle para recorrer cada una de las torres.
    for (let i = 0; i < juego.torres.length; i++){
        // Bucle para recorrer los discos de la torre actual, de abajo (posición 0) a arriba.
        for (let posicion = 0; posicion < juego.torres[i].length; posicion++){
            /**
             * Calcula en qué celda va el disco. Las celdas se numeran de arriba (1) a abajo ("nDiscos"), pero el array guarda los discos de abajo (0) a arriba:
             *     El disco de la posición 0 (abajo del todo) va en la última celda ("nDiscos").
             *     El de la posición 1 va en la penúltima ("nDiscos - 1"), y así sucesivamente.
             */
            const numeroCelda = nDiscos - posicion;

            const celda = document.querySelector(`#t${i + 1}c${numeroCelda}`);
            celda.appendChild(crearDisco(juego.torres[i][posicion]));
        }
    }
}


/**
 * Muestra un mensaje en la ventana de mensajes del juego.
 *     Parámetros:
 *         texto → Mensaje que se muestra al jugador.
 *         tipo  → Define la clase (para CSS) según el tipo de mensaje: "info" (normal), "aviso" (movimiento no permitido) o "error" (dato no válido).
 */
function anunciar(texto, tipo = "info"){
    // Busca la ventana de mensajes en la página.
    const mensajeJuego = document.querySelector("#mensajeJuego");

    mensajeJuego.textContent = texto;

    mensajeJuego.className = `mensaje ${tipo}`; /* Sustituye todas las clases de la ventana por "mensaje" y la del tipo actual. */
}


/**
 * Actualiza en la página el marcador de movimientos con el valor del objeto del juego.
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 */
function actualizarMovimientos(juego){ document.querySelector("#movimientos").textContent = juego.movimientos; }


/**
 * Empieza una partida nueva al pulsar el botón "INICIO". Al pulsar se comprobará el nombre del jugador, se colocarán los discos en la primera torre y reiniciarán los contadores.
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 */
function iniciarPartida(juego){
    // Nombre escrito por el jugador. Valor normalizado (sin los espacios del principio y del final).
    const nombre = document.querySelector("#nombreJugador").value.trim();

    /**
     * Condicional para comprobar/verificar que el nombre sea válido.
     *     Se permiten letras (también acentuadas, con diéresis y la "ñ"), números y espacios, entre 2 y 25 caracteres.
     *     El modificador "i" hace que no se distinga entre mayúsculas y minúsculas.
     */
    if (!/^[a-záéíóúüñ0-9 ]{2,25}$/i.test(nombre)){
        anunciar("ERROR: Escribe un nombre válido (solo letras, números y espacios, mínimo 2 y máximo 25 caracteres) antes de pulsar el botón \"INICIO\".", "error");

        console.warn(`[iniciarPartida] Nombre rechazado: "${nombre}".`);

        return;
    }

    // Reseteo de las propiedades de la partida.
    juego.jugador = nombre;
    juego.movimientos = 0;
    juego.torreSeleccionada = null;
    juego.partidaIniciada = true;

    // Coloca los discos en la primera torre, los pinta, pone a cero el marcador y pone el reloj a cero y lo arranca.
    prepararTorres(juego);
    pintarDiscos(juego);
    actualizarMovimientos(juego);
    iniciarReloj(juego);

    anunciar(`¡Adelante, ${nombre}! Lleva todos los discos de la primera torre (1) a la última torre (${nTorres}): haz clic en el disco de arriba de una torre y después en la torre de destino.`);

    console.log(`[iniciarPartida] Partida iniciada por "${nombre}".`);
}


/**
 * Mueve el disco de arriba de una torre a otra, si las reglas del juego lo permiten.
 *     Parámetros:
 *         juego   → Objeto del juego ("torresHanoi").
 *         origen  → Índice de la torre de la que sale el disco (empieza en 0).
 *         destino → Índice de la torre a la que va el disco (empieza en 0).
 *     Se devuelve:
 *         "true"  → Si el disco se ha movido.
 *         "false" → Si el movimiento no está permitido (el disco de destino es más pequeño).
 */
function moverDisco(juego, origen, destino){
    // Disco de arriba de cada torre (el último elemento de su array). Devuelve "undefined" si la torre está vacía.
    const discoOrigen = juego.torres[origen][juego.torres[origen].length - 1];
    const discoDestino = juego.torres[destino][juego.torres[destino].length - 1];

    // Condicional para comprobar la regla del juego: no se puede colocar un disco encima de otro más pequeño.
    if (discoDestino !== undefined && discoOrigen > discoDestino){
        console.warn(`[moverDisco] Movimiento no permitido (no se puede colocar un disco encima de otro más pequeño): disco ${discoOrigen} sobre disco ${discoDestino}.`);

        return false;
    }

    // Saca el disco de arriba de la torre de origen ("pop") y lo coloca arriba de la torre de destino ("push").
    juego.torres[destino].push(juego.torres[origen].pop());

    console.log(`[moverDisco] Disco ${discoOrigen}: torre ${origen + 1} → torre ${destino + 1}.`, juego.torres);

    return true;
}


/**
 * Convierte un número de segundos en un texto con el formato "mm:ss" [minutos y segundos (siempre con dos cifras)].
 *     Parámetros:
 *         segundosTotales → Número de segundos a convertir.
 *     Se devuelve:
 *         El texto con el tiempo (ejemplo: 75 segundos → "01:15").
 */
function formatearTiempo(segundosTotales){
    // Minutos completos (se divide entre 60, "/") y segundos sobrantes (resto de la división de 60, "%").
    const minutos = Math.floor(segundosTotales / 60); /* "Math.floor" Elimina la parte decimal. */
    const segundos = segundosTotales % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`; /* "padStart(2, "0")" Rellena con un cero por la izquierda si el número tiene una sola cifra. Ejemplo: 5 → "05". */
}


/**
 * Calcula los segundos transcurridos desde el inicio de la partida y los muestra en el marcador (se ejecuta cada segundo desde "iniciarReloj").
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 */
function actualizarReloj(juego){
    // Resta dos fechas ("ahora", menos la fecha de inicio) y después divide la diferencia (obtenida de la resta) en milisegundos (se divide entre 1000 para pasarla a segundos).
    juego.segundos = Math.floor((new Date() - juego.inicioPartida) / 1000); /* "new Date()" Equivale a decir: "ahora". */

    document.querySelector("#tiempoPartida").textContent = formatearTiempo(juego.segundos);
}


/**
 * Arranca el reloj de la partida. Al arrancar se guardará la fecha y hora de inicio y actualizará el marcador por cada segundo que transcurra.
 *     Parámetros:
 *         juego                → Objeto del juego ("torresHanoi").
 *         segundosIniciales    → Segundos desde los que empieza a contar (0 en una partida nueva; el tiempo guardado al restaurar una partida). Si no se indica, vale 0.
 */
function iniciarReloj(juego, segundosIniciales = 0){
    // Detiene el reloj anterior.
    detenerReloj(juego);

    // Objeto de tiempo. Obtiene la fecha y hora exactas del momento en que se guardó la partida. Se obtiene de restar la Fecha y hora de inicio ("ahora") menos los segundos iniciales (pasados a milisegundos). En una partida nueva es exactamente "ahora"; al restaurar, es como si la partida hubiera empezado hace ese tiempo.
    juego.inicioPartida = new Date(new Date() - segundosIniciales * 1000);

    // Muestra el tiempo inicial sin esperar al primer segundo.
    actualizarReloj(juego);

    // Temporizador que llama y ejecuta la función "actualizarReloj" cada 1000 milisegundos (1 segundo). Se guarda su identificador para poder detenerlo después con "clearInterval".
    juego.temporizador = setInterval(function(){ actualizarReloj(juego); }, 1000);
}


/**
 * Detiene el reloj de la partida (si está en marcha).
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 */
function detenerReloj(juego){
    // Condicional para comprobar si hay un temporizador en marcha.
    if (juego.temporizador !== null){
        clearInterval(juego.temporizador);
        juego.temporizador = null;
    }
}


/**
 * Gestiona el clic sobre una torre (en cualquiera de sus celdas o en uno de sus discos). El primer clic selecciona el disco de arriba; el segundo indica la torre de destino.
 *     Parámetros:
 *         juego  → Objeto del juego ("torresHanoi").
 *         indice → Índice de la torre pulsada (empieza en 0).
 *         evento → Objeto del evento de clic (su propiedad "target" es el elemento exacto que se ha pulsado: el disco o la celda).
 */
function pulsarTorre(juego, indice, evento){
    // Condicional para impedir mover discos antes de pulsar "INICIO".
    if (!juego.partidaIniciada){
        anunciar("Pulsa sobre el botón \"INICIO\" para empezar una nueva partida.", "aviso");
        return;
    }

    // Torre pulsada (array con sus discos) y su disco de arriba (el último del array).
    const torre = juego.torres[indice];
    const discoArriba = torre[torre.length - 1];


    // <========== Primer clic: seleccionar el disco ==========>

    if (juego.torreSeleccionada === null){
        // Condicional para comprobar que se haya pulsado sobre un disco y no sobre una celda vacía.
        if (!evento.target.classList.contains("disco")){
            anunciar("Haz clic sobre el disco que quieres mover.", "aviso");
            return;
        }

        // Condicional para comprobar que el disco pulsado sea el de arriba.
        if (evento.target.id !== `disco${discoArriba}`){
            anunciar("Solo puedes mover el disco de arriba de cada torre.", "aviso");
            return;
        }

        // Guarda la torre seleccionada y marca el disco (borde amarillo, clase "seleccionado" del CSS).
        juego.torreSeleccionada = indice;
        evento.target.classList.add("seleccionado");

        anunciar(`Disco ${discoArriba} seleccionado. Ahora haz clic en la torre de destino (o en la misma torre para cancelar).`);
        return;
    }


    // <========== Segundo clic: elegir la torre de destino ==========>

    const origen = juego.torreSeleccionada;

    // Se deselecciona el disco en cualquier caso (se ha movido, se ha cancelado o el movimiento no está permitido).
    juego.torreSeleccionada = null;

    // Condicional para cancelar la selección si se pulsa la misma torre.
    if (indice === origen){
        pintarDiscos(juego); /* Repinta los discos para quitar el borde de selección. */
        anunciar("Selección cancelada. Elige otro disco.");
        return;
    }

    // Condicional para comprobar si el movimiento es válido. Si el valor de "moverDisco" devuelve "true" es válido, si no lo es, devuelve "false".
    if (moverDisco(juego, origen, indice)){
        // Una variable aumentará después de mover una pieza: suma un movimiento y lo muestra.
        juego.movimientos++;
        actualizarMovimientos(juego);

        anunciar(`Movimiento ${juego.movimientos}: disco de la torre ${origen + 1} a la torre ${indice + 1}.`);

        // Condicional para comprobar si, con este movimiento, la torre está terminada.
        if (comprobarVictoria(juego)) terminarPartida(juego);
    } else anunciar("Movimiento no permitido: no se puede colocar un disco encima de otro más pequeño.", "aviso");

    // Repinta los discos en su nueva posición (y quita el borde de selección).
    pintarDiscos(juego);
}


/**
 * Comprueba si la torre está terminada: todos los discos están en la última torre, la tercera ("nTorres - 1"), que es la de destino.
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 *     Se devuelve:
 *         "true"  → Si la torre está terminada.
 *         "false" → Si todavía no lo está.
 */
function comprobarVictoria(juego){ return juego.torres[nTorres - 1].length === nDiscos; }


/**
 * Lee el mejor tiempo guardado en el "localStorage".
 *     Se devuelve:
 *         El objeto con el mejor tiempo ("{ jugador, segundos, movimientos }") → Si hay uno guardado y es válido.
 *         "null"                                                               → Si no hay ninguno o los datos guardados no son válidos.
 */
function leerMejorTiempo(){
    // Estructura de control para capturar errores al leer (por ejemplo, si el texto guardado no es un JSON válido o el navegador bloquea el "localStorage").
    try{
        /**
         * "getItem" Devuelve el texto guardado con esa clave, si no existe devuelve "null".
         * "JSON.parse" Lo convierte de nuevo en objeto.
         */
        const mejorTiempo = JSON.parse(localStorage.getItem(claveMejorTiempo));

        // Condicional para comprobar que los datos tengan la forma esperada (alguien podría haberlos modificado a mano desde el navegador).
            /**
             * La primera condición comprueva/verifica que exista un valor guardado.
             * La segunda condición comprueva/verifica que la propiedad "segundos" sea un número entero válido.
             * La tercera condición comprueva/verifica que la propiedad "jugador" sea una cadena de texto (string).
             */
        if (mejorTiempo !== null && Number.isInteger(mejorTiempo.segundos) && typeof mejorTiempo.jugador === "string") return mejorTiempo;
    } catch (error){ console.warn("[leerMejorTiempo] No se ha podido leer el mejor tiempo guardado:", error); }

    return null;
}


// Muestra en el marcador el mejor tiempo guardado (o "--:--" si todavía no hay ninguno).
function mostrarMejorTiempo(){
    const mejorTiempo = leerMejorTiempo();

    document.querySelector("#mejorTiempo").textContent = (mejorTiempo === null) ? "--:--" : `${formatearTiempo(mejorTiempo.segundos)} -{${mejorTiempo.jugador}}-`;
}


/**
 * Termina la partida al completar la torre. Se detiene el reloj, se muestra el mensaje final y, si es un tiempo mejor que el guardado, lo guarda en el "localStorage" del navegador.
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 */
function terminarPartida(juego){
    // Detiene el reloj y calcula el tiempo final exacto.
    detenerReloj(juego);
    actualizarReloj(juego);

    // Bloquea el tablero, impidiendo que se pueden mover discos hasta pulsar de nuevo el botón "INICIO".
    juego.partidaIniciada = false;

    // Número mínimo de movimientos posibles para resolver la torre: [2 elevado al número de discos, menos 1 (con 5 discos, 31)].
    const movimientosMinimos = 2 ** nDiscos - 1;

    // Mensaje final de la partida.
                                           // ${nTorres}
    let mensaje = `¡Partida finalizada! Torre ${juego.torres.length} terminada, ${juego.jugador}: Lo hizo en ${juego.movimientos} movimientos (el mínimo posible para esta partida era de un total de ${movimientosMinimos}) en ${formatearTiempo(juego.segundos)}.`;

    // Guarda el tiempo de esta partida para validaciones.
    const mejorTiempo = leerMejorTiempo();

    // Condicional para comprobar si es el mejor tiempo (no hay ninguno guardado o el de esta partida es menor)
    if (mejorTiempo === null || juego.segundos < mejorTiempo.segundos){
        // Estructura de control para capturar errores al guardar (por ejemplo, si el navegador bloquea el "localStorage").
        try{
            /**
             * "JSON.stringify" Convierte el objeto en texto, porque el "localStorage" solo guarda textos;
             * "setItem" Lo guarda con su clave.
             */
            localStorage.setItem(claveMejorTiempo, JSON.stringify({ jugador: juego.jugador, segundos: juego.segundos, movimientos: juego.movimientos }));

            mensaje += " ¡Nuevo mejor tiempo!";
        } catch (error){ console.warn("[terminarPartida] No se ha podido guardar el mejor tiempo:", error); }

        mostrarMejorTiempo();
    }

    anunciar(`${mensaje} Pulsa "INICIO" para jugar otra vez.`, "exito");

    console.log(`[terminarPartida] Partida terminada por "${juego.jugador}": Completada con un total de ${juego.movimientos} movimientos en ${juego.segundos} segundos.`);
}


/**
 * Guarda la partida en curso en el "localStorage". Al pulsar sobre el botón "Guardar" se almacenará localmente en el navegador el nombre del jugador, el tiempo transcurrido desde el inicio de la partida, los movimientos realizados y la posición de los discos.
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 */
function guardarPartida(juego){
    // Condicional para comprobar que haya una partida en curso. Las partidas no se pueden guardar sin antes haber pulsado sobre "INICIO" o con la partida ya terminada/finalizada).
    if (!juego.partidaIniciada){
        anunciar("No hay ninguna partida en curso que guardar. Pulsa \"INICIO\" para empezar una.", "aviso");
        return;
    }
 
    // Actualiza los segundos para guardar el tiempo exacto de este momento.
    actualizarReloj(juego);
 
    // Estructura de control para capturar errores al guardar (por ejemplo, si el navegador bloquea el "localStorage").
    try{
        // Solo se guardan los datos necesarios para continuar la partida.
        localStorage.setItem(clavePartidaGuardada, JSON.stringify({ jugador: juego.jugador, segundos: juego.segundos, movimientos: juego.movimientos, torres: juego.torres }));
 
        anunciar(`Partida guardada: ${juego.jugador}, ${juego.movimientos} movimientos en ${formatearTiempo(juego.segundos)}. Puedes continuarla más tarde con "Restaurar".`);
 
        console.log("[guardarPartida] Partida guardada:", juego.torres);
 
    } catch (error){
        anunciar("ERROR: No se ha podido guardar la partida en este navegador.", "error");
        console.warn("[guardarPartida] No se ha podido guardar la partida:", error);
    }
}


/**
 * Comprueba que las torres leídas del "localStorage" sean válidas: hay "nTorres" torres, están todos los discos (del 1 al "nDiscos") una sola vez y ningún disco está encima de otro más pequeño.
 *     Parámetros:
 *         torres → Array con las torres a comprobar.
 *     Se devuelve:
 *         "true"  → Si las torres son válidas.
 *         "false" → Si no lo son.
 */
function validarTorres(torres){
    // Condicional para comprobar que sea un array con el número correcto de torres.
    if (!Array.isArray(torres) || torres.length !== nTorres) return false; /* "Array.isArray()" Devuelve "true" si el valor que se le pasa es un array o contiene un array; y "false" si no. */
 
    // Discos encontrados (para comprobar que no falte ni se repita ninguno).
    const discosEncontrados = [];
 
    // Bucle para recorrer cada una de las torres.
    for (let i = 0; i < torres.length; i++){
        // Condicional para comprobar que cada torre sea a su vez un array.
        if (!Array.isArray(torres[i])) return false;
 
        // Bucle para recorrer los discos de la torre actual.
        for (let posicion = 0; posicion < torres[i].length; posicion++){
            const disco = torres[i][posicion];
 
            /**
             * Condicional para comprobar cada disco.
             *     La primera condición comprueba que sea un número entero entre 1 y "nDiscos".
             *     La segunda comprueba que no esté repetido.
             *     La tercera comprueba que no esté encima de uno más pequeño (el de debajo, en la posición anterior, tiene que ser más grande).
             */
            if (!Number.isInteger(disco) || disco < 1 || disco > nDiscos) return false;
            if (discosEncontrados.includes(disco)) return false;
            if (posicion > 0 && torres[i][posicion - 1] < disco) return false;
 
            discosEncontrados.push(disco);
        }
    }
 
    // Las torres son válidas si están todos los discos.
    return discosEncontrados.length === nDiscos;
}
 
 
/**
 * Lee la partida guardada en el "localStorage".
 *     Se devuelve:
 *         El objeto con la partida ("{ jugador, segundos, movimientos, torres }") → Si hay una guardada y es válida.
 *         "null"                                                                 → Si no hay ninguna o los datos guardados no son válidos.
 */
function leerPartidaGuardada(){
    // Estructura de control para capturar errores al leer (por ejemplo, si el texto guardado no es un JSON válido).
    try{
        const partida = JSON.parse(localStorage.getItem(clavePartidaGuardada));
 
        // Condicional para comprobar que los datos tengan la forma esperada. Existe un valor guardado, el jugador es un texto, los segundos y los movimientos son números enteros no negativos y las torres son válidas.
        if (partida !== null && typeof partida.jugador === "string" && Number.isInteger(partida.segundos) && partida.segundos >= 0 && Number.isInteger(partida.movimientos) && partida.movimientos >= 0 && validarTorres(partida.torres)) return partida;
 
    } catch (error){ console.warn("[leerPartidaGuardada] No se ha podido leer la partida guardada:", error); }
 
    return null;
}
 
 
/**
 * Restaura la partida guardada. Para ello recupera el jugador que la hizo, la cantidad de movimientos, la posición de los discos y el tiempo, y continúa la partida desde ese punto.
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 */
function restaurarPartida(juego){
    const partida = leerPartidaGuardada();
 
    // Condicional para comprobar que haya una partida guardada válida.
    if (partida === null){
        anunciar("No hay ninguna partida guardada que restaurar (o los datos guardados no son válidos).", "aviso");
        return;
    }
 
    // Recupera los datos de la partida en el objeto del juego.
    juego.jugador = partida.jugador;
    juego.movimientos = partida.movimientos;
    juego.torreSeleccionada = null;
    juego.partidaIniciada = true;
 
    // Copia las torres guardadas en el array auxiliar.
    juego.torres.length = 0;
    for (let i = 0; i < partida.torres.length; i++) juego.torres.push(partida.torres[i]);
 
    // Muestra el nombre del jugador en su campo, pinta los discos, actualiza el marcador y continúa el reloj desde el tiempo guardado.
    document.querySelector("#nombreJugador").value = partida.jugador;
    pintarDiscos(juego);
    actualizarMovimientos(juego);
    iniciarReloj(juego, partida.segundos);
 
    anunciar(`Partida restaurada. ¡Continúa, ${partida.jugador}! Llevas ${partida.movimientos} movimientos en ${formatearTiempo(partida.segundos)}.`);
 
    console.log("[restaurarPartida] Partida restaurada:", juego.torres);
}


/**
 * Asigna los eventos de clic al botón "INICIO" y a las celdas de las torres.
 *     Parámetros:
 *         juego → Objeto del juego ("torresHanoi").
 */
function asignarEventos(juego){
    // Botón "INICIO" con la acción de poder empezar una partida nueva. Botón "Guardar" con la acción de poder guardar la partida actual. Botón "Restaurar" con la acción de poder recuperar la partida guardada. 
    document.querySelector("#botonInicio").addEventListener("click", function(){ iniciarPartida(juego); });
    document.querySelector("#botonGuardar").addEventListener("click", function(){ guardarPartida(juego); });
    document.querySelector("#botonRestaurar").addEventListener("click", function(){ restaurarPartida(juego); });

    // Bucle para recorrer cada una de las torres.
    for (let i = 0; i < nTorres; i++){
        // Celdas de la torre actual.
        const celdas = document.querySelectorAll(`#torre${i + 1} .celda`);

        // Bucle para asignar el evento a cada celda de la torre.
            /**
             * El evento se pone en las celdas y no en los discos, porque los discos se borran y se vuelven a crear en cada "pintarDiscos" (perderían su evento).
             * Al pulsar un disco, el clic "sube" (se propaga) hasta su celda, así que el evento de la celda también se ejecuta; "evento.target" indica qué se pulsó exactamente.
             * Cada celda recuerda el índice de su torre ("i" de esta vuelta del bucle).
             */
        for (let j = 0; j < celdas.length; j++){ celdas[j].addEventListener("click", function(evento){ pulsarTorre(juego, i, evento); }); }
    }
}


// <========== Main ==========>

// Estructura de control de flujo para la captura de posibles excepciones y errores de ejecución.
try{
    // Crea la página del juego.
    pintarJuego();

    // Coloca los discos en la primera torre y los pinta.
    prepararTorres(torresHanoi);
    pintarDiscos(torresHanoi);

    // Asigna los eventos de clic (botón "INICIO" y torres).
    asignarEventos(torresHanoi);

    // Muestra el mejor tiempo guardado de partidas anteriores.
    mostrarMejorTiempo();

// Captura de posibles errores no controlados durante la ejecución del programa.
} catch (error){
    console.error("ERROR: Se ha producido un fallo inesperado (no controlado) durante la ejecución del programa:", error);
 
    // Muestra el error en la página.
    const mensajeError = document.createElement("p");
    mensajeError.classList.add("mensaje", "error");
    mensajeError.textContent = `ERROR: Se ha producido un fallo inesperado (no controlado) durante la ejecución del programa: ${error.message}`;
    document.querySelector("main").appendChild(mensajeError);
}