"use strict";


// <========== Expresiones regulares ==========>

/**
 * Objeto con las expresiones regulares (un atributo por campo) y un método "comprobar" que prueba un valor contra la regex del campo indicado.
 *     ("password2" no tiene regex: se compara con la contraseña en "validarCampo".)
 */
const validador = {
    nombre:        /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+( [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/,
    apellidos:     /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+( [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?$/,
    dni:           /^([0-9]{8}[A-Za-z]|[XYZxyz][0-9]{7}[A-Za-z])$/,
    fecha:         /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/,
    codigoPostal:  /^(0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/,
    email:         /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    telefonoFijo:  /^[89][0-9]{8}$/,
    telefonoMovil: /^[67][0-9]{8}$/,
    iban:          /^ES[0-9]{22}$/,
    tarjeta:       /^[0-9]{16}$/,
    password:      /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{12,}$/,

    // Prueba "valor" con la regex guardada en "campo". Devuelve true o false.
    comprobar(campo, valor){ return this[campo].test(valor); }
};


// <========== Datos de los campos ==========>

// Objeto donde se vuelcan los datos del formulario antes de llevarlos a sessionStorage.
const datosUsuario = {};


// <========== Definición de los campos ==========>

/**
 * Cada campo describe: su "name", la etiqueta visible, el tipo de input, qué regex de "validador" lo comprueba y el aviso con el formato correcto.
 *     "password2" lleva regex a null: se valida comparándolo con la contraseña.
 */
const campos = [
     { name: "nombre",        etiqueta: "Nombre",               tipo: "text",       regex: "nombre",        ejemplo: "Jaime",                       aviso: "Uno o más nombres, cada uno empezando por mayúscula." }
    ,{ name: "apellidos",     etiqueta: "Apellidos",            tipo: "text",       regex: "apellidos",     ejemplo: "García González",             aviso: "Uno o dos apellidos, cada uno con mayúscula inicial." }
    ,{ name: "dni",           etiqueta: "DNI / NIE",            tipo: "text",       regex: "dni",           ejemplo: "12345678Z / X12345678Z",      aviso: "8 dígitos y letra (DNI) o X/Y/Z, 7 dígitos y letra (NIE)." }
    ,{ name: "fecha",         etiqueta: "Fecha de nacimiento",  tipo: "text",       regex: "fecha",         ejemplo: "DD/MM/AAAA",                  aviso: "Formato DD/MM/AAAA." }
    ,{ name: "codigoPostal",  etiqueta: "Código postal",        tipo: "text",       regex: "codigoPostal",  ejemplo: "35500",                       aviso: "5 dígitos de una provincia española (01xxx a 52xxx)." }
    ,{ name: "email",         etiqueta: "E-mail",               tipo: "text",       regex: "email",         ejemplo: "nombre@dominio.com",          aviso: "Formato nombre@dominio.ext." }
    ,{ name: "telefonoFijo",  etiqueta: "Teléfono fijo",        tipo: "text",       regex: "telefonoFijo",  ejemplo: "928123456",                   aviso: "9 dígitos empezando por 8 o 9." }
    ,{ name: "telefonoMovil", etiqueta: "Teléfono móvil",       tipo: "text",       regex: "telefonoMovil", ejemplo: "612345678",                   aviso: "9 dígitos empezando por 6 o 7." }
    ,{ name: "iban",          etiqueta: "IBAN",                 tipo: "text",       regex: "iban",          ejemplo: "ES9121000418450200051332",    aviso: "ES seguido de 22 dígitos." }
    ,{ name: "tarjeta",       etiqueta: "Tarjeta de crédito",   tipo: "text",       regex: "tarjeta",       ejemplo: "1234567812345678",            aviso: "16 dígitos." }
    ,{ name: "password",      etiqueta: "Contraseña",           tipo: "password",   regex: "password",      ejemplo: "Mínimo 12 caracteres",        aviso: "Mínimo 12 caracteres con letra, número y un símbolo." }
    ,{ name: "password2",     etiqueta: "Repetir contraseña",   tipo: "password",   regex: null,            ejemplo: "Repite la contraseña",        aviso: "Debe coincidir con la contraseña." }
];


// <========== Construcción del formulario ==========>

/**
 * Crea el formulario entero desde JS y lo cuelga de <main>.
 *     Por cada campo: un contenedor con su etiqueta, su input y su aviso (oculto). Al final: los botones GUARDAR y RECUPERAR y una zona de mensajes.
 */
function montarFormulario(){
    const main = document.querySelector("main");

    const formulario = document.createElement("form");

    const titulo = document.createElement("h1");
    titulo.textContent = "Alta en la tienda";
    formulario.appendChild(titulo);

    // Un bloque por cada campo.
    for(const campo of campos){
        const contenedor = document.createElement("div");
        contenedor.className = "campo";

        const etiqueta = document.createElement("label");
        etiqueta.textContent = campo.etiqueta;
        etiqueta.setAttribute("for", campo.name + "ID");

        const entrada = document.createElement("input");
        entrada.setAttribute("type", campo.tipo);
        entrada.setAttribute("name", campo.name);
        entrada.setAttribute("id", campo.name + "ID");
        entrada.setAttribute("placeholder", campo.ejemplo);

        const aviso = document.createElement("span");
        aviso.className = "aviso";
        aviso.textContent = campo.aviso;

        contenedor.appendChild(etiqueta);
        contenedor.appendChild(entrada);
        contenedor.appendChild(aviso);

        formulario.appendChild(contenedor);
    }

    // Botones.
    const zonaBotones = document.createElement("div");
    zonaBotones.className = "botones";

    const botonGuardar = document.createElement("button");
    botonGuardar.setAttribute("type", "button");
    botonGuardar.className = "guardar";
    botonGuardar.textContent = "GUARDAR";

    const botonRecuperar = document.createElement("button");
    botonRecuperar.setAttribute("type", "button");
    botonRecuperar.className = "recuperar";
    botonRecuperar.textContent = "RECUPERAR";

    zonaBotones.appendChild(botonGuardar);
    zonaBotones.appendChild(botonRecuperar);
    formulario.appendChild(zonaBotones);

    // Zona donde se escribe el resultado de guardar/recuperar.
    const mensaje = document.createElement("p");
    mensaje.className = "mensaje";
    formulario.appendChild(mensaje);

    main.appendChild(formulario);
}


// <========== Validación ==========>

/**
 * Valida un campo: le pone la clase "error" (rojo) si está mal o se la quita si está bien.
 * Devuelve true/false. El verde NO se pone aquí: solo cuando TODOS son correctos.
 */
function validarCampo(campo){
    const entrada = document.querySelector(`input[name="${campo.name}"]`);
    const valor   = entrada.value;

    let correcto;

    // "password2" no tiene regex: es válido si no está vacío y coincide con la contraseña.
    if(campo.regex === null){
        const passwordValor = document.querySelector(`input[name="password"]`).value;
        correcto = valor !== "" && valor === passwordValor;
    } else correcto = validador.comprobar(campo.regex, valor);

    entrada.classList.remove("valido");

    if(correcto) entrada.classList.remove("error");
    else         entrada.classList.add("error");

    return correcto;
}


/**
 * Valida TODOS los campos. Si todos son correctos, los pinta de verde ("valido").
 * Devuelve true solo cuando no queda ningún campo mal.
 */
function validarTodo(){
    let todoCorrecto = true;

    for(const campo of campos) if(!validarCampo(campo)) todoCorrecto = false;

    if(todoCorrecto) for(const campo of campos) document.querySelector(`input[name="${campo.name}"]`).classList.add("valido");

    return todoCorrecto;
}


// <========== Guardar y recuperar ==========>

// GUARDAR: valida todo. Si está correcto, vuelca los valores en "datosUsuario", lo pasa a JSON y lo guarda en sessionStorage.
function guardar(){
    const mensaje = document.querySelector(".mensaje");

    if(!validarTodo()){
        mensaje.textContent = "Hay campos incorrectos. Corrígelos antes de guardar.";
        mensaje.className = "mensaje error";

        return;
    }

    // Volcamos cada campo al objeto de datos.
    for(const campo of campos) datosUsuario[campo.name] = document.querySelector(`input[name="${campo.name}"]`).value;

    sessionStorage.setItem("datosUsuario", JSON.stringify(datosUsuario));

    mensaje.textContent = "Datos guardados. Recarga la página y pulsa RECUPERAR.";
    mensaje.className = "mensaje exito";
}


// RECUPERAR: lee el JSON de sessionStorage. Si no hay datos, avisa del error. Si los hay, rellena cada input y vuelve a validar para mostrar su estado.
function recuperar(){
    const mensaje  = document.querySelector(".mensaje");
    const guardado = sessionStorage.getItem("datosUsuario");

    // Detección de error al recuperar: no hay nada guardado.
    if(guardado === null){
        mensaje.textContent = "No hay datos guardados en sessionStorage.";
        mensaje.className = "mensaje error";

        return;
    }

    const datos = JSON.parse(guardado);

    // Rellenamos los campos con lo recuperado.
    for(const campo of campos) document.querySelector(`input[name="${campo.name}"]`).value = datos[campo.name] ?? "";

    // Revalidamos: si algún dato recuperado fuera incorrecto, se marcaría en rojo.
    validarTodo();

    mensaje.textContent = "Datos recuperados del sessionStorage.";
    mensaje.className = "mensaje exito";
}


// <========== Eventos e inicio ==========>

/**
 * Monta el formulario y engancha los eventos (solo con addEventListener):
 *     - teclado: "keyup" en cada input para validar mientras se escribe.
 *     - ratón: "click" en los botones GUARDAR y RECUPERAR.
 *     - "submit" del formulario anulado con preventDefault (sin comportamiento por defecto).
 */
function iniciar(){
    montarFormulario();

    // Evento de teclado: validar cada campo al escribir.
    for(const campo of campos){
        const entrada = document.querySelector(`input[name="${campo.name}"]`);

        entrada.addEventListener("keyup", function(){
            validarCampo(campo);

            // Si cambia la contraseña y ya hay algo escrito en "repetir", lo revalidamos.
            if(campo.name === "password"){
                const repetir = document.querySelector(`input[name="password2"]`);
                if(repetir.value !== "") validarCampo(campos[campos.length - 1]);
            }
        });
    }

    // Eventos de ratón: botones.
    document.querySelector(".guardar").addEventListener("click", guardar);
    document.querySelector(".recuperar").addEventListener("click", recuperar);

    // Evitamos el comportamiento por defecto del formulario (envío con Enter, recarga...).
    document.querySelector("form").addEventListener("submit", function(evento){ evento.preventDefault(); });
}


iniciar();