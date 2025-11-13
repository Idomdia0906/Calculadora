import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { Calculator, Moon, RotateCcw, Sun, Plus, Minus } from "lucide-react";
import { useState } from "react";

/**
 * Calculadora de Préstamos
 * Aplicación optimizada para móviles y personas mayores
 * Con diseño accesible, botones grandes y alto contraste
 */
export default function Home() {
  const { theme, toggleTheme } = useTheme();

  // Estados para los campos de entrada
  const [cantidad, setCantidad] = useState<string>("10000");
  const [plazo, setPlazo] = useState<string>("5");
  const [tipoPlazo, setTipoPlazo] = useState<"años" | "meses">("años");
  const [interes, setInteres] = useState<string>("3.5");

  // Estados para los resultados
  const [cuotaMensual, setCuotaMensual] = useState<number | null>(null);
  const [interesesTotales, setInteresesTotales] = useState<number | null>(null);
  const [costeTotal, setCosteTotal] = useState<number | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  /**
   * Incrementar valor de un campo
   */
  const incrementar = (campo: "cantidad" | "plazo" | "interes") => {
    if (campo === "cantidad") {
      const valor = parseFloat(cantidad) || 0;
      setCantidad(String(Math.max(0, valor + 1000)));
    } else if (campo === "plazo") {
      const valor = parseFloat(plazo) || 0;
      setPlazo(String(Math.max(1, valor + 1)));
    } else if (campo === "interes") {
      const valor = parseFloat(interes) || 0;
      setInteres((Math.max(0, valor + 0.1)).toFixed(1));
    }
  };

  /**
   * Decrementar valor de un campo
   */
  const decrementar = (campo: "cantidad" | "plazo" | "interes") => {
    if (campo === "cantidad") {
      const valor = parseFloat(cantidad) || 0;
      setCantidad(String(Math.max(0, valor - 1000)));
    } else if (campo === "plazo") {
      const valor = parseFloat(plazo) || 0;
      setPlazo(String(Math.max(1, valor - 1)));
    } else if (campo === "interes") {
      const valor = parseFloat(interes) || 0;
      setInteres((Math.max(0, valor - 0.1)).toFixed(1));
    }
  };

  /**
   * Validar que solo se ingresen números
   */
  const validarNumero = (valor: string): string => {
    // Permitir números y punto decimal
    return valor.replace(/[^0-9.]/g, "");
  };

  /**
   * Calcular préstamo usando la fórmula de amortización francesa
   * Cuota = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
   * P = Principal (cantidad del préstamo)
   * r = Tasa de interés mensual (interés anual / 12 / 100)
   * n = Número de pagos mensuales
   */
  const calcularPrestamo = () => {
    const P = parseFloat(cantidad);
    const tasaAnual = parseFloat(interes);
    const plazoValor = parseFloat(plazo);

    // Validaciones
    if (!P || P <= 0) {
      alert("Por favor, introduce una cantidad válida");
      return;
    }
    if (!tasaAnual || tasaAnual < 0) {
      alert("Por favor, introduce un interés válido");
      return;
    }
    if (!plazoValor || plazoValor <= 0) {
      alert("Por favor, introduce un plazo válido");
      return;
    }

    // Convertir plazo a meses
    const n = tipoPlazo === "años" ? plazoValor * 12 : plazoValor;

    // Si el interés es 0, el cálculo es simple
    if (tasaAnual === 0) {
      const cuota = P / n;
      setCuotaMensual(cuota);
      setInteresesTotales(0);
      setCosteTotal(P);
      setMostrarResultados(true);
      return;
    }

    // Calcular tasa de interés mensual
    const r = tasaAnual / 12 / 100;

    // Fórmula de amortización francesa
    const cuota = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPagado = cuota * n;
    const intereses = totalPagado - P;

    setCuotaMensual(cuota);
    setInteresesTotales(intereses);
    setCosteTotal(totalPagado);
    setMostrarResultados(true);
  };

  /**
   * Limpiar todos los datos
   */
  const limpiarDatos = () => {
    setCantidad("10000");
    setPlazo("5");
    setTipoPlazo("años");
    setInteres("3.5");
    setCuotaMensual(null);
    setInteresesTotales(null);
    setCosteTotal(null);
    setMostrarResultados(false);
  };

  /**
   * Formatear número a euros
   */
  const formatearEuros = (valor: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header con título y botón de tema */}
      <header className="border-b border-border bg-card">
        <div className="container py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-card-foreground">
              Calculadora de Préstamos
            </h1>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={toggleTheme}
            className="h-14 w-14 p-0"
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {theme === "dark" ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container py-8 max-w-4xl">
        <p className="text-xl md:text-2xl text-center mb-8 text-muted-foreground">
          Fácil y Rápida
        </p>

        {/* Formulario de entrada */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Datos del préstamo</CardTitle>
            <CardDescription className="text-lg">
              Introduce los datos de tu préstamo para calcular la cuota mensual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Campo: Cantidad del préstamo */}
            <div className="space-y-3">
              <Label htmlFor="cantidad" className="text-xl md:text-2xl font-semibold">
                Cantidad del préstamo (€)
              </Label>
              <p className="text-base text-muted-foreground">
                ¿Cuánto dinero necesitas solicitar?
              </p>
              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => decrementar("cantidad")}
                  className="h-16 w-16 text-2xl"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="h-6 w-6" />
                </Button>
                <Input
                  id="cantidad"
                  type="text"
                  inputMode="decimal"
                  value={cantidad}
                  onChange={(e) => setCantidad(validarNumero(e.target.value))}
                  className="h-16 text-2xl md:text-3xl text-center font-semibold"
                  aria-describedby="cantidad-desc"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => incrementar("cantidad")}
                  className="h-16 w-16 text-2xl"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Campo: Plazo */}
            <div className="space-y-3">
              <Label htmlFor="plazo" className="text-xl md:text-2xl font-semibold">
                Plazo
              </Label>
              <p className="text-base text-muted-foreground">
                ¿En cuánto tiempo quieres devolverlo?
              </p>
              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => decrementar("plazo")}
                  className="h-16 w-16 text-2xl"
                  aria-label="Disminuir plazo"
                >
                  <Minus className="h-6 w-6" />
                </Button>
                <Input
                  id="plazo"
                  type="text"
                  inputMode="decimal"
                  value={plazo}
                  onChange={(e) => setPlazo(validarNumero(e.target.value))}
                  className="h-16 text-2xl md:text-3xl text-center font-semibold"
                  aria-describedby="plazo-desc"
                />
                <Select value={tipoPlazo} onValueChange={(v) => setTipoPlazo(v as "años" | "meses")}>
                  <SelectTrigger className="h-16 text-xl md:text-2xl w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="años" className="text-xl">
                      Años
                    </SelectItem>
                    <SelectItem value="meses" className="text-xl">
                      Meses
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => incrementar("plazo")}
                  className="h-16 w-16 text-2xl"
                  aria-label="Aumentar plazo"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Campo: Interés anual */}
            <div className="space-y-3">
              <Label htmlFor="interes" className="text-xl md:text-2xl font-semibold">
                Interés anual (%)
              </Label>
              <p className="text-base text-muted-foreground">
                ¿Qué porcentaje de interés te aplican?
              </p>
              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => decrementar("interes")}
                  className="h-16 w-16 text-2xl"
                  aria-label="Disminuir interés"
                >
                  <Minus className="h-6 w-6" />
                </Button>
                <Input
                  id="interes"
                  type="text"
                  inputMode="decimal"
                  value={interes}
                  onChange={(e) => setInteres(validarNumero(e.target.value))}
                  className="h-16 text-2xl md:text-3xl text-center font-semibold"
                  aria-describedby="interes-desc"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => incrementar("interes")}
                  className="h-16 w-16 text-2xl"
                  aria-label="Aumentar interés"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={calcularPrestamo}
                size="lg"
                className="flex-1 h-16 text-xl md:text-2xl font-semibold"
              >
                <Calculator className="mr-2 h-6 w-6" />
                Calcular
              </Button>
              <Button
                onClick={limpiarDatos}
                variant="outline"
                size="lg"
                className="flex-1 h-16 text-xl md:text-2xl font-semibold"
              >
                <RotateCcw className="mr-2 h-6 w-6" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {mostrarResultados && cuotaMensual !== null && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cuota mensual - Destacada */}
            <Card className="border-2 border-primary shadow-xl bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-primary">
                  Tu cuota mensual será:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl md:text-6xl font-bold text-primary text-center">
                  {formatearEuros(cuotaMensual)}
                </p>
              </CardContent>
            </Card>

            {/* Desglose de resultados */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Intereses totales */}
              <Card className="border-2 border-secondary shadow-lg bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-secondary">
                    Intereses totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl md:text-4xl font-bold text-secondary text-center">
                    {formatearEuros(interesesTotales || 0)}
                  </p>
                </CardContent>
              </Card>

              {/* Coste total */}
              <Card className="border-2 border-secondary shadow-lg bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-secondary">
                    Coste total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl md:text-4xl font-bold text-secondary text-center">
                    {formatearEuros(costeTotal || 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Desglose de datos */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Desglose de tu préstamo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-lg md:text-xl text-muted-foreground">
                    Cantidad solicitada:
                  </span>
                  <span className="text-lg md:text-xl font-semibold">
                    {formatearEuros(parseFloat(cantidad))}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-lg md:text-xl text-muted-foreground">
                    Interés anual aplicado:
                  </span>
                  <span className="text-lg md:text-xl font-semibold">{interes}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-lg md:text-xl text-muted-foreground">Plazo total:</span>
                  <span className="text-lg md:text-xl font-semibold">
                    {plazo} {tipoPlazo} ({tipoPlazo === "años" ? parseFloat(plazo) * 12 : plazo}{" "}
                    meses)
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Texto interpretativo */}
            <Card className="bg-muted/50 shadow-lg">
              <CardContent className="pt-6">
                <p className="text-lg md:text-xl text-center text-muted-foreground">
                  Con estos datos pagarías{" "}
                  <span className="font-bold text-primary">{formatearEuros(cuotaMensual)}</span>{" "}
                  cada mes durante{" "}
                  <span className="font-bold text-primary">
                    {tipoPlazo === "años" ? parseFloat(plazo) * 12 : plazo} meses
                  </span>
                  , con un total de intereses de{" "}
                  <span className="font-bold text-secondary">
                    {formatearEuros(interesesTotales || 0)}
                  </span>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card">
        <div className="container text-center">
          <p className="text-base md:text-lg text-muted-foreground">
            Calculadora de Préstamos – Fácil y Rápida
          </p>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Herramienta gratuita para calcular préstamos de forma sencilla
          </p>
        </div>
      </footer>
    </div>
  );
}
