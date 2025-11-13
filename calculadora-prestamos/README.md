# 💰 Calculadora de Préstamos – Fácil y Rápida

Una calculadora de préstamos web moderna, accesible y optimizada para dispositivos móviles y personas mayores. Diseñada con un enfoque en la simplicidad, usabilidad y accesibilidad.

![Calculadora de Préstamos](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Características

### Funcionalidad Principal
- ✅ **Cálculo preciso** de cuota mensual usando fórmula de amortización francesa
- 📊 **Resultados completos**: cuota mensual, intereses totales y coste total
- 📝 **Desglose detallado** con explicación en lenguaje sencillo
- 🔄 **Validación en tiempo real** de todos los campos

### Diseño y Accesibilidad
- 📱 **Responsive mobile-first**: Optimizado para pantallas pequeñas
- 👴 **Accesible para personas mayores**: Botones grandes (60px+), tipografía legible (18px+)
- ➕➖ **Botones incrementales**: Facilitan el ajuste de valores sin escribir
- 🌓 **Modo oscuro**: Tema claro/oscuro switchable
- 🎨 **Alto contraste**: Paleta de colores azul-verde accesible
- ♿ **Atributos ARIA**: Totalmente accesible para lectores de pantalla

### Experiencia de Usuario
- ⚡ **Sin backend**: Cálculos instantáneos en el navegador
- 🎭 **Animaciones suaves**: Transiciones agradables al mostrar resultados
- 🧹 **Botón limpiar**: Resetea todos los campos fácilmente
- 🔒 **Privacidad total**: Todos los datos se procesan localmente

## 🚀 Demo

[Ver demo en vivo](#) _(Añade tu URL de despliegue aquí)_

## 📸 Capturas de Pantalla

### Modo Claro
![Modo Claro](screenshots/light-mode.png)

### Modo Oscuro
![Modo Oscuro](screenshots/dark-mode.png)

### Resultados
![Resultados](screenshots/results.png)

## 🛠️ Tecnologías

- **React 19** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos utility-first
- **shadcn/ui** - Componentes de interfaz accesibles
- **Wouter** - Enrutamiento ligero
- **Lucide React** - Iconos modernos
- **Vite** - Build tool y dev server

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/calculadora-prestamos.git
cd calculadora-prestamos
```

2. **Instalar dependencias**
```bash
pnpm install
# o
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
pnpm dev
# o
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
calculadora-prestamos/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx          # Página principal con la calculadora
│   │   ├── components/
│   │   │   └── ui/               # Componentes shadcn/ui
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx  # Contexto de tema claro/oscuro
│   │   ├── index.css             # Estilos globales y variables
│   │   ├── App.tsx               # Configuración de rutas
│   │   └── const.ts              # Constantes de la app
│   ├── index.html                # HTML principal con metaetiquetas
│   └── public/                   # Recursos estáticos
├── DOCUMENTACION.md              # Documentación técnica completa
├── todo.md                       # Lista de tareas
└── README.md                     # Este archivo
```

## 🧮 Cómo Funciona

La calculadora utiliza la **fórmula de amortización francesa**:

```
Cuota = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
```

Donde:
- **P** = Principal (cantidad del préstamo)
- **r** = Tasa de interés mensual (interés anual / 12 / 100)
- **n** = Número de pagos mensuales

### Ejemplo de Cálculo

**Entrada:**
- Cantidad: 10.000 €
- Plazo: 5 años (60 meses)
- Interés: 3,5% anual

**Resultado:**
- Cuota mensual: **181,49 €**
- Intereses totales: **889,40 €**
- Coste total: **10.889,40 €**

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `client/src/index.css`:

```css
:root {
  --primary: oklch(0.55 0.15 240);      /* Azul primario */
  --secondary: oklch(0.50 0.15 150);    /* Verde secundario */
  --background: oklch(0.98 0.005 240);  /* Fondo claro */
  /* ... más variables */
}
```

### Modificar Valores Predeterminados

Edita los estados iniciales en `client/src/pages/Home.tsx`:

```typescript
const [cantidad, setCantidad] = useState<string>("10000");
const [plazo, setPlazo] = useState<string>("5");
const [interes, setInteres] = useState<string>("3.5");
```

## 📱 Build para Producción

```bash
pnpm build
# o
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🚀 Despliegue

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

### GitHub Pages
```bash
pnpm build
# Sube la carpeta dist/ a la rama gh-pages
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Roadmap

- [ ] Tabla de amortización mes a mes
- [ ] Gráficos visuales (barras/circular)
- [ ] Exportar resultados a PDF
- [ ] Comparador de préstamos
- [ ] PWA (Progressive Web App)
- [ ] Compartir resultados por WhatsApp/email
- [ ] Historial de cálculos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes de interfaz
- [Lucide](https://lucide.dev/) por los iconos
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un [issue](https://github.com/tu-usuario/calculadora-prestamos/issues).

---

⭐ Si este proyecto te ha sido útil, ¡dale una estrella en GitHub!
