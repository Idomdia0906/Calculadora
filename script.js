// --- CALCULADORA DE PRÉSTAMOS by Ignacio Dominguez Diaz--- //

document.addEventListener("DOMContentLoaded", () => {
  // --- Referencias a elementos del DOM ---
  const cantidadInput = document.getElementById("cantidad");
  const plazoInput = document.getElementById("plazo");
  const interesInput = document.getElementById("interes");
  const tipoPlazoSelect = document.getElementById("tipoPlazo");

  const ingresosInput = document.getElementById("ingresos");
  const deudasInput = document.getElementById("deudas");

  const cantidadMenos = document.getElementById("cantidadMenos");
  const cantidadMas = document.getElementById("cantidadMas");
  const plazoMenos = document.getElementById("plazoMenos");
  const plazoMas = document.getElementById("plazoMas");
  const interesMenos = document.getElementById("interesMenos");
  const interesMas = document.getElementById("interesMas");

  const calcularBtn = document.getElementById("calcularBtn");
  const limpiarBtn = document.getElementById("limpiarBtn");

  const resultadosSection = document.getElementById("resultados");
  const cuotaMensualEl = document.getElementById("cuotaMensual");
  const interesesTotalesEl = document.getElementById("interesesTotales");
  const costeTotalEl = document.getElementById("costeTotal");
  const cantidadSolicitadaEl = document.getElementById("cantidadSolicitada");
  const interesAnualEl = document.getElementById("interesAnual");
  const plazoTotalTextoEl = document.getElementById("plazoTotalTexto");
  const cuotaMensualTextoEl = document.getElementById("cuotaMensualTexto");
  const mesesTotalesTextoEl = document.getElementById("mesesTotalesTexto");
  const interesesTotalesTextoEl = document.getElementById("interesesTotalesTexto");

  const tasaSimpleEl = document.getElementById("tasaSimpleValor");
  const tasaCompletaEl = document.getElementById("tasaCompletaValor");
  const textoRiesgoEl = document.getElementById("textoRiesgo");

  const simpleCard = document.getElementById("tasaSimpleCard");
  const completaCard = document.getElementById("tasaCompletaCard");
  const explicacionTasaCompleta = document.getElementById("explicacionTasaCompleta");

  // --- Valores iniciales ---
  cantidadInput.value = "10000";
  plazoInput.value = "5";
  interesInput.value = "3.5";
  tipoPlazoSelect.value = "años";
  ingresosInput.value = "";
  deudasInput.value = "";

  // Ocultar tarjetas al inicio
  if (simpleCard) simpleCard.style.display = "none";
  if (completaCard) completaCard.style.display = "none";

  // --- Helpers ---
  // FORMATEAR EUROS CORRECTAMENTE
  function formatearEuros(valor) {
    if (isNaN(valor) || valor === null) return "0,00 €";
    return valor
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
  }
  // -----------------------------------------
  // FORMATEADOR CON PUNTOS (SOLO MILES)
  // -----------------------------------------
  function formatearMiles(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // -----------------------------------------
  // LIMPIAR → QUITAR PUNTOS Y COMAS
  // -----------------------------------------
  function limpiarNumero(str) {
    if (!str) return 0;
    return parseInt(str.replace(/[^\d]/g, "")) || 0;
  }

  // -----------------------------------------
  // OBTENER NÚMERO REAL DESDE EL INPUT
  // -----------------------------------------
  function numeroSeguroFromInput(inputEl) {
    return limpiarNumero(inputEl.value);
  }

  // -----------------------------------------
  // ACTUALIZAR INPUT CON FORMATO
  // -----------------------------------------
  function actualizarInput(input, valor) {
    const numeroLimpio = limpiarNumero(valor.toString());
    input.value = formatearMiles(numeroLimpio);
  }

  // -----------------------------------------
  // BOTONES + Y –
  // -----------------------------------------
  function incrementar(campo) {
    if (campo === "cantidad") {
      const valor = numeroSeguroFromInput(cantidadInput);
      actualizarInput(cantidadInput, valor + 1000);
    } else if (campo === "plazo") {
      const valor = numeroSeguroFromInput(plazoInput);
      plazoInput.value = valor + 1;
    } else if (campo === "interes") {
      const valor = parseFloat(interesInput.value.replace(",", "."));
      interesInput.value = (valor + 0.1).toFixed(1);
    }
  }

  function decrementar(campo) {
    if (campo === "cantidad") {
      const valor = numeroSeguroFromInput(cantidadInput);
      actualizarInput(cantidadInput, Math.max(0, valor - 1000));
    } else if (campo === "plazo") {
      const valor = numeroSeguroFromInput(plazoInput);
      plazoInput.value = Math.max(1, valor - 1);
    } else if (campo === "interes") {
      const valor = parseFloat(interesInput.value.replace(",", "."));
      interesInput.value = Math.max(0, valor - 0.1).toFixed(1);
    }
  }

  // --- Cálculo del préstamo ---
  function calcularPrestamo() {
    const P = numeroSeguroFromInput(cantidadInput);
    const tasaAnual = parseFloat(interesInput.value.replace(",", "."));
    const plazoValor = parseInt(plazoInput.value.replace(/[^\d]/g, "")) || 0;
    const tipoPlazo = tipoPlazoSelect.value;

    if (!P || P <= 0) {
      alert("Por favor, introduce una cantidad válida.");
      return null;
    }
    if (isNaN(tasaAnual) || tasaAnual < 0) {
      alert("Por favor, introduce un interés válido.");
      return null;
    }
    if (!plazoValor || plazoValor <= 0) {
      alert("Por favor, introduce un plazo válido.");
      return null;
    }

    const n = tipoPlazo === "años" ? plazoValor * 12 : plazoValor;
    let cuota, totalPagado, intereses;

    if (tasaAnual === 0) {
      cuota = P / n;
      totalPagado = P;
      intereses = 0;
    } else {
      const r = tasaAnual / 12 / 100;
      cuota = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      totalPagado = cuota * n;
      intereses = totalPagado - P;
    }

    cuotaMensualEl.textContent = formatearEuros(cuota);
    interesesTotalesEl.textContent = formatearEuros(intereses);
    costeTotalEl.textContent = formatearEuros(totalPagado);

    cantidadSolicitadaEl.textContent = formatearEuros(P);
    interesAnualEl.textContent = `${tasaAnual}%`;

    const mesesTotales = n;
    const textoPlazo =
      tipoPlazo === "años"
        ? `${plazoValor} años (${mesesTotales} meses)`
        : `${plazoValor} meses`;

    plazoTotalTextoEl.textContent = textoPlazo;

    cuotaMensualTextoEl.textContent = ` ${formatearEuros(cuota)} `;
    mesesTotalesTextoEl.textContent = ` ${mesesTotales} meses `;
    interesesTotalesTextoEl.textContent = ` ${formatearEuros(intereses)} `;

    resultadosSection.classList.add("visible");
    resultadosSection.setAttribute("aria-hidden", "false");

    return cuota;
  }

  // --- Tasa de esfuerzo ---
  function calcularTasaSimple(cuota, ingresos) {
    if (ingresos <= 0 || cuota <= 0) return 0;
    return (cuota / ingresos) * 100;
  }

  function calcularTasaCompleta(cuota, ingresos, deudas) {
    if (ingresos <= 0 || cuota <= 0) return 0;
    return ((deudas + cuota) / ingresos) * 100;
  }

  function colorRiesgo(tasa) {
    if (tasa === 0) return "#6b7280";
    if (tasa < 30) return "var(--verde-esfuerzo)";
    if (tasa < 40) return "var(--amarillo-esfuerzo)";
    if (tasa < 50) return "var(--naranja-esfuerzo)";
    return "var(--rojo-esfuerzo)";
  }

  function textoRiesgo(tasa) {
    if (tasa === 0) return "Introduce ingresos y deudas para evaluar tu tasa de esfuerzo.";
    if (tasa < 30) return "Nivel de endeudamiento saludable.";
    if (tasa < 40) return "Capacidad aceptable. Se recomienda analizar estabilidad laboral.";
    if (tasa < 50) return "Riesgo elevado. Este préstamo puede comprometer tu economía.";
    return "Riesgo MUY ALTO. No se recomienda asumir este préstamo.";
  }

  function calcularTasaEsfuerzo(cuota) {
    const ingresos = numeroSeguroFromInput(ingresosInput);
    const deudas = numeroSeguroFromInput(deudasInput);

    // Sin ingresos → no mostrar nada
    if (!ingresos || ingresos <= 0) {
      simpleCard.style.display = "none";
      completaCard.style.display = "none";
      tasaSimpleEl.textContent = "0 %";
      tasaCompletaEl.textContent = "0 %";
      textoRiesgoEl.textContent = "";
      explicacionTasaCompleta.textContent = "";
      return;
    }

    // Solo ingresos → mostrar solo simple
    if (ingresos > 0 && (!deudas || deudas <= 0)) {
      const tasaSimple = calcularTasaSimple(cuota, ingresos);
      simpleCard.style.display = "block";
      completaCard.style.display = "none";

      tasaSimpleEl.textContent = `${tasaSimple.toFixed(1)} %`;
      tasaSimpleEl.style.color = colorRiesgo(tasaSimple);
      textoRiesgoEl.textContent = "Introduce deudas para calcular la tasa completa";
      explicacionTasaCompleta.textContent = "";
      return;
    }

    // Ingresos + deudas → mostrar ambas
    const tasaSimple = calcularTasaSimple(cuota, ingresos);
    const tasaCompleta = calcularTasaCompleta(cuota, ingresos, deudas);

    simpleCard.style.display = "block";
    completaCard.style.display = "block";

    tasaSimpleEl.textContent = `${tasaSimple.toFixed(1)} %`;
    tasaSimpleEl.style.color = colorRiesgo(tasaSimple);

    tasaCompletaEl.textContent = `${tasaCompleta.toFixed(1)} %`;
    tasaCompletaEl.style.color = colorRiesgo(tasaCompleta);

    textoRiesgoEl.textContent = textoRiesgo(tasaCompleta);

    explicacionTasaCompleta.textContent =
      `(${formatearMiles(deudas)} € de deudas + ${formatearMiles(Math.round(cuota))} € de cuota) / ${formatearMiles(ingresos)} € de ingresos`;
  }

  function limpiarTodo() {
    cantidadInput.value = "10000";
    plazoInput.value = "5";
    interesInput.value = "3.5";
    tipoPlazoSelect.value = "años";
    ingresosInput.value = "";
    deudasInput.value = "";

    resultadosSection.classList.remove("visible");
    resultadosSection.setAttribute("aria-hidden", "true");

    simpleCard.style.display = "none";
    completaCard.style.display = "none";

    tasaSimpleEl.textContent = "0 %";
    tasaSimpleEl.style.color = "#6b7280";
    tasaCompletaEl.textContent = "0 %";
    tasaCompletaEl.style.color = "#6b7280";
    textoRiesgoEl.textContent = "";
    explicacionTasaCompleta.textContent = "";
  }

  // --- Formateo automático de inputs ---
  [cantidadInput, ingresosInput, deudasInput].forEach((input) => {
    input.addEventListener("input", () => {
      actualizarInput(input, input.value);
    });
  });

  // --- Eventos de botones + / - ---
  cantidadMas.addEventListener("click", () => incrementar("cantidad"));
  cantidadMenos.addEventListener("click", () => decrementar("cantidad"));
  plazoMas.addEventListener("click", () => incrementar("plazo"));
  plazoMenos.addEventListener("click", () => decrementar("plazo"));
  interesMas.addEventListener("click", () => incrementar("interes"));
  interesMenos.addEventListener("click", () => decrementar("interes"));

  // --- Calcular / Limpiar ---
  calcularBtn.addEventListener("click", () => {
    const cuota = calcularPrestamo();
    if (cuota !== null) calcularTasaEsfuerzo(cuota);
  });

  limpiarBtn.addEventListener("click", limpiarTodo);
});