document.addEventListener("DOMContentLoaded", () => {
  const cantidadInput = document.getElementById("cantidad");
  const plazoInput = document.getElementById("plazo");
  const interesInput = document.getElementById("interes");
  const tipoPlazoSelect = document.getElementById("tipoPlazo");

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

  let tipoPlazo = "años";

  // Valores iniciales como en tu Home.tsx
  cantidadInput.value = "10000";
  plazoInput.value = "5";
  interesInput.value = "3.5";
  tipoPlazoSelect.value = "años";

  function validarNumero(valor) {
    return valor.replace(/[^0-9.]/g, "");
  }

  function formatearEuros(valor) {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  }

  function incrementar(campo) {
    if (campo === "cantidad") {
      const valor = parseFloat(cantidadInput.value) || 0;
      cantidadInput.value = String(Math.max(0, valor + 1000));
    } else if (campo === "plazo") {
      const valor = parseFloat(plazoInput.value) || 0;
      plazoInput.value = String(Math.max(1, valor + 1));
    } else if (campo === "interes") {
      const valor = parseFloat(interesInput.value) || 0;
      interesInput.value = (Math.max(0, valor + 0.1)).toFixed(1);
    }
  }

  function decrementar(campo) {
    if (campo === "cantidad") {
      const valor = parseFloat(cantidadInput.value) || 0;
      cantidadInput.value = String(Math.max(0, valor - 1000));
    } else if (campo === "plazo") {
      const valor = parseFloat(plazoInput.value) || 0;
      plazoInput.value = String(Math.max(1, valor - 1));
    } else if (campo === "interes") {
      const valor = parseFloat(interesInput.value) || 0;
      interesInput.value = (Math.max(0, valor - 0.1)).toFixed(1);
    }
  }

  function calcularPrestamo() {
    const P = parseFloat(cantidadInput.value);
    const tasaAnual = parseFloat(interesInput.value);
    const plazoValor = parseFloat(plazoInput.value);

    if (!P || P <= 0) {
      alert("Por favor, introduce una cantidad válida");
      return;
    }
    if (isNaN(tasaAnual) || tasaAnual < 0) {
      alert("Por favor, introduce un interés válido");
      return;
    }
    if (!plazoValor || plazoValor <= 0) {
      alert("Por favor, introduce un plazo válido");
      return;
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

    // Mostrar resultados
    cuotaMensualEl.textContent = formatearEuros(cuota);
    interesesTotalesEl.textContent = formatearEuros(intereses);
    costeTotalEl.textContent = formatearEuros(totalPagado);

    cantidadSolicitadaEl.textContent = formatearEuros(P);
    interesAnualEl.textContent = `${tasaAnual}%`;

    const mesesTotales = tipoPlazo === "años" ? plazoValor * 12 : plazoValor;
    plazoTotalTextoEl.textContent = `${plazoValor} ${tipoPlazo} (${mesesTotales} meses)`;

    cuotaMensualTextoEl.textContent = ` ${formatearEuros(cuota)} `;
    mesesTotalesTextoEl.textContent = ` ${mesesTotales} meses `;
    interesesTotalesTextoEl.textContent = ` ${formatearEuros(intereses)} `;

    resultadosSection.classList.add("visible");
    resultadosSection.setAttribute("aria-hidden", "false");
  }

  function limpiarDatos() {
    cantidadInput.value = "10000";
    plazoInput.value = "5";
    interesInput.value = "3.5";
    tipoPlazo = "años";
    tipoPlazoSelect.value = "años";

    resultadosSection.classList.remove("visible");
    resultadosSection.setAttribute("aria-hidden", "true");
  }

  // Eventos de inputs y botones
  cantidadInput.addEventListener("input", (e) => {
    e.target.value = validarNumero(e.target.value);
  });

  plazoInput.addEventListener("input", (e) => {
    e.target.value = validarNumero(e.target.value);
  });

  interesInput.addEventListener("input", (e) => {
    e.target.value = validarNumero(e.target.value);
  });

  tipoPlazoSelect.addEventListener("change", (e) => {
    tipoPlazo = e.target.value;
  });

  cantidadMas.addEventListener("click", () => incrementar("cantidad"));
  cantidadMenos.addEventListener("click", () => decrementar("cantidad"));
  plazoMas.addEventListener("click", () => incrementar("plazo"));
  plazoMenos.addEventListener("click", () => decrementar("plazo"));
  interesMas.addEventListener("click", () => incrementar("interes"));
  interesMenos.addEventListener("click", () => decrementar("interes"));

  calcularBtn.addEventListener("click", calcularPrestamo);
  limpiarBtn.addEventListener("click", limpiarDatos);
});