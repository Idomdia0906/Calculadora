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

  // Sliders
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

  // -- Gastos
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

  // -- Historial (NUEVO)
  const historialCard = document.getElementById("historialCard");
  const listaHistorial = document.getElementById("listaHistorial");
  const borrarHistorialBtn = document.getElementById("borrarHistorialBtn");

  // --- Variables globales ---
  let gITP = 0;
  let gNotaria = 0;
  let gRegistro = 0;
  
  let intervaloRepeticion = null;
  let timeoutInicio = null;

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
  
  // Inicializar sliders
  rangeCompra.value = 100000;
  rangePrestamo.value = 80000;
  rangePlazo.value = 5;
  rangeInteres.value = 3.5;

  // Ocultar tarjetas al inicio
  if (gastosCard) gastosCard.style.display = "none";
  if (simpleCard) simpleCard.style.display = "none";
  if (completaCard) completaCard.style.display = "none";
  if (historialCard) {
      historialCard.style.display = "none";
      cargarHistorial(); // Cargar si existe al inicio
  }

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
  
  function limpiarNumeroEntero(str) {
      if (!str) return 0;
      return parseInt(str.toString().replace(/[^\d]/g, "")) || 0;
  }

  function numeroSeguroFromInput(inputEl) {
    if (inputEl.id === 'interes') {
        return parseFloat(inputEl.value.replace(",", ".")) || 0;
    }
    return limpiarNumeroEntero(inputEl.value);
  }

  function actualizarInput(input, valor) {
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
  calcularPorcentajeFinanciacion();

  // --- Sincronización Slider <-> Input ---
  function syncSliderToInput(slider, input) {
      const val = numeroSeguroFromInput(input);
      slider.value = val;
  }
  
  function syncInputToSlider(input, slider) {
      const val = slider.value;
      actualizarInput(input, val);
      if (input.id === "cantidadCompra" || input.id === "cantidad") {
        calcularPorcentajeFinanciacion();
      }
  }

  // --- Lógica de Incremento / Decremento ---
  function incrementar(campo) {
    if (campo === "cantidadCompra") {
      const valor = numeroSeguroFromInput(cantidadCompraInput);
      const nuevoValor = valor + 1000;
      actualizarInput(cantidadCompraInput, nuevoValor);
      rangeCompra.value = nuevoValor; 
    } else if (campo === "cantidad") {
      const valor = numeroSeguroFromInput(cantidadInput);
      const nuevoValor = valor + 1000;
      actualizarInput(cantidadInput, nuevoValor);
      rangePrestamo.value = nuevoValor; 
    } else if (campo === "plazo") {
      const valor = numeroSeguroFromInput(plazoInput);
      const nuevoValor = valor + 1;
      plazoInput.value = nuevoValor;
      rangePlazo.value = nuevoValor; 
    } else if (campo === "interes") {
      const valor = parseFloat(interesInput.value.replace(",", "."));
      const nuevoValor = (valor + 0.05).toFixed(2);
      interesInput.value = nuevoValor;
      rangeInteres.value = nuevoValor; 
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
      rangeCompra.value = nuevoValor; 
    } else if (campo === "cantidad") {
      const valor = numeroSeguroFromInput(cantidadInput);
      const nuevoValor = Math.max(0, valor - 1000);
      actualizarInput(cantidadInput, nuevoValor);
      rangePrestamo.value = nuevoValor; 
    } else if (campo === "plazo") {
      const valor = numeroSeguroFromInput(plazoInput);
      const nuevoValor = Math.max(1, valor - 1);
      plazoInput.value = nuevoValor;
      rangePlazo.value = nuevoValor; 
    } else if (campo === "interes") {
      const valor = parseFloat(interesInput.value.replace(",", "."));
      const nuevoValor = Math.max(0, valor - 0.05).toFixed(2);
      interesInput.value = nuevoValor;
      rangeInteres.value = nuevoValor; 
    }
    
    if (campo === "cantidadCompra" || campo === "cantidad") {
      calcularPorcentajeFinanciacion();
    }
  }

  // --- Press & Hold ---
  function agregarEventosContinuos(boton, accion, parametro) {
    const iniciar = (e) => {
        if (e.type === 'touchstart') e.preventDefault();
        accion(parametro);
        timeoutInicio = setTimeout(() => {
            intervaloRepeticion = setInterval(() => {
                accion(parametro);
            }, 100); 
        }, 500);
    };
    const detener = () => {
        clearTimeout(timeoutInicio);
        clearInterval(intervaloRepeticion);
        timeoutInicio = null;
        intervaloRepeticion = null;
    };
    boton.addEventListener('mousedown', iniciar);
    boton.addEventListener('mouseup', detener);
    boton.addEventListener('mouseleave', detener);
    boton.addEventListener('touchstart', iniciar);
    boton.addEventListener('touchend', detener);
    boton.addEventListener('touchcancel', detener);
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

    return { cuota, totalPagado, textoPlazo };
  }

  // --- Total de Gastos ---
  function actualizarTotalGastos() {
    const seguroVida = numeroSeguroFromInput(seguroVidaInput);
    const gastoGestoria = 500;
    const gastoTasacion = 500;
    const gastoHogar = 200;
    const totalGastos = gITP + gNotaria + gRegistro + gastoGestoria + gastoTasacion + gastoHogar + seguroVida;
    gastoTotalEl.textContent = formatearEuros(totalGastos);
    return totalGastos;
  }

  // --- Cálculo de Gastos ---
  function calcularGastos() {
    const compra = numeroSeguroFromInput(cantidadCompraInput);
    if (compra <= 0) {
      alert("Por favor, introduce una 'Cantidad de compra' válida.");
      return false; 
    }
    const itpPorcentaje = parseFloat(tipoITPSelect.value);
    gITP = compra * (itpPorcentaje / 100);
    gNotaria = compra * 0.01; 
    gRegistro = gNotaria * 0.8; 
    const gastoGestoria = 500;
    const gastoTasacion = 500;
    const gastoHogar = 200;
    
    itpTipoTextoEl.textContent = `${itpPorcentaje}%`;
    gastoITPEl.textContent = formatearEuros(gITP);
    gastoNotariaEl.textContent = formatearEuros(gNotaria);
    gastoRegistroEl.textContent = formatearEuros(gRegistro);
    gastoGestoriaEl.textContent = formatearEuros(gastoGestoria);
    gastoTasacionEl.textContent = formatearEuros(gastoTasacion);
    gastoHogarEl.textContent = formatearEuros(gastoHogar);

    gastosCard.style.display = "block";
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
    elemento.classList.remove("saludable", "aceptable", "elevado", "muy-alto");
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
    if (tasa === 0) return "Introduce ingresos y deudas para evaluar tu tasa de esfuerzo.";
    if (tasa < 30) return "Nivel de endeudamiento saludable.";
    if (tasa < 40) return "Capacidad aceptable. Se recomienda analizar estabilidad laboral.";
    if (tasa < 50) return "Riesgo elevado. Este préstamo puede comprometer tu economía.";
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
      return 0; // Return 0 for logs
    }

    let tasaFinal = 0;
    if (ingresos > 0 && (!deudas || deudas <= 0)) {
      const tasaSimple = calcularTasaSimple(cuota, ingresos);
      simpleCard.style.display = "block";
      completaCard.style.display = "none";
      tasaSimpleEl.textContent = `${tasaSimple.toFixed(1)} %`;
      actualizarClaseRiesgo(tasaSimpleEl, tasaSimple); 
      textoRiesgoEl.textContent = "Introduce deudas para calcular la tasa completa";
      explicacionTasaCompleta.textContent = "";
      tasaFinal = tasaSimple;
    } else {
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
      explicacionTasaCompleta.textContent = `(${formatearMiles(deudas)} € de deudas + ${formatearMiles(Math.round(cuota))} € de cuota) / ${formatearMiles(ingresos)} € de ingresos`;
      tasaFinal = tasaCompleta;
    }
    return tasaFinal;
  }

  // --- HISTORIAL (Lógica Nueva) ---
  function guardarEnHistorial(datos) {
      // 1. Obtener historial existente
      let historial = JSON.parse(localStorage.getItem('historialPrestamos')) || [];
      
      // 2. Añadir nuevo al principio
      const ahora = new Date();
      const horaFormateada = ahora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      const nuevoRegistro = {
          hora: horaFormateada,
          compra: datos.compra,
          prestamo: datos.prestamo,
          cuota: datos.cuota,
          tasa: datos.tasa
      };
      
      historial.unshift(nuevoRegistro);
      
      // 3. Limitar a 5 últimos
      if (historial.length > 5) {
          historial.pop();
      }
      
      // 4. Guardar
      localStorage.setItem('historialPrestamos', JSON.stringify(historial));
      
      // 5. Renderizar
      renderizarHistorial();
  }

  function renderizarHistorial() {
      const historial = JSON.parse(localStorage.getItem('historialPrestamos')) || [];
      
      if (historial.length === 0) {
          historialCard.style.display = "none";
          return;
      }
      
      historialCard.style.display = "block";
      listaHistorial.innerHTML = "";
      
      historial.forEach(item => {
          const div = document.createElement('div');
          div.className = 'historial-item';
          div.innerHTML = `
            <div class="historial-header">
                <span>Cuota: ${item.cuota}</span>
                <span class="historial-hora">${item.hora}</span>
            </div>
            <div class="historial-detalles">
                <span>Compra: ${item.compra}</span>
                <span>Préstamo: ${item.prestamo}</span>
                <span>Tasa: ${item.tasa}</span>
            </div>
          `;
          listaHistorial.appendChild(div);
      });
  }
  
  function borrarHistorial() {
      localStorage.removeItem('historialPrestamos');
      renderizarHistorial();
  }

  // Wrapper para cargar historial al inicio si hay datos
  function cargarHistorial() {
      renderizarHistorial();
  }


  // --- Listeners de Input y Sliders ---
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
  
  plazoInput.addEventListener("input", () => syncSliderToInput(rangePlazo, plazoInput));
  interesInput.addEventListener("input", () => syncSliderToInput(rangeInteres, interesInput));

  [ingresosInput, deudasInput, seguroVidaInput].forEach((input) => {
    input.addEventListener("input", () => actualizarInput(input, input.value));
  });
  
  rangeCompra.addEventListener("input", () => syncInputToSlider(cantidadCompraInput, rangeCompra));
  rangePrestamo.addEventListener("input", () => syncInputToSlider(cantidadInput, rangePrestamo));
  rangePlazo.addEventListener("input", () => {
      plazoInput.value = rangePlazo.value;
  });
  rangeInteres.addEventListener("input", () => {
      interesInput.value = parseFloat(rangeInteres.value).toFixed(2);
  });

  seguroVidaInput.addEventListener("input", actualizarTotalGastos);
  
  // Botones Press & Hold
  agregarEventosContinuos(cantidadCompraMas, incrementar, "cantidadCompra");
  agregarEventosContinuos(cantidadCompraMenos, decrementar, "cantidadCompra");
  agregarEventosContinuos(cantidadMas, incrementar, "cantidad");
  agregarEventosContinuos(cantidadMenos, decrementar, "cantidad");
  agregarEventosContinuos(plazoMas, incrementar, "plazo");
  agregarEventosContinuos(plazoMenos, decrementar, "plazo");
  agregarEventosContinuos(interesMas, incrementar, "interes");
  agregarEventosContinuos(interesMenos, decrementar, "interes");

  // --- Calcular / Limpiar ---
  calcularBtn.addEventListener("click", () => {
    const resultadoPrestamo = calcularPrestamo(); // Ahora devuelve objeto
    if (resultadoPrestamo) {
      const gastosOk = calcularGastos(); 
      if (gastosOk) {
        const tasa = calcularTasaEsfuerzo(resultadoPrestamo.cuota); 
        
        // GUARDAR EN HISTORIAL
        guardarEnHistorial({
            compra: formatearMiles(numeroSeguroFromInput(cantidadCompraInput)) + " €",
            prestamo: formatearMiles(numeroSeguroFromInput(cantidadInput)) + " €",
            cuota: formatearEuros(resultadoPrestamo.cuota),
            tasa: tasa > 0 ? tasa.toFixed(1) + "%" : "N/A"
        });
      }
    }
  });

  limpiarBtn.addEventListener("click", limpiarTodo);
  if (borrarHistorialBtn) borrarHistorialBtn.addEventListener("click", borrarHistorial);

  // --- Seguridad Básica ---
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || 
       (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
       (e.ctrlKey && e.key === 'u')) {
      e.preventDefault();
    }
  });
});