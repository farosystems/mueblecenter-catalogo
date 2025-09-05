# Vista Móvil de Categorías - MuebleCenter

## Descripción General

La vista móvil de categorías en MuebleCenter está diseñada para ofrecer una experiencia optimizada en dispositivos móviles. El sistema funciona de dos maneras principales:

1. **Modal de Categorías (Móvil)**: Accesible desde el AppBar mediante el menú hamburguesa
2. **Página de Categorías**: Vista completa en `/app/categorias/page.tsx`

## Navegación Móvil desde el AppBar

### Flujo de Navegación Móvil

Cuando un usuario móvil toca el botón de "Categorías" desde el AppBar, se activa el siguiente flujo:

1. **Botón Hamburguesa**: El usuario toca el menú hamburguesa (☰) en la esquina superior derecha
2. **Menú Desplegable**: Se abre un menú móvil con varias opciones incluyendo "Categorías"
3. **Modal de Categorías**: Al tocar "Categorías" se abre un modal flotante con todas las categorías

### Implementación del AppBar Móvil

En `/components/GlobalAppBar.tsx` se maneja la navegación móvil:

```tsx
// Estados para el control del menú móvil
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)

// Botón hamburguesa
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="text-green-700 hover:text-green-900 transition-colors duration-300 p-2 rounded-full bg-green-100"
  aria-label="Abrir menú"
>
  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
</button>
```

### Menú Móvil Desplegable

Cuando `isMobileMenuOpen` es `true`, se muestra este menú:

```tsx
{isMobileMenuOpen && (
  <div className="lg:hidden bg-white border-t border-green-200">
    <div className="px-4 py-4 space-y-1">
      {/* Otras opciones del menú */}
      
      {/* Botón de Categorías móvil */}
      <button
        onClick={() => {
          setIsMobileCategoriesOpen(true)  // Abre el modal de categorías
          setIsMobileMenuOpen(false)       // Cierra el menú principal
        }}
        className="flex items-center justify-between w-full px-4 py-3 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium"
      >
        <div className="flex items-center">
          <Menu className="mr-3" size={20} />
          Categorías
        </div>
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
)}
```

### Modal de Categorías Móvil

El modal se activa mediante el componente `CategoriesDropdown`:

```tsx
{/* Modal de Categorías móvil */}
<CategoriesDropdown 
  isOpen={isMobileCategoriesOpen}
  onClose={() => setIsMobileCategoriesOpen(false)}
  isMobile={true}  // Importante: indica que es versión móvil
/>
```

### Componente CategoriesDropdown (Modal Móvil)

El modal móvil está implementado en `/components/CategoriesDropdown.tsx` con lógica condicional:

```tsx
interface CategoriesDropdownProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean  // Diferencia entre versión móvil y desktop
}

// Versión móvil - modal de pantalla completa
if (isMobile) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-300">
      <div className="bg-white w-full h-full flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header con gradiente verde */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Categorías</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        {/* Lista scrolleable de categorías */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <Link 
                href={`/${slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-4 hover:bg-green-50 rounded-xl transition-colors group border border-gray-200 hover:border-green-300"
              >
                <span className="text-gray-900 group-hover:text-green-700 font-medium text-lg">
                  {category.descripcion}
                </span>
                <ChevronRight className="text-gray-400 group-hover:text-green-600 size-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Características del Modal Móvil

1. **Overlay completo**: 
   - `fixed inset-0` cubre toda la pantalla
   - `bg-black/50 backdrop-blur-sm` para efecto de desenfoque

2. **Animaciones suaves**: 
   - `animate-in fade-in duration-300` para entrada
   - `slide-in-from-bottom duration-300` desliza desde abajo

3. **Header personalizado**:
   - Gradiente verde de la marca
   - Título "Categorías" prominente
   - Botón X para cerrar

4. **Lista touch-friendly**:
   - Elementos grandes (`p-4`) para fácil toque
   - Iconos de chevron para indicar navegación
   - Hover states verdes

5. **Control de scroll**:
   - Previene scroll del body cuando está abierto
   - Lista interna scrolleable
   - Altura completa de pantalla

### Prevención de Scroll del Body

```tsx
// Prevenir scroll en el body cuando el modal móvil está abierto
useEffect(() => {
  if (isMobile && isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }

  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isMobile, isOpen])
```

### Diferencias Desktop vs Móvil

| Característica | Desktop | Móvil |
|---------------|---------|--------|
| **Activación** | Hover sobre "Categorías" | Tap en menú → "Categorías" |
| **Tamaño** | Dropdown limitado | Pantalla completa |
| **Cierre** | Click fuera o mouse leave | Solo botón X |
| **Layout** | Grid 5 columnas | Lista vertical |
| **Colores** | Violeta | Verde (brand) |
| **Scroll** | Limitado | Body completo |

## Cómo Implementar la Navegación Móvil Paso a Paso

### Paso 1: Estados en el AppBar

En tu componente `GlobalAppBar.tsx`, necesitas dos estados para controlar los menús:

```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
```

### Paso 2: Botón Hamburguesa

Crea el botón que activa el menú móvil:

```tsx
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="text-green-700 hover:text-green-900 transition-colors duration-300 p-2 rounded-full bg-green-100 lg:hidden"
>
  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
</button>
```

### Paso 3: Menú Móvil Desplegable

Renderiza condicionalmente el menú cuando `isMobileMenuOpen` es true:

```tsx
{isMobileMenuOpen && (
  <div className="lg:hidden bg-white border-t border-green-200">
    <div className="px-4 py-4 space-y-1">
      {/* Botón de Categorías */}
      <button
        onClick={() => {
          setIsMobileCategoriesOpen(true)
          setIsMobileMenuOpen(false)
        }}
        className="flex items-center justify-between w-full px-4 py-3 text-green-700 hover:bg-green-100 rounded-lg"
      >
        <div className="flex items-center">
          <Menu className="mr-3" size={20} />
          Categorías
        </div>
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
)}
```

### Paso 4: Componente Modal de Categorías

Crea el modal que se activa desde el menú:

```tsx
<CategoriesDropdown 
  isOpen={isMobileCategoriesOpen}
  onClose={() => setIsMobileCategoriesOpen(false)}
  isMobile={true}
/>
```

### Paso 5: Lógica Condicional en CategoriesDropdown

En tu componente `CategoriesDropdown.tsx`, implementa la lógica condicional:

```tsx
export default function CategoriesDropdown({ isOpen, onClose, isMobile = false }) {
  // Estados y effects...
  
  if (!isOpen) return null

  if (isMobile) {
    // Render modal de pantalla completa
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]">
        <div className="bg-white w-full h-full flex flex-col">
          {/* Header + Lista de categorías */}
        </div>
      </div>
    )
  }

  // Render dropdown desktop
  return (
    <div className="bg-white rounded-xl shadow-2xl">
      {/* Contenido desktop */}
    </div>
  )
}
```

### Paso 6: Prevenir Scroll del Body

Agrega el efecto para controlar el scroll:

```tsx
useEffect(() => {
  if (isMobile && isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }

  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isMobile, isOpen])
```

### Paso 7: Responsividad con Tailwind

Usa las clases de Tailwind para ocultar/mostrar según el tamaño:

- `lg:hidden` - Oculta en desktop (≥1024px)
- `hidden lg:flex` - Oculta en móvil, muestra en desktop
- `sm:`, `md:`, `lg:`, `xl:` - Breakpoints responsive

### Paso 8: Optimizar para Touch

Para dispositivos móviles, usa:

- Botones grandes: `p-4` mínimo
- Áreas de toque amplias: `min-h-[44px]`
- Espaciado generoso: `space-y-2` o más
- Feedback visual: hover states, transiciones

## Estructura de Archivos

```
app/
├── categorias/
│   └── page.tsx                 # Página principal de categorías
├── globals.css                  # Estilos personalizados y gradientes
components/
├── CategoriesCarousel.tsx       # Carrusel de categorías (página inicio)
├── CategoriesDropdown.tsx       # Dropdown de categorías
├── GlobalAppBar.tsx             # Barra de navegación
└── Footer.tsx                   # Pie de página
```

## Implementación de la Vista Móvil

### 1. Layout Responsive

La vista móvil utiliza un sistema de grids responsive de Tailwind CSS:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

**Breakpoints utilizados:**
- `grid-cols-1`: Mobile (< 768px) - 1 columna
- `md:grid-cols-2`: Tablet (≥ 768px) - 2 columnas  
- `lg:grid-cols-3`: Desktop pequeño (≥ 1024px) - 3 columnas
- `xl:grid-cols-4`: Desktop grande (≥ 1280px) - 4 columnas

### 2. Componente de Categoría Móvil

Cada categoría se renderiza como una tarjeta optimizada para móvil:

```tsx
<div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-violet-200 transform group-hover:scale-105">
  <div className="flex flex-col items-center text-center">
    {/* Icono de categoría */}
    <div className="bg-green-gradient-br bg-green-gradient-br-hover rounded-full p-4 mb-4 transition-colors duration-300">
      <IconComponent className="text-white" size={32} />
    </div>
    
    {/* Nombre de categoría */}
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-custom transition-colors duration-300">
      {category.descripcion}
    </h3>
    
    {/* Texto descriptivo */}
    <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300">
      Ver categorias
    </p>
    
    {/* Botón de acción (aparece en hover) */}
    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-medium">
        Explorar →
      </div>
    </div>
  </div>
</div>
```

### 3. Sistema de Iconos Dinámicos

Se implementó un sistema inteligente de mapeo de iconos basado en el nombre de la categoría:

```tsx
const categoryIcons = {
  'televisores': Tv,
  'heladeras': Refrigerator,
  'lavarropas': WashingMachine,
  'microondas': Microwave,
  'aire acondicionado': AirVent,
  'iluminación': Lightbulb,
  'audio': Volume2,
  'computadoras': Monitor,
  'celulares': Smartphone,
  // ... más categorías
}

function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase()
  
  // Búsqueda exacta
  if (categoryIcons[name]) {
    return categoryIcons[name]
  }
  
  // Búsqueda parcial
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (name.includes(key) || key.includes(name)) {
      return icon
    }
  }
  
  // Icono por defecto
  return Package
}
```

### 4. Estilos y Colores Personalizados

Los colores y gradientes están definidos en `/app/globals.css`:

```css
/* Gradientes verdes personalizados */
.bg-green-gradient-br {
  background: linear-gradient(to bottom right, #8FD527, #1F632A);
}

.bg-green-gradient-br-hover:hover {
  background: linear-gradient(to bottom right, #1F632A, #8FD527) !important;
}

.text-green-custom {
  color: #1F632A;
}

.border-green-custom {
  border-color: #1F632A;
}
```

**Paleta de colores:**
- Verde principal: `#1F632A`
- Verde claro: `#8FD527`
- Gradientes dinámicos que cambian en hover

### 5. Estados de Carga

Vista de carga optimizada para móvil:

```tsx
if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-custom mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando categorías...</p>
      </div>
    </div>
  )
}
```

### 6. Navegación y Header Móvil

```tsx
{/* Header optimizado para móvil */}
<div className="text-center mb-12">
  <div className="flex items-center justify-center mb-6">
    <Home className="text-green-custom mr-3" size={48} />
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
      Mapa del Sitio
    </h1>
  </div>
  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
    Explora todas nuestras categorías de productos y encuentra exactamente lo que necesitas
  </p>
</div>

{/* Breadcrumb móvil */}
<div className="flex items-center mb-8 text-sm text-gray-500">
  <Link href="/" className="transition-colors">Inicio</Link>
  <span className="mx-2">•</span>
  <span className="text-gray-900 font-medium">Categorías</span>
</div>
```

### 7. Botón de Retorno

```tsx
<div className="text-center mt-12">
  <Link
    href="/"
    className="inline-flex items-center bg-green-gradient-lr bg-green-gradient-hover text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
  >
    <Home className="mr-2" size={20} />
    Volver al Inicio
  </Link>
</div>
```

## Optimizaciones Móviles

### 1. **Touch-Friendly**: 
- Áreas de toque amplias (padding de 6)
- Botones con tamaño mínimo de 44px

### 2. **Transiciones Suaves**:
- `transition-all duration-300`
- Efectos hover con `transform scale-105`
- Opacidad animada para elementos secundarios

### 3. **Responsive Typography**:
- `text-4xl md:text-5xl` para títulos adaptativos
- Tamaños de texto optimizados para lectura móvil

### 4. **Spacing Adaptativo**:
- `px-4 sm:px-6 lg:px-8` para márgenes responsive
- `py-12` para espaciado vertical consistente

## Carrusel de Categorías (Página de Inicio)

En `/components/CategoriesCarousel.tsx` se implementa un carrusel para mostrar categorías en la página principal:

### Características del Carrusel:
- **5 categorías por slide** en desktop
- **Navegación touch-friendly** con botones y indicadores
- **Grid responsive**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`
- **Auto-navegación** con controles manuales

```tsx
const CATEGORIES_PER_SLIDE = 5

// Grid responsive para el carrusel
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
```

### Estados del Carrusel:
```tsx
const [currentSlide, setCurrentSlide] = useState(0)
const [loading, setLoading] = useState(true)
const [isVisible, setIsVisible] = useState(false)
```

## Tecnologías Utilizadas

- **Next.js 14** con App Router
- **Tailwind CSS** para estilos responsive
- **Lucide React** para iconografía
- **TypeScript** para type safety
- **Supabase** para datos de categorías

## Integración con Backend

```tsx
// Carga de categorías desde Supabase
const loadCategories = async () => {
  try {
    const categoriesData = await getCategories()
    setCategories(categoriesData)
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    setLoading(false)
  }
}
```

## Consideraciones de Performance

1. **Lazy Loading**: Las imágenes de categorías usan carga diferida
2. **Error Handling**: Fallback a iconos por defecto si falla la carga
3. **Optimización de Re-renders**: Estado mínimo y efectos controlados
4. **Animaciones CSS**: Uso de transforms para mejor performance

## Conclusión

La vista móvil de categorías está optimizada para proporcionar una experiencia fluida y atractiva en dispositivos móviles, con un diseño que se adapta perfectamente a diferentes tamaños de pantalla y mantiene la identidad visual de la marca MuebleCenter.