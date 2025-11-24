// --- CALCULADORA DE PRÉSTAMOS by Ignacio Dominguez Diaz--- //
// --- Refactorizado por Gemini --- //

document.addEventListener("DOMContentLoaded", () => {
  // --- Referencias a elementos del DOM ---

  // Tarjeta 1: Datos
  const cantidadCompraInput = document.getElementById("cantidadCompra");
  const cantidadInput = document.getElementById("cantidad");
  const plazoInput = document.getElementById("plazo");
  const interesInput = document.getElementById("interes");
  const tipoPlazoSelect = document.getElementById("tipoPlazo");
  const tipoITPSelect = document.getElementById("tipoITP");
  
  const porcentajeFinanciacionEl = document.getElementById("porcentajeFinanciacion");

  // Tarjeta 2: Situación
  const ingresosInput = document.getElementById("ingresos");
  const deudasInput = document.getElementById("deudas");
  
  // Botones +/-
  const cantidadCompraMenos = document.getElementById("cantidadCompraMenos");
  const cantidadCompraMas = document.getElementById("cantidadCompraMas");
  const cantidadMenos = document.getElementById("cantidadMenos");
  const cantidadMas = document.getElementById("cantidadMas");
  const plazoMenos = document.getElementById("plazoMenos");
  const plazoMas = document.getElementById("plazoMas");
  const interesMenos = document.getElementById("interesMenos");
  const interesMas = document.getElementById("interesMas");

  // Sliders (NUEVO)
  const rangeCompra = document.getElementById("rangeCompra");
  const rangePrestamo = document.getElementById("rangePrestamo");
  const rangePlazo = document.getElementById("rangePlazo");
  const rangeInteres = document.getElementById("rangeInteres");

  // Botones Acción
  const calcularBtn = document.getElementById("calcularBtn");
  const limpiarBtn = document.getElementById("limpiarBtn");

  // Tarjetas de Resultados
  const resultadosSection = document.getElementById("resultados");
  
  // -- Cuota
  const cuotaMensualEl = document.getElementById("cuotaMensual");
  const interesesTotalesEl = document.getElementById("interesesTotales");
  const costeTotalEl = document.getElementById("costeTotal");
  
  // -- Desglose
  const cantidadSolicitadaEl = document.getElementById("cantidadSolicitada");
  const interesAnualEl = document.getElementById("interesAnual");
  const plazoTotalTextoEl = document.getElementById("plazoTotalTexto");
  const cuotaMensualTextoEl = document.getElementById("cuotaMensualTexto");
  const mesesTotalesTextoEl = document.getElementById("mesesTotalesTexto");
  const interesesTotalesTextoEl = document.getElementById("interesesTotalesTexto");

  // -- Gastos (Nueva)
  const gastosCard = document.getElementById("gastosCard");
  const itpTipoTextoEl = document.getElementById("itpTipoTexto");
  const gastoITPEl = document.getElementById("gastoITP");
  const gastoNotariaEl = document.getElementById("gastoNotaria");
  const gastoRegistroEl = document.getElementById("gastoRegistro");
  const gastoGestoriaEl = document.getElementById("gastoGestoria");
  const gastoTasacionEl = document.getElementById("gastoTasacion");
  const gastoHogarEl = document.getElementById("gastoHogar");
  const seguroVidaInput = document.getElementById("seguroVidaInput");
  const gastoTotalEl = document.getElementById("gastoTotal");

  // -- Tasa Esfuerzo
  const tasaSimpleEl = document.getElementById("tasaSimpleValor");
  const tasaCompletaEl = document.getElementById("tasaCompletaValor");
  const textoRiesgoEl = document.getElementById("textoRiesgo");
  const simpleCard = document.getElementById("tasaSimpleCard");
  const completaCard = document.getElementById("tasaCompletaCard");
  const explicacionTasaCompleta = document.getElementById("explicacionTasaCompleta");

  // --- Variables para guardar gastos base ---
  let gITP = 0;
  let gNotaria = 0;
  let gRegistro = 0;

  // --- Valores iniciales ---
  cantidadCompraInput.value = "100000";
  cantidadInput.value = "80000";
  plazoInput.value = "5";
  interesInput.value = "3.50"; 
  tipoPlazoSelect.value = "años";
  tipoITPSelect.value = "3.5";
  ingresosInput.value = "";
  deudasInput.value = "";
  seguroVidaInput.value = "";
  
  // Inicializar sliders con los valores por defecto
  rangeCompra.value = 100000;
  rangePrestamo.value = 80000;
  rangePlazo.value = 5;
  rangeInteres.value = 3.5;

  // Ocultar tarjetas al inicio
  if (gastosCard) gastosCard.style.display = "none";
  if (simpleCard) simpleCard.style.display = "none";
  if (completaCard) completaCard.style.display = "none";

  // --- Helpers ---
  function formatearEuros(valor) {
    if (isNaN(valor) || valor === null) return "0,00 €";
    return (
      valor
        .toFixed(2)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €"
    );
  }
  function formatearMiles(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function limpiarNumero(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/[^\d.]/g, "").replace(/\./g, "").replace(",", ".")) || 0;
  }
  
  // Versión específica para enteros (dinero)
  function limpiarNumeroEntero(str) {
      if (!str) return 0;
      return parseInt(str.toString().replace(/[^\d]/g, "")) || 0;
  }

  function numeroSeguroFromInput(inputEl) {
    // Para el interés necesitamos decimales, para el resto enteros
    if (inputEl.id === 'interes') {
        return parseFloat(inputEl.value.replace(",", ".")) || 0;
    }
    return limpiarNumeroEntero(inputEl.value);
  }

  function actualizarInput(input, valor) {
    // Si es interés, formato con decimales
    if (input.id === 'interes') {
        input.value = parseFloat(valor).toFixed(2);
    } else {
        const numeroLimpio = parseInt(valor);
        input.value = formatearMiles(numeroLimpio);
    }
  }

  // --- Cálculo dinámico de % ---
  function calcularPorcentajeFinanciacion() {
    const compra = numeroSeguroFromInput(cantidadCompraInput);
    const prestamo = numeroSeguroFromInput(cantidadInput);
    
    if (compra <= 0 || prestamo <= 0) {
      porcentajeFinanciacionEl.textContent = "0 %";
      return;
    }
    
    const porcentaje = (prestamo / compra) * 100;
    porcentajeFinanciacionEl.textContent = `${porcentaje.toFixed(1)} %`;
  }
  // Calcular al inicio
  calcularPorcentajeFinanciacion();


  // --- FUNCIONES DE SINCRONIZACIÓN (Input <-> Slider) ---
  
  function syncSliderToInput(slider, input) {
      const val = numeroSeguroFromInput(input);
      slider.value = val;
  }
  
  function syncInputToSlider(input, slider) {
      const val = slider.value;
      actualizarInput(input, val);
      // Recalcular % dinámico si aplica
      if (input.id === "cantidadCompra" || input.id === "cantidad") {
        calcularPorcentajeFinanciacion();
      }
  }


  // --- Botones + y – ---
  function incrementar(campo) {
    if (campo === "cantidadCompra") {
      const valor = numeroSeguroFromInput(cantidadCompraInput);
      const nuevoValor = valor + 1000;
      actualizarInput(cantidadCompraInput, nuevoValor);
      rangeCompra.value = nuevoValor; // Sync slider
    } else if (campo === "cantidad") {
      const valor = numeroSeguroFromInput(cantidadInput);
      const nuevoValor = valor + 1000;
      actualizarInput(cantidadInput, nuevoValor);
      rangePrestamo.value = nuevoValor; // Sync slider
    } else if (campo === "plazo") {
      const valor = numeroSeguroFromInput(plazoInput);
      const nuevoValor = valor + 1;
      plazoInput.value = nuevoValor;
      rangePlazo.value = nuevoValor; // Sync slider
    } else if (campo === "interes") {
      const valor = parseFloat(interesInput.value.replace(",", "."));
      const nuevoValor = (valor + 0.05).toFixed(2);
      interesInput.value = nuevoValor;
      rangeInteres.value = nuevoValor; // Sync slider
    }
    
    if (campo === "cantidadCompra" || campo === "cantidad") {
      calcularPorcentajeFinanciacion();
    }
  }

  function decrementar(campo) {
    if (campo === "cantidadCompra") {
      const valor = numeroSeguroFromInput(cantidadCompraInput);
      const nuevoValor = Math.max(0, valor - 1000);
      actualizarInput(cantidadCompraInput, nuevoValor);
      rangeCompra.value = nuevoValor; // Sync slider
    } else if (campo === "cantidad") {
      const valor = numeroSeguroFromInput(cantidadInput);
      const nuevoValor = Math.max(0, valor - 1000);
      actualizarInput(cantidadInput, nuevoValor);
      rangePrestamo.value = nuevoValor; // Sync slider
    } else if (campo === "plazo") {
      const valor = numeroSeguroFromInput(plazoInput);
      const nuevoValor = Math.max(1, valor - 1);
      plazoInput.value = nuevoValor;
      rangePlazo.value = nuevoValor; // Sync slider
    } else if (campo === "interes") {
      const valor = parseFloat(interesInput.value.replace(",", "."));
      const nuevoValor = Math.max(0, valor - 0.05).toFixed(2);
      interesInput.value = nuevoValor;
      rangeInteres.value = nuevoValor; // Sync slider
    }
    
    if (campo === "cantidadCompra" || campo === "cantidad") {
      calcularPorcentajeFinanciacion();
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

    // Actualizar resultados de Préstamo
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

  // --- Cálculo dinámico de Total de Gastos ---
  function actualizarTotalGastos() {
    const seguroVida = numeroSeguroFromInput(seguroVidaInput);
    const gastoGestoria = 500;
    const gastoTasacion = 500;
    const gastoHogar = 200;
    
    // Suma usando las variables globales (gITP, etc.) y los valores fijos
    const totalGastos = gITP + gNotaria + gRegistro + gastoGestoria + gastoTasacion + gastoHogar + seguroVida;
    gastoTotalEl.textContent = formatearEuros(totalGastos);
  }

  // --- Cálculo de Gastos ---
  function calcularGastos() {
    const compra = numeroSeguroFromInput(cantidadCompraInput);
    if (compra <= 0) {
      alert("Por favor, introduce una 'Cantidad de compra' válida.");
      return false; 
    }
    
    const itpPorcentaje = parseFloat(tipoITPSelect.value);
    
    // Cálculos y asignación a variables globales
    gITP = compra * (itpPorcentaje / 100);
    gNotaria = compra * 0.01; // 1% de la compra
    gRegistro = gNotaria * 0.8; // 80% de notaría
    const gastoGestoria = 500;
    const gastoTasacion = 500;
    const gastoHogar = 200;
    
    // Actualizar DOM
    itpTipoTextoEl.textContent = `${itpPorcentaje}%`;
    gastoITPEl.textContent = formatearEuros(gITP);
    gastoNotariaEl.textContent = formatearEuros(gNotaria);
    gastoRegistroEl.textContent = formatearEuros(gRegistro);
    gastoGestoriaEl.textContent = formatearEuros(gastoGestoria);
    gastoTasacionEl.textContent = formatearEuros(gastoTasacion);
    gastoHogarEl.textContent = formatearEuros(gastoHogar);

    gastosCard.style.display = "block";
    
    // Llamar a la función que calcula el total
    actualizarTotalGastos(); 
    return true; 
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

  function actualizarClaseRiesgo(elemento, tasa) {
    elemento.classList.remove(
      "saludable",
      "aceptable",
      "elevado",
      "muy-alto"
    );
    if (tasa === 0) return; 
    if (tasa < 30) {
      elemento.classList.add("saludable");
    } else if (tasa < 40) {
      elemento.classList.add("aceptable");
    } else if (tasa < 50) {
      elemento.classList.add("elevado");
    } else {
      elemento.classList.add("muy-alto");
    }
  }

  function textoRiesgo(tasa) {
    if (tasa === 0)
      return "Introduce ingresos y deudas para evaluar tu tasa de esfuerzo.";
    if (tasa < 30) return "Nivel de endeudamiento saludable.";
    if (tasa < 40)
      return "Capacidad aceptable. Se recomienda analizar estabilidad laboral.";
    if (tasa < 50)
      return "Riesgo elevado. Este préstamo puede comprometer tu economía.";
    return "Riesgo MUY ALTO. No se recomienda asumir este préstamo.";
  }

  function calcularTasaEsfuerzo(cuota) {
    const ingresos = numeroSeguroFromInput(ingresosInput);
    const deudas = numeroSeguroFromInput(deudasInput);

    actualizarClaseRiesgo(tasaSimpleEl, 0);
    actualizarClaseRiesgo(tasaCompletaEl, 0);
    actualizarClaseRiesgo(textoRiesgoEl, 0);

    if (!ingresos || ingresos <= 0) {
      simpleCard.style.display = "none";
      completaCard.style.display = "none";
      tasaSimpleEl.textContent = "0 %";
      tasaCompletaEl.textContent = "0 %";
      textoRiesgoEl.textContent = "";
      explicacionTasaCompleta.textContent = "";
      return;
    }

    if (ingresos > 0 && (!deudas || deudas <= 0)) {
      const tasaSimple = calcularTasaSimple(cuota, ingresos);
      simpleCard.style.display = "block";
      completaCard.style.display = "none";

      tasaSimpleEl.textContent = `${tasaSimple.toFixed(1)} %`;
      actualizarClaseRiesgo(tasaSimpleEl, tasaSimple); 

      textoRiesgoEl.textContent =
        "Introduce deudas para calcular la tasa completa";
      explicacionTasaCompleta.textContent = "";
      return;
    }

    const tasaSimple = calcularTasaSimple(cuota, ingresos);
    const tasaCompleta = calcularTasaCompleta(cuota, ingresos, deudas);

    simpleCard.style.display = "block";
    completaCard.style.display = "block";

    tasaSimpleEl.textContent = `${tasaSimple.toFixed(1)} %`;
    actualizarClaseRiesgo(tasaSimpleEl, tasaSimple); 

    tasaCompletaEl.textContent = `${tasaCompleta.toFixed(1)} %`;
    actualizarClaseRiesgo(tasaCompletaEl, tasaCompleta); 

    textoRiesgoEl.textContent = textoRiesgo(tasaCompleta);
    actualizarClaseRiesgo(textoRiesgoEl, tasaCompleta); 

    explicacionTasaCompleta.textContent = `(${formatearMiles(
      deudas
    )} € de deudas + ${formatearMiles(
      Math.round(cuota)
    )} € de cuota) / ${formatearMiles(ingresos)} € de ingresos`;
  }

  // --- Limpiar todo ---
  function limpiarTodo() {
    cantidadCompraInput.value = "100000";
    cantidadInput.value = "80000";
    plazoInput.value = "5";
    interesInput.value = "3.50";
    tipoPlazoSelect.value = "años";
    tipoITPSelect.value = "3.5";
    ingresosInput.value = "";
    deudasInput.value = "";
    seguroVidaInput.value = "";
    
    // Resetear sliders
    rangeCompra.value = 100000;
    rangePrestamo.value = 80000;
    rangePlazo.value = 5;
    rangeInteres.value = 3.5;

    resultadosSection.classList.remove("visible");
    resultadosSection.setAttribute("aria-hidden", "true");

    gastosCard.style.display = "none";
    simpleCard.style.display = "none";
    completaCard.style.display = "none";

    // Resetear gastos
    gITP = 0;
    gNotaria = 0;
    gRegistro = 0;
    actualizarTotalGastos(); // Pone el total a 0,00 €

    tasaSimpleEl.textContent = "0 %";
    actualizarClaseRiesgo(tasaSimpleEl, 0);
    tasaCompletaEl.textContent = "0 %";
    actualizarClaseRiesgo(tasaCompletaEl, 0);
    textoRiesgoEl.textContent = "";
    actualizarClaseRiesgo(textoRiesgoEl, 0);
    explicacionTasaCompleta.textContent = "";
    
    calcularPorcentajeFinanciacion();
  }

  // --- Formateo automático de inputs ---
  // También sincronizamos con el slider aquí
  
  cantidadCompraInput.addEventListener("input", () => {
    actualizarInput(cantidadCompraInput, cantidadCompraInput.value);
    syncSliderToInput(rangeCompra, cantidadCompraInput);
    calcularPorcentajeFinanciacion();
  });
  
  cantidadInput.addEventListener("input", () => {
    actualizarInput(cantidadInput, cantidadInput.value);
    syncSliderToInput(rangePrestamo, cantidadInput);
    calcularPorcentajeFinanciacion();
  });
  
  plazoInput.addEventListener("input", () => {
    // El plazo no lleva miles, solo validación
    syncSliderToInput(rangePlazo, plazoInput);
  });
  
  interesInput.addEventListener("input", () => {
      // El interes no lleva miles
      syncSliderToInput(rangeInteres, interesInput);
  });

  [ingresosInput, deudasInput, seguroVidaInput].forEach((input) => {
    input.addEventListener("input", () => {
      actualizarInput(input, input.value);
    });
  });
  
  // --- Eventos de los SLIDERS (NUEVO) ---
  rangeCompra.addEventListener("input", () => {
      syncInputToSlider(cantidadCompraInput, rangeCompra);
  });
  rangePrestamo.addEventListener("input", () => {
      syncInputToSlider(cantidadInput, rangePrestamo);
  });
  rangePlazo.addEventListener("input", () => {
      plazoInput.value = rangePlazo.value;
  });
  rangeInteres.addEventListener("input", () => {
      interesInput.value = parseFloat(rangeInteres.value).toFixed(2);
  });


  // Evento para total de gastos dinámico
  seguroVidaInput.addEventListener("input", actualizarTotalGastos);


  // --- Eventos de botones + / - ---
  cantidadCompraMas.addEventListener("click", () => incrementar("cantidadCompra"));
  cantidadCompraMenos.addEventListener("click", () => decrementar("cantidadCompra"));
  cantidadMas.addEventListener("click", () => incrementar("cantidad"));
  cantidadMenos.addEventListener("click", () => decrementar("cantidad"));
  plazoMas.addEventListener("click", () => incrementar("plazo"));
  plazoMenos.addEventListener("click", () => decrementar("plazo"));
  interesMas.addEventListener("click", () => incrementar("interes"));
  interesMenos.addEventListener("click", () => decrementar("interes"));

  // --- Calcular / Limpiar ---
  calcularBtn.addEventListener("click", () => {
    const cuota = calcularPrestamo();
    if (cuota !== null) {
      const gastosOk = calcularGastos(); // Calcula gastos y guarda los valores base
      if (gastosOk) {
        calcularTasaEsfuerzo(cuota); // Solo calcula la tasa si los gastos son válidos
      }
    }
  });

  limpiarBtn.addEventListener("click", limpiarTodo);

  // --- SEGURIDAD BÁSICA (Bloqueo de click derecho e inspector) ---

  // 1. Bloquear el click derecho
  document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });

  // 2. Bloquear atajos de teclado comunes para inspeccionar
  document.addEventListener('keydown', function(event) {
    // F12
    if (event.key === 'F12') {
      event.preventDefault();
    }
    // Ctrl+Shift+I (Inspector)
    if (event.ctrlKey && event.shiftKey && event.key === 'I') {
      event.preventDefault();
    }
    // Ctrl+Shift+J (Consola)
    if (event.ctrlKey && event.shiftKey && event.key === 'J') {
      event.preventDefault();
    }
    // Ctrl+Shift+C (Seleccionar elemento)
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
      event.preventDefault();
    }
    // Ctrl+U (Ver código fuente)
    if (event.ctrlKey && event.key === 'u') {
      event.preventDefault();
    }
  });

});