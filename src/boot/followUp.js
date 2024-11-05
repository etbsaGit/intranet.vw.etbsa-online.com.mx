export function getNumber(name) {
  let number;
  let label;
  let color;
  let value;

  switch (name) {
    case "Sin certeza":
      number = 0.01;
      label = "1%";
      value = 1;
      color = "red-6";
      break;
    case "Solicito informacion":
      number = 0.1;
      label = "10%";
      value = 10;
      color = "red-8";
      break;
    case "Interesado":
      number = 0.2;
      label = "20%";
      value = 20;
      color = "red-10";
      break;
    case "Cotizacion":
      number = 0.3;
      label = "30%";
      value = 30;
      color = "orange-8";
      break;
    case "Segundo contacto":
      number = 0.4;
      label = "40%";
      value = 40;
      color = "orange-10";
      break;
    case "Negociacion":
      number = 0.5;
      label = "50%";
      value = 50;
      color = "amber-8";
      break;
    case "Cotizacion formalizada":
      number = 0.6;
      label = "60%";
      value = 60;
      color = "amber-10";
      break;
    case "Envio de documentos":
      number = 0.7;
      label = "70%";
      value = 70;
      color = "yellow-8";
      break;
    case "Documentacion (Para compra o financiamiento)":
      number = 0.8;
      label = "80%";
      value = 80;
      color = "lime-8";
      break;
    case "Cierre de venta":
      number = 0.9;
      label = "90%";
      value = 90;
      color = "light-green-8";
      break;
    case "Entregado":
      number = 1;
      label = "100%";
      value = 100;
      color = "light-green-10";
      break;
    default:
      number = 0;
      label = "0%";
      value = 0;
      color = "black";
      break;
  }

  return { number, label, color, value };
}

export function getStatus(name) {
  let color;

  switch (name) {
    case "Activo":
      color = "blue-10";
      break;
    case "Venta ganada":
      color = "green-10";
      break;
    case "Venta perdida":
      color = "red-6";
      break;

    default:
      color = "white";
      break;
  }

  return { color };
}
