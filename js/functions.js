const productos = [];
let codigo = "";
let idiomaActual = "es";


document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const lines = text.trim().split("\n");

            for (let line of lines) {
                const [id, nombreEn, nombreEs, precio, imagen] = line.split(",").map(e => e.trim());
                productos.push([
                    id,
                    { es: nombreEs, en: nombreEn },
                    precio,
                    imagen
                ]);
            }

            document.getElementById("loader").style.display = "none";
            document.getElementById("mainApp").style.display = "block";
            initImages();
            setInterval(fecha, 1000);

        } catch (err) {
            document.getElementById("fileError").textContent = "Error al leer el archivo.";
            console.error(err);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const containerMono = document.getElementById("MonoImgContainer");
    const containerFranco = document.getElementById("FranImgContainer");
    document.getElementById('language-text-es').classList.add('active');
    document.getElementById('fondo-text-light').classList.add('active');

    // Crear imágenes
    const imgMono = document.createElement("img");
    const imgFran = document.createElement("img");

    // Configurar imágenes
    imgMono.src = "img/MonoAutorizo.jpg";
    imgMono.alt = "Imagen del Mono";

    imgFran.src = "img/Fran.png";
    imgFran.alt = "Imagen de Fran";

    // Aplicar estilos consistentes
    [imgMono, imgFran].forEach(img => {
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
    });

    // Agregar imágenes a los contenedores
    containerMono.appendChild(imgMono);
    containerFranco.appendChild(imgFran);
});

document.addEventListener("keydown", (event) => {
    if (event.key != "Enter") {
        codigo += event.key;
    } else {
        buscar(codigo);
        codigo = "";
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const datosEs = await cargarArchivo("data/products_es.txt");
    const datosEn = await cargarArchivo("data/products_en.txt");

    const lineasEs = datosEs.trim().split("\n");
    const lineasEn = datosEn.trim().split("\n");

    for (let i = 0; i < lineasEs.length; i++) {
        const [idEs, nombreEs, precioEs, imagenEs] = lineasEs[i].split(",").map(e => e.trim());
        const [idEn, nombreEn, precioEn, imagenEn] = lineasEn[i].split(",").map(e => e.trim());

        if (idEs !== idEn || precioEs !== precioEn || imagenEs !== imagenEn) {
            console.warn(`Inconsistencia en el producto ${idEs}`);
        }

        productos.push([
            idEs,
            { es: nombreEs, en: nombreEn },
            precioEs,
            imagenEs
        ]);
    }
});

async function cargarArchivo(ruta) {
    const response = await fetch(ruta);
    if (!response.ok) throw new Error(`Error al cargar ${ruta}: ${response.statusText}`);
    return await response.text();
}

function buscar(codigo) {
    let encontrado = false;
    let salida = "";

    for (let i = 0; i < productos.length; i++) {
        if (productos[i][0] === codigo) {
            const nombre = productos[i][1][idiomaActual];
            salida = `
                ID: ${productos[i][0]}<br>
                ${idiomaActual === "es" ? "Producto" : "Product"}: ${nombre}<br>
                ${idiomaActual === "es" ? "Precio" : "Price"}: ${productos[i][2]}<br>
                <img src="./img/${productos[i][3]}" width="100px" height="100px">
            `;
            document.getElementById("Respuesta").innerHTML = salida;
            encontrado = true;
            break;
        }
    }

    if (!encontrado) {
        document.getElementById("Respuesta").innerHTML =
            idiomaActual === "es" ? "Producto no encontrado" : "Product not found";
    }
}


function fecha() {
    const f = new Date();
    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0');
    const anio = f.getFullYear();
    const hora = f.getHours().toString().padStart(2, '0');
    const minutos = f.getMinutes().toString().padStart(2, '0');
    const segundos = f.getSeconds().toString().padStart(2, '0');

    document.getElementById("fecha").innerHTML = `${dia}/${mes}/${anio}, ${hora}:${minutos}:${segundos}`;
}

setInterval(fecha, 0);


function cambiarIdioma() {
    const toggle = document.getElementById('language-toggle');
    idiomaActual = toggle.checked ? 'en' : 'es';
    document.documentElement.lang = idiomaActual;

    const t = traducciones[idiomaActual];

    // Actualizar textos
    document.getElementById('Respuesta').innerHTML = ` 
        <img src="./img/barcode.gif" alt="Código de barras" width="50%" height="50%" />
        <br> ${t.respuesta}
    `;
    document.getElementById('fechaText').textContent = t.fechaText;

    // Actualizar texto del idioma
    document.getElementById('language-text-es').textContent = t.languageText;
    document.getElementById('language-text-en').textContent = t.languageTextAlt;

    // Actualizar texto del fondo
    document.getElementById('fondo-text-light').textContent = t.themeText;
    document.getElementById('fondo-text-dark').textContent = t.themeTextAlt;

    // Actualizar estado visual del switch de idioma
    if (idiomaActual === 'es') {
        document.getElementById('language-text-es').classList.add('active');
        document.getElementById('language-text-en').classList.remove('active');
    } else {
        document.getElementById('language-text-es').classList.remove('active');
        document.getElementById('language-text-en').classList.add('active');
    }
}


function cambiarFondo() {
    const toggle = document.getElementById('fondo-toggle');
    const fondo = toggle.checked ? 'dark' : 'light';
    document.body.className = fondo;

    if (fondo === 'light') {
        document.getElementById('fondo-text-light').classList.add('active');
        document.getElementById('fondo-text-dark').classList.remove('active');
    } else {
        document.getElementById('fondo-text-light').classList.remove('active');
        document.getElementById('fondo-text-dark').classList.add('active');
    }

    const containerMono = document.getElementById("MonoImgContainer");
    const containerFran = document.getElementById("FranImgContainer");

    // Limpiar contenedores
    containerMono.innerHTML = "";
    containerFran.innerHTML = "";

    // Crear nuevas imágenes
    const imgMono = document.createElement("img");
    const imgFran = document.createElement("img");

    // Configurar imágenes según el modo
    if (fondo === 'dark') {
        imgMono.src = "img/MonoNoAutorizo.jpg";
        imgFran.src = "img/Fran2.png";
    } else {
        imgMono.src = "img/MonoAutorizo.jpg";
        imgFran.src = "img/Fran.png";
    }

    // Aplicar estilos consistentes
    [imgMono, imgFran].forEach(img => {
        img.alt = "Imagen";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
    });

    // Agregar imágenes a los contenedores
    containerMono.appendChild(imgMono);
    containerFran.appendChild(imgFran);
}

const traducciones = {
    es: {
        languageLabel: "Idioma",
        languageText: "Español",
        languageTextAlt: "English", // Cambio para "English"
        themeLabel: "Tema",
        themeText: "Claro",
        themeTextAlt: "Oscuro",
        respuesta: "Código de barras",
        fechaText: "Fecha actual"
    },
    en: {
        languageLabel: "Language",
        languageText: "Spanish",
        languageTextAlt: "English", // Cambio para "Español"
        themeLabel: "Theme",
        themeText: "Light",
        themeTextAlt: "Dark",
        respuesta: "Barcode",
        fechaText: "Current Date"
    }
};





