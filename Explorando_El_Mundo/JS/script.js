// Controlador de la decisión de repetir la ejecución del programa (se establece inicialmente en "false" para evitar repeticiones innecesarias).
var decisionRepetirEjecucion = false;

/**
 * Solicita al usuario si desea volver a ejecutar el programa después de producirse una respuesta no válida.
 *      Se devuelve:
 *          "true"  → Si el usuario desea volver a intentarlo.
 *          "false" → Si el usuario no desea volver a intentarlo.
 */
function solicitarReintento(){
    // Bucle controlador de reintentos sobre la solicitud de confirmación.
    do{
        // Solicita al usuario si desea volver a intentarlo (recolector de respuesta por pantalla).
        var respuesta = prompt("¿Quieres retroceder, volver a intentarlo? ('Sí' o 'No)");

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (respuesta == null){
            return false;
        }

        // Condicional para comprobar que la respuesta esperada únicamente contenga letras.
            /**
             * Comprueba/Verifica que la respuesta únicamente pueda contener caracteres alfabéticos.
             *      Se permiten:
             *          Letras mayúsculas y minúsculas.
             *          Vocales acentuadas y con diéresis.
             *          'Ñ' y 'ñ'.
             */
        if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+$/.test(respuesta)){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener letras.");
            
            // Registra en la consola el color introducido.
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
                    /**
                     * Si no fuese por función y si por un comportamiento lineal dentro del bloque de código, quedaría de la siguiente manera:
                     *      decisionRepetirEjecucion = true;
                     *      //return; // No habríala función "return". 
                     *      break;
                     */

                // Condicional para el estado negativo de la respuesta.
                case "no":
                    return false;
                    /**
                     * Si no fuese por función y si por un comportamiento lineal dentro del bloque de código,quedaría de la siguiente manera:
                     *      decisionRepetirEjecucion = false;
                     *      break;
                     */

                // Condicional para respuestas no esperadas por el sistema.
                default:
                    alert("ERROR: La respuesta introducida no es válida. Recuerde que debe responder con un 'Sí' o 'No'.");

                    // Registra en la consola el color introducido.
                    console.log (respuesta);

                    // Finaliza la ejecución del bloque "switch".
                    break;
                    /**
                     * Si no fuese por función y si por un comportamiento lineal dentro del bloque de código, quedaría de la siguiente manera:
                     *      alert("ERROR: La respuesta introducida no es válida. Recuerde que debe responder con un 'Sí' o 'No'.");
                     *      decisionRepetirEjecucion = true;
                     *      break;
                     */
            }
        }

    // Repite la solicitud (pregunta de reintento) hasta que no se haya recibido una respuesta válida.
    } while (true);
}


// Bucle controlador de reintentos (se fuerza a que su contenido se esjecute mínimo una vez desde elarranque/inicio del programa).
do{
    // Estructura de control de flujo para la captura de posibles excepciones y errores de ejecución que se produzcan mientras el programa está arrancado.
    try{
        // <========== Bloque de código para la solicitud sobre la cantidad de carteles que hay en el camino ==========>

        // Solicita al usuario la cantidad de carteles (recolector de respuesta por pantalla).
        var cantidadCarteles = prompt("¿Cuántos carteles hay en el camino? (Se solicita un número entero positivo o cero)");

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (cantidadCarteles == null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola la cantidad de carteles introducidos.
            console.log (cantidadCarteles);
            
            // Detiene la repetición del programa.
            decisionRepetirEjecucion = false;
        }

        // Condicional para comprobar/verificar que la respuesta introducida sea un número entero positivo o cero.
            /**
             * Se permiten:
             *      Números enteros positivos y cero.
             * No se permiten:
             *      Números negativos.
             *      Números decimales.
             *      Cualquier otro tipo de dato que no sea un número entero positivo.
             * 
             * Condicionadores::
             *      La primera condición comprueba si la respuesta introducida es un número (isNaN = is Not a Number).
             *      La segunda condición comprueba si la respuesta introducida es un número negativo.
             *      La tercera condición comprueba si la respuesta introducida es un número decimal.
             */
        if (isNaN(cantidadCarteles) || cantidadCarteles < 0 || !Number.isInteger(Number(cantidadCarteles))){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener un número entero positivo o cero.");
            
            // Registra en la consola la cantidad de carteles introducidos.
            console.log (cantidadCarteles);

            // Solicita al usuario si desea volver a intentarlo.
            decisionRepetirEjecucion = solicitarReintento();
        
        // Condicional para respuestas esperadas.
        } else if (cantidadCarteles == 0){
            document.write ("<div>");
            document.write ("<h3>");
            document.write ("No hay carteles por el camino");
            document.write ("</h3>");
            document.write ("</div>");

        // Condicional para respuestas esperadas.
        } else{
            document.write ("<div>");
            // Bucle para mostrar la cantidad de carteles introducidos por el usuario.
            while (cantidadCarteles > 0){
                //document.write ("Cartel");
                document.write("<img src='Images/Carteles/americano.png'>");

                // Registra en la consola la cantidad de carteles introducidos.
                console.log (cantidadCarteles);

                // Decrementa la cantidad de carteles introducidos por el usuario.
                cantidadCarteles --;
            }
            document.write ("</div>");
        }

        // Salto de línea.
        document.write ("<br>");


        // <========== Bloque de código para la solicitud sobre la cantidad de puertas que hay en el camino ==========>

        // Solicita al usuario la cantidad de puertas (recolector de respuesta por pantalla).
        var cantidadPuertas = prompt("¿Cuántas puertas hay en el camino? (Se solicita un número entero positivo o cero)");
        
        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (cantidadPuertas == null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola la cantidad de puertas introducidas.
            console.log (cantidadPuertas);

            // Detiene la repetición del programa.
            decisionRepetirEjecucion = false;
        }

        // Condicional para comprobar/verificar que la respuesta introducida sea un número entero positivo o cero.
        if (isNaN(cantidadPuertas) || cantidadPuertas < 0 || !Number.isInteger(Number(cantidadPuertas))){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener un número entero positivo o cero.");
            
            // Registra en la consola la cantidad de puertas introducidas.
            console.log (cantidadPuertas);

            // Solicita al usuario si desea volver a intentarlo.
            decisionRepetirEjecucion = solicitarReintento();
            
        // Condicional para respuestas esperadas.
        } else if (cantidadPuertas == 0){
            document.write ("<div>");
            document.write ("<h3>");
            document.write ("No hay puertas por el camino");
            document.write ("</h3>");
            document.write ("</div>");

        // Condicional para respuestas esperadas.
        } else{
            // Solicita al usuario el número de la primera puerta (recolector de respuesta por pantalla).
            var numeroPrimeraPuerta = prompt("¿Cuál es el número de la primera puerta?");
        
            // Condicional para comprobar si el usuario ha cancelado la solicitud.
            if (numeroPrimeraPuerta == null){
                // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
                alert("La ejecución ha sido cancelada.");

                // Registra en la consola el número de la primera puerta introducido.
                console.log (numeroPrimeraPuerta);
                
                // Detiene la repetición del programa.
                decisionRepetirEjecucion = false;
            }

            // Condicional para comprobar/verificar que la respuesta introducida sea un número entero positivo (misma condición que la anterior, pero sin permitir el cero).
            if (isNaN(numeroPrimeraPuerta) || numeroPrimeraPuerta <= 0 || !Number.isInteger(Number(numeroPrimeraPuerta))){
                // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
                alert("ERROR: La respuesta únicamente puede contener un número entero positivo.");

                // Registra en la consola el número de la primera puerta introducido.
                console.log (numeroPrimeraPuerta);

                // Solicita al usuario si desea volver a intentarlo.
                decisionRepetirEjecucion = solicitarReintento();                

            // Condicional para respuestas esperadas.
            } else{
                numeroPrimeraPuerta = Number(numeroPrimeraPuerta);

                document.write ("<div class = \"puertas\">");

                // Bucle para mostrar la cantidad de puertas introducidas por el usuario.
                while (cantidadPuertas > 0){
                    document.write ("<div>");
                    document.write ("<h3>");
                    document.write ("Nº " + numeroPrimeraPuerta);
                    document.write ("</h3>");

                    //document.write ("Cartel");
                    document.write("<img src='Images/Puertas/maderaRoja.png'>");
                    document.write ("</div>");
                    
                    // Registra en la consola la cantidad de puertas introducidas.
                    console.log (cantidadPuertas);

                    // Registra en la consola el número de la puerta mostrada.
                    console.log (numeroPrimeraPuerta);

                    // Incrementa en dos unidades el número de la siguiente puerta.
                    numeroPrimeraPuerta += 2; /* Es igual a poner "numeroPrimeraPuerta = numeroPrimeraPuerta + 2" */

                    // Decrementa la cantidad de puertas introducidas por el usuario.
                    cantidadPuertas --;
                }

                document.write ("</div>");
            }
        }

        // Salto de línea.
        document.write ("<br>");

        
        // <========== Bloque de código para la solicitud sobre la cantidad de escaparates que hay en el camino ==========>

        // Solicita al usuario la cantidad de escaparates (recolector de respuesta por pantalla).
        var cantidadEscaparates = prompt("¿Cuántas escaparates hay en el camino? (Se solicita un número entero positivo o cero)");

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (cantidadEscaparates == null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola la cantidad de escaparates introducidas.
            console.log (cantidadEscaparates);
            
            // Detiene la repetición del programa.
            decisionRepetirEjecucion = false;
        }

        // Condicional para comprobar/verificar que la respuesta introducida sea un número entero positivo o cero.
        if (isNaN(cantidadEscaparates) || cantidadEscaparates < 0 || !Number.isInteger(Number(cantidadEscaparates))){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener un número entero positivo o cero.");
            
            // Registra en la consola la cantidad de escaparates introducidas.
            console.log (cantidadEscaparates);

            // Solicita al usuario si desea volver a intentarlo.
            decisionRepetirEjecucion = solicitarReintento();
        
        // Condicional para respuestas esperadas.
        } else if (cantidadEscaparates == 0){
            document.write ("<div>");
            document.write ("<h3>");
            document.write ("No hay escaparates por el camino");
            document.write ("</h3>");
            document.write ("</div>");

        // Condicional para respuestas esperadas.
        } else{
            document.write ("<div>");
            // Bucle para mostrar la cantidad de escaparates introducidas por el usuario.
            while (cantidadEscaparates > 0){
                //document.write ("Cartel");
                document.write("<img src='Images/Escaparates/tiendaCarniceria.png'>");

                // Registra en la consola la cantidad de escaparates introducidas.
                console.log (cantidadEscaparates);

                // Decrementa la cantidad de escaparates introducidas por el usuario.
                cantidadEscaparates --;
            }
            document.write ("</div>");
        }

        
        // <========== Bloque de código para la solicitud sobre la hora del reloj ==========>

        document.write ("<div class = \"relojSemaforo\">");
        // Solicita al usuario la hora del reloj (recolector de respuesta por pantalla).
        //var horaReloj = prompt("¿Qué hora es? (Formato: HH:MM)");
        // Solicita al usuario la hora del reloj (recolector de respuesta por pantalla).
        var horaReloj = prompt("¿Qué hora es? (Introduzca una hora entre 0 y 23)");

        // Normaliza la respuesta eliminando los espacios (facilitar las comparaciones).
        horaReloj = horaReloj.trim();

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (horaReloj == null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola la hora introducida.
            console.log (horaReloj);
            
            // Registra en la consola los minutos introducidos.
            console.log (minutosReloj);
            
            // Detiene la repetición del programa.
            decisionRepetirEjecucion = false;
        }

        // Condicional para comprobar/verificar que la respuesta introducida sea un número entero positivo (inferior o igual a 23) o cero.
        if (isNaN(horaReloj) || Number(horaReloj) < 0 || Number(horaReloj) > 23 || !Number.isInteger(Number(horaReloj))){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener un número entero positivo (inferior o igual a 23) o cero.");
            
            // Registra en la consola la cantidad de escaparates introducidas.
            console.log (horaReloj);

            // Solicita al usuario si desea volver a intentarlo.
            decisionRepetirEjecucion = solicitarReintento();
        }

        // Solicita al usuario los minutos del reloj (recolector de respuesta por pantalla).
        var minutosReloj = prompt("¿Cuántos minutos son? (Introduzca un número entre 0 y 59)");

        // Normaliza la respuesta eliminando los espacios (facilitar las comparaciones).
        minutosReloj = minutosReloj.trim();

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (minutosReloj == null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola la hora introducida.
            console.log (horaReloj);
            
            // Registra en la consola los minutos introducidos.
            console.log (minutosReloj);
            
            // Detiene la repetición del programa.
            decisionRepetirEjecucion = false;
        }

        // Condicional para comprobar/verificar que la respuesta introducida sea un número entero positivo (inferior o igual a 59) o cero.
        if (isNaN(minutosReloj) || Number(minutosReloj) < 0 || Number(minutosReloj) > 59 || !Number.isInteger(Number(minutosReloj))){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener un número entero positivo (inferior o igual a 59) o cero.");
            
            // Registra en la consola la cantidad de escaparates introducidas.
            console.log (minutosReloj);

            // Solicita al usuario si desea volver a intentarlo.
            decisionRepetirEjecucion = solicitarReintento();

        // Condicional para respuestas esperadas.
        } else{
            horaReloj = Number(horaReloj);
            minutosReloj = Number(minutosReloj);

            document.write ("<div class = \"reloj\">");
            document.write ("<div class = \"horas\">");
            document.write (horaReloj);
            document.write ("</div>");
            document.write ("<div>");
            document.write (":");
            document.write ("</div>");
            document.write ("<div class = \"minutos\">");
            document.write (minutosReloj);
            document.write ("</div>");
            document.write ("</div>");
        }
        

        // <========== Bloque de código para la solicitud sobre el color de las luces del semáforo ==========>

        // Solicita al usuario el color de las luces del semáforo (recolector de respuesta por pantalla).
        var colorLuzSemaforo = prompt("¿Cuál es el color de luz del semáforo? ('Rojo', 'Verde' o 'Ámbar')");

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (colorLuzSemaforo == null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola el color introducido.
            console.log (colorLuzSemaforo);
            
            // Detiene la repetición del programa.
            decisionRepetirEjecucion = false;

        // Condicional para comprobar que la respuesta esperada únicamente contenga letras.
            /**
             * Comprueba/Verifica que la respuesta únicamente pueda contener caracteres alfabéticos.
             *      Se permiten:
             *          Letras mayúsculas y minúsculas.
             *          Vocales acentuadas y con diéresis.
             *          'Ñ' y 'ñ'.
             */
        } else if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+$/.test(colorLuzSemaforo)){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener letras.");
            
            // Registra en la consola el color introducido.
            console.log (colorLuzSemaforo);

            // Solicita al usuario si desea volver a intentarlo.
            decisionRepetirEjecucion = solicitarReintento();

        // Condicional para respuestas esperadas.
        } else{
            // Normaliza la entrada.
                /** 
                 * Elima los espacios y convierte la respuesta a minúsculas para facilitar las comparaciones.
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
                    document.write ("<div class = \"semaforo\">");
                    //document.write ("La luz del semáforo es roja");
                    document.write("<img src='Images/ColorSemaforo/rojo.png'>");
                    document.write ("</div>");

                    // Registra en la consola el color introducido.
                    console.log (colorLuzSemaforo);

                    // Detiene la repetición del programa después de recibir una respuesta válida, bloque "do-while".
                    decisionRepetirEjecucion = false;

                    // Finaliza la ejecución del bloque "switch".
                    break;

                // Condicional para la luz ámbar del semáforo.
                case "ámbar":
                case "ambar":
                    document.write ("<div class = \"semaforo\">");
                    //document.write ("La luz del semáforo es ámbar");
                    document.write("<img src='Images/ColorSemaforo/ambar.png'>");
                    document.write ("</div>");

                    // Registra en la consola el color introducido.
                    console.log (colorLuzSemaforo);

                    // Detiene la repetición del programa después de recibir una respuesta válida, bloque "do-while".
                    decisionRepetirEjecucion = false;

                    // Finaliza la ejecución del bloque "switch".
                    break;

                // Condicional para la luz verde del semáforo.
                case "verde":
                    document.write ("<div class = \"semaforo\">");
                    //document.write ("La luz del semáforo es verde");
                    document.write("<img src='Images/ColorSemaforo/verde.png'>");
                    document.write ("</div>");

                    // Registra en la consola el color introducido.
                    console.log (colorLuzSemaforo);

                    // Detiene la repetición del programa después de recibir una respuesta válida, bloque "do-while".
                    decisionRepetirEjecucion = false;

                    // Finaliza la ejecución del bloque "switch".
                    break;

                // Condicional para respuestas no esperadas.
                default:
                    document.write ("<div class = \"semaforo\">");
                    /**
                     * document.write ("<h1>");
                     * document.write ("ERROR: El color introducido no coincide con uno de los solicitados ('Rojo', 'Verde' o 'Ámbar').");
                     * document.write ("</h1>");
                     */
                    alert("ERROR: El color introducido no coincide con uno de los solicitados ('Rojo', 'Verde' o 'Ámbar').");
                    document.write ("</div>");

                    // Registra en la consola el color introducido.
                    console.log (colorLuzSemaforo);

                    // Solicita al usuario si desea volver a intentarlo.
                    decisionRepetirEjecucion = solicitarReintento();

                    // Finaliza la ejecución del bloque "switch".
                    break;
            }
        }
        document.write ("</div>");

        // Salto de línea.
        document.write ("<br>");


        // <========== Bloque de código para la solicitud sobre la cantidad de coches que hay en el camino ==========>

        // Solicita al usuario la cantidad de coches (recolector de respuesta por pantalla).
        var cantidadCoches = prompt("¿Cuántos coches hay en la carretera/camino? (Se solicita un número entero positivo o cero)");

        // Condicional para comprobar si el usuario ha cancelado la solicitud.
        if (cantidadCoches == null){
            // Muestreo de un mensaje informativo indicando que el usuario ha cancelado la ejecución.
            alert("La ejecución ha sido cancelada.");

            // Registra en la consola la cantidad de coches introducidos.
            console.log (cantidadCoches);
            
            // Detiene la repetición del programa.
            decisionRepetirEjecucion = false;
        }

        // Condicional para comprobar/verificar que la respuesta introducida sea un número entero positivo o cero.
        if (isNaN(cantidadCoches) || cantidadCoches < 0 || !Number.isInteger(Number(cantidadCoches))){
            // Muestreo de un mensaje de error indicando que la respuesta introducida contiene caracteres no permitidos.
            alert("ERROR: La respuesta únicamente puede contener un número entero positivo o cero.");
            
            // Registra en la consola la cantidad de coches introducidos.
            console.log (cantidadCoches);

            // Solicita al usuario si desea volver a intentarlo.
            decisionRepetirEjecucion = solicitarReintento();
        
        // Condicional para respuestas esperadas.
        } else if (cantidadCoches == 0){
            document.write ("<div>");
            document.write ("<h3>");
            document.write ("No hay coches en la carretera/camino");
            document.write ("</h3>");
            document.write ("</div>");

        // Condicional para respuestas esperadas.
        } else{
            document.write ("<div>");
            // Bucle para mostrar la cantidad de coches introducidos por el usuario.
            while (cantidadCoches > 0){
                //document.write ("Coche");
                document.write("<img src='Images/Coches/azul.png'>");

                // Registra en la consola la cantidad de coches introducidos.
                console.log (cantidadCoches);

                // Decrementa la cantidad de coches introducidos por el usuario.
                cantidadCoches --;
            }
            document.write ("</div>");
        }

    // Captura de posibles excepciones/errores de tipo genérico, "error", que ocurran/se produzcan durante el proceso de ejecución del programa (se lanza cuando se produce un fallo que no ha sido controlado previamente por el código, bajo las condiciones establecidas por el programa).
    } catch (error){
        // Muestreo por pantalla de un mensaje de error al usuario indicando que se ha producido un fallo durante la ejecución del programa.
        alert("ERROR: Se ha producido un fallo durante la ejecución del programa: " + error.message);

        // Muestreo por consola de un mensaje de error indicando que se ha producido un fallo durante la ejecución del programa.
        console.error ("ERROR: Se ha producido un fallo durante la ejecución del programa:", error);

        // Finaliza/Detiene la posibilidad de volver a ejecutar del programa después de producirse una excepción.
        decisionRepetirEjecucion = false;
    }

// Comprueba si el usuario ha solicitado volver a ejecutar el programa.
} while (decisionRepetirEjecucion == true);