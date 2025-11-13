# Documentación - Calculadora de Préstamos

## Descripción General

La **Calculadora de Préstamos** es una aplicación web completamente funcional, optimizada para dispositivos móviles y diseñada especialmente para personas mayores del sector financiero. La aplicación permite calcular de forma simple y rápida la cuota mensual, los intereses totales y el coste total de un préstamo.

## Características Principales

### Funcionalidad de Cálculo

La calculadora utiliza la **fórmula de amortización francesa** para calcular los préstamos:

```
Cuota = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
```

Donde:
- **P** = Principal (cantidad del préstamo)
- **r** = Tasa de interés mensual (interés anual / 12 / 100)
- **n** = Número de pagos mensuales

### Datos de Entrada

La aplicación solicita únicamente **3 campos** al usuario:

1. **Cantidad del préstamo (€)**: El monto total que se desea solicitar
2. **Plazo**: Duración del préstamo (seleccionable en años o meses)
3. **Interés anual (%)**: Tasa de interés anual aplicada al préstamo

### Resultados Mostrados

Una vez realizado el cálculo, la aplicación muestra:

1. **Cuota mensual**: Cantidad a pagar cada mes (destacada en grande)
2. **Intereses totales**: Total de intereses que se pagarán durante todo el plazo
3. **Coste total**: Suma del principal más los intereses
4. **Desglose detallado**: Resumen de los datos introducidos
5. **Texto interpretativo**: Explicación en lenguaje sencillo de los resultados

## Diseño y Accesibilidad

### Optimización para Móviles

- **Diseño responsive mobile-first**: Prioriza la experiencia en dispositivos móviles
- **Interfaz tipo app**: Diseño limpio y enfocado, sin distracciones
- **Botones grandes**: Mínimo 60px de altura para facilitar la interacción
- **Tipografía legible**: Tamaño mínimo de 18px, con títulos de hasta 48px

### Accesibilidad para Personas Mayores

- **Botones +/- en cada campo**: Facilitan el ajuste de valores sin necesidad de escribir
- **Labels claros y descriptivos**: Texto explicativo bajo cada campo
- **Alto contraste**: Colores que garantizan buena legibilidad
- **Atributos ARIA**: Etiquetas de accesibilidad para lectores de pantalla
- **Sin tecnicismos**: Lenguaje simple y directo

### Paleta de Colores

La aplicación utiliza una **paleta azul-verde accesible**:

- **Azul primario** (oklch(0.55 0.15 240)): Para elementos principales y botón de cálculo
- **Verde secundario** (oklch(0.50 0.15 150)): Para destacar intereses y costes
- **Fondo claro** (oklch(0.98 0.005 240)): Base suave para el modo claro
- **Fondo oscuro** (oklch(0.15 0.01 240)): Base para el modo oscuro

### Modo Oscuro

La aplicación incluye un **interruptor de tema** en la esquina superior derecha que permite alternar entre modo claro y oscuro, adaptándose a las preferencias del usuario y mejorando la experiencia en diferentes condiciones de iluminación.

## Estructura del Código

### Archivos Principales

```
client/
├── src/
│   ├── pages/
│   │   └── Home.tsx          # Página principal con la calculadora
│   ├── components/
│   │   └── ui/               # Componentes de interfaz (shadcn/ui)
│   ├── contexts/
│   │   └── ThemeContext.tsx  # Contexto para el tema claro/oscuro
│   ├── index.css             # Estilos globales y variables de tema
│   ├── App.tsx               # Configuración de rutas y providers
│   └── const.ts              # Constantes de la aplicación
├── index.html                # HTML principal con metaetiquetas SEO
└── public/                   # Recursos estáticos
```

### Componentes Utilizados

La aplicación utiliza componentes de **shadcn/ui** para garantizar una interfaz moderna y accesible:

- **Button**: Botones de acción y botones +/-
- **Card**: Tarjetas para organizar el contenido
- **Input**: Campos de entrada numéricos
- **Select**: Selector de plazo (años/meses)
- **Label**: Etiquetas descriptivas para los campos

### Funciones Principales

#### `calcularPrestamo()`
Realiza el cálculo del préstamo utilizando la fórmula de amortización francesa. Valida los datos de entrada y actualiza los estados con los resultados.

#### `incrementar(campo)` y `decrementar(campo)`
Permiten ajustar los valores de los campos mediante los botones +/-, facilitando la interacción para usuarios con dificultades para escribir.

#### `validarNumero(valor)`
Filtra la entrada del usuario para permitir únicamente números y puntos decimales, evitando errores de formato.

#### `formatearEuros(valor)`
Formatea los números como moneda en euros (€) utilizando el formato español (es-ES).

#### `limpiarDatos()`
Restaura todos los campos a sus valores predeterminados y oculta los resultados.

## Características Técnicas

### Tecnologías Utilizadas

- **React 19**: Framework de interfaz de usuario
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS 4**: Framework de estilos utility-first
- **shadcn/ui**: Biblioteca de componentes accesibles
- **Wouter**: Enrutamiento ligero
- **Lucide React**: Iconos modernos y accesibles

### Validaciones Implementadas

1. **Cantidad del préstamo**: Debe ser mayor que 0
2. **Interés anual**: Debe ser mayor o igual a 0 (permite préstamos sin interés)
3. **Plazo**: Debe ser mayor que 0
4. **Solo números**: Los campos solo aceptan caracteres numéricos y punto decimal

### Animaciones

La aplicación incluye **animaciones suaves** al mostrar los resultados:
- Efecto de fade-in (aparición gradual)
- Efecto de slide-in desde abajo
- Duración de 500ms para una transición agradable

## SEO y Metaetiquetas

El archivo `index.html` incluye metaetiquetas optimizadas para:

- **SEO básico**: Descripción, palabras clave y autor
- **Open Graph**: Para compartir en redes sociales (Facebook)
- **Twitter Cards**: Para compartir en Twitter
- **Móviles**: Viewport optimizado y theme-color
- **Idioma**: Configurado en español (es)

## Cómo Funciona

### Flujo de Usuario

1. El usuario introduce la **cantidad del préstamo** (o usa los botones +/-)
2. Selecciona el **plazo** en años o meses (o usa los botones +/-)
3. Introduce el **interés anual** (o usa los botones +/-)
4. Presiona el botón **"Calcular"**
5. La aplicación valida los datos
6. Se muestran los resultados con una animación suave:
   - Cuota mensual (destacada)
   - Intereses totales
   - Coste total
   - Desglose detallado
   - Texto interpretativo
7. El usuario puede **limpiar los datos** para hacer un nuevo cálculo

### Ejemplo de Cálculo

**Datos de entrada:**
- Cantidad: 10.000 €
- Plazo: 5 años (60 meses)
- Interés: 3,5% anual

**Resultados:**
- Tasa mensual: 3,5 / 12 / 100 = 0,00291667
- Cuota mensual: 181,49 €
- Total pagado: 10.889,40 €
- Intereses totales: 889,40 €

## Mejoras Futuras Sugeridas

Aunque la aplicación está completa según los requisitos, se podrían considerar las siguientes mejoras opcionales:

### Funcionalidades Adicionales

1. **Tabla de amortización**: Mostrar el desglose mes a mes de capital e intereses
2. **Comparador de préstamos**: Permitir comparar diferentes opciones de préstamo
3. **Gráficos visuales**: Mostrar gráficos de barras o circulares con la distribución de pagos
4. **Exportar resultados**: Permitir descargar los resultados en PDF o imagen
5. **Guardar cálculos**: Almacenar cálculos anteriores en el navegador (localStorage)

### Mejoras de UX

1. **Tooltips informativos**: Explicaciones emergentes sobre términos financieros
2. **Calculadora de capacidad de pago**: Sugerir préstamos según ingresos mensuales
3. **Alertas de recomendación**: Avisar si el plazo o interés son muy altos
4. **Compartir resultados**: Botón para compartir el cálculo por WhatsApp o email
5. **Historial de búsquedas**: Mostrar los últimos cálculos realizados

### Optimizaciones Técnicas

1. **PWA (Progressive Web App)**: Permitir instalar la app en el móvil
2. **Modo offline**: Funcionar sin conexión a internet
3. **Precarga de datos**: Sugerir valores típicos según el tipo de préstamo
4. **Internacionalización**: Soporte para otros idiomas
5. **Analytics**: Seguimiento de uso para mejorar la experiencia

## Publicación

Para publicar la aplicación:

1. Haz clic en el botón **"Publish"** en la interfaz de gestión
2. La aplicación estará disponible en tu dominio personalizado
3. Puedes actualizar el favicon desde el panel de configuración
4. Configura un dominio personalizado si lo deseas

## Soporte y Mantenimiento

La aplicación es completamente estática y no requiere backend, lo que facilita su mantenimiento. Todos los cálculos se realizan en el navegador del usuario, garantizando privacidad y rapidez.

---

**Nota**: Esta documentación describe la versión actual de la aplicación. Para cualquier modificación o mejora, consulta el archivo `todo.md` en la raíz del proyecto.
