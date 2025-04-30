const productos = [];
let codigo = "";
let idiomaActual = "es";

const traducciones = {
    es: {
        languageLabel: "Idioma",
        languageText: "Español",
        languageTextAlt: "English",
        themeLabel: "Tema",
        themeText: "Claro",
        themeTextAlt: "Oscuro",
        respuesta: "Código de barras",
        fechaText: "Fecha actual"
    },
    en: {
        languageLabel: "Language",
        languageText: "Spanish",
        languageTextAlt: "English",
        themeLabel: "Theme",
        themeText: "Light",
        themeTextAlt: "Dark",
        respuesta: "Barcode",
        fechaText: "Current Date"
    }
};

function parseCSV(text) {
    const lines = text.replace(/\r/g, '').split('\n');
    return lines.map(line => {
        const values = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        return values;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = parseCSV(text);

            const headers = data[0];
            const rows = data.slice(1);

            for (let row of rows) {
                const id = row[headers.indexOf("ID")];
                const nombreEn = row[headers.indexOf("Name (English)")];
                const nombreEs = row[headers.indexOf("Name (Spanish)")];
                const precio = row[headers.indexOf("Price")];
                const imagen = row[headers.indexOf("Image")];

                productos.push([
                    id,
                    { es: nombreEs, en: nombreEn },
                    precio,
                    imagen
                ]);
            }

            document.getElementById("loader").style.display = "none";
            document.getElementById("mainApp").style.display = "block";
            cargarImagenes();
            setInterval(fecha, 1000);

        } catch (err) {
            document.getElementById("fileError").textContent = "Error al leer el archivo.";
            console.error(err);
        }
    });
});


function cargarImagenes() {
    const containerMono = document.getElementById("MonoImgContainer");
    const containerFranco = document.getElementById("FranImgContainer");

    const imgMono = document.createElement("img");
    const imgFran = document.createElement("img");

    imgMono.src = "img/MonoAutorizo.jpg";
    imgMono.alt = "Imagen del Mono";

    imgFran.src = "img/Fran.png";
    imgFran.alt = "Imagen de Fran";

    [imgMono, imgFran].forEach(img => {
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
    });

    containerMono.appendChild(imgMono);
    containerFranco.appendChild(imgFran);

    document.getElementById('language-text-es').classList.add('active');
    document.getElementById('fondo-text-light').classList.add('active');
}

document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
        codigo += event.key;
    } else {
        buscar(codigo);
        codigo = "";
    }
});

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

function cambiarIdioma() {
    const toggle = document.getElementById('language-toggle');
    idiomaActual = toggle.checked ? 'en' : 'es';
    document.documentElement.lang = idiomaActual;

    const t = traducciones[idiomaActual];

    document.getElementById('Respuesta').innerHTML = `
        <img src="./img/barcode.gif" alt="Código de barras" width="50%" height="50%" />
        <br> ${t.respuesta}
    `;
    document.getElementById('fechaText').textContent = t.fechaText;

    document.getElementById('language-text-es').textContent = t.languageText;
    document.getElementById('language-text-en').textContent = t.languageTextAlt;

    document.getElementById('fondo-text-light').textContent = t.themeText;
    document.getElementById('fondo-text-dark').textContent = t.themeTextAlt;

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

    actualizarImagenesFondo(fondo);
}

function actualizarImagenesFondo(fondo) {
    const containerMono = document.getElementById("MonoImgContainer");
    const containerFran = document.getElementById("FranImgContainer");

    containerMono.innerHTML = "";
    containerFran.innerHTML = "";

    const imgMono = document.createElement("img");
    const imgFran = document.createElement("img");

    if (fondo === 'dark') {
        imgMono.src = "img/MonoNoAutorizo.jpg";
        imgFran.src = "img/Fran2.png";
    } else {
        imgMono.src = "img/MonoAutorizo.jpg";
        imgFran.src = "img/Fran.png";
    }

    [imgMono, imgFran].forEach(img => {
        img.alt = "Imagen";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
    });

    containerMono.appendChild(imgMono);
    containerFran.appendChild(imgFran);
}
