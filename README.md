# 🔍 VIGÍA - Valoración de Impactos Gubernamentales de IA

## 📋 Descripción

Sistema web para monitorear y analizar menciones implícitas y explícitas de Inteligencia Artificial en el Diario Oficial de la Federación, identificando gaps regulatorios y riesgos potenciales en la regulación mexicana.

## 🚀 Instalación

### Opción 1: Servidor Local Simple
```bash
# Si tienes Python instalado
python -m http.server 8000

# O con Node.js
npx http-server
```

Luego visita: `http://localhost:8000/index.html`

### Opción 2: Abrir Directamente
Simplemente abre el archivo `index.html` en tu navegador.

## 📁 Estructura de Archivos

```
.
├── index.html                       # Página principal
├── riesgos-ai-regulatorios.html    # Página de análisis detallado
├── styles.css                       # Estilos compartidos
├── script.js                        # Interactividad
├── logo-vigia.png                   # Logo del proyecto
└── README.md                        # Este archivo
```

## 🔄 Cómo Actualizar con Nuevos Análisis

### 1. Actualizar las Estadísticas del Dashboard

Modifica los números en la página de análisis `riesgos-ai-regulatorios.html`:

```html
<div class="stat-number">11</div>  <!-- Cambiar número -->
<div class="stat-label">Hallazgos Totales</div>
```

### 2. Agregar un Nuevo Hallazgo

Copia y modifica este template en la sección de hallazgos. Las tarjetas ahora incluyen funcionalidad de expandir/colapsar automática:

```html
<div class="finding-card severity-[extreme|very-high|high|medium|low]">
    <div class="finding-header">
        <div class="finding-title">
            <span class="finding-id">H[NÚMERO]</span>
            <h3>[TÍTULO DEL HALLAZGO]</h3>
        </div>
        <div class="finding-meta">
            <span class="severity-badge [extreme|very-high|high|medium|low]">
                [Extrema|Muy Alta|Alta|Media|Baja]
            </span>
            <span class="domain-badge">[DOMINIO]</span>
        </div>
    </div>

    <div class="finding-body">
        <!-- Información siempre visible -->
        <div class="finding-section">
            <h4>Tipo de Hallazgo</h4>
            <p>[Implícito - Tecnología | Explícito - AI]</p>
        </div>

        <div class="finding-section">
            <h4>Fragmento Original</h4>
            <p class="source-quote">"[CITA TEXTUAL DEL DOF]"</p>
            <p class="source-pages">[Sección, Página]</p>
        </div>

        <!-- Contenido expandible -->
        <div class="finding-details">
            <div class="finding-section">
                <h4>Riesgos Identificados</h4>
                <div class="risk-list">
                    <div class="risk-item">
                        <span class="risk-label">R[X] - [CATEGORÍA DE RIESGO]</span>
                        <p>[DESCRIPCIÓN DEL RIESGO]</p>
                    </div>
                </div>
            </div>

            <div class="finding-section">
                <h4>Análisis</h4>
                <p>[ANÁLISIS DEL HALLAZGO]</p>
            </div>

            <div class="finding-section recommendations">
                <h4>Recomendaciones</h4>
                <ul>
                    <li>[Recomendación 1]</li>
                    <li>[Recomendación 2]</li>
                </ul>
            </div>
        </div>
    </div>

    <button class="expand-btn" onclick="toggleFinding(this)">
        <span>Ver más detalles</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
    </button>
</div>
```

**Nota**: El contenido dentro de `<div class="finding-details">` se expandirá/colapsará automáticamente al hacer clic en el botón.

## 🎨 Personalización de Colores

Los colores están definidos en variables CSS al inicio de `styles.css`:

```css
:root {
    /* Colores de severidad */
    --severity-extreme: #8B0000;    /* Rojo oscuro */
    --severity-very-high: #dc2626;  /* Rojo intenso */
    --severity-high: #ea580c;       /* Naranja */
    --severity-medium: #f59e0b;     /* Amarillo */
    --severity-low: #10b981;        /* Verde */

    /* Puedes cambiar estos valores */
}
```

## 📊 Categorías de Riesgo Disponibles

- **R1**: Malfunctions & Errors (Mal funcionamiento)
- **R2**: Discrimination & Bias (Discriminación)
- **R3**: Privacy Invasions (Invasión de privacidad)
- **R7**: Labor Displacement (Desplazamiento laboral)
- **R9**: Authoritarian Surveillance (Vigilancia autoritaria)
- **R10**: Concentration of Power (Concentración de poder)

Para agregar más categorías, edita tanto el HTML como el CSS:

```css
/* En styles.css */
.risk-badge.risk-r[NÚMERO] { 
    background-color: [COLOR]; 
}
```

## 🔧 Funcionalidades Incluidas

### ✅ Implementadas
- ✓ Dashboard con estadísticas clave
- ✓ Timeline de análisis por fecha
- ✓ Cards expandibles para hallazgos
- ✓ Sistema de colores por severidad
- ✓ Diseño responsivo (móvil/tablet/desktop)
- ✓ Smooth scrolling entre secciones
- ✓ Animaciones al hacer scroll
- ✓ Navegación con links activos
- ✓ Accesibilidad con teclado (Escape para cerrar)
- ✓ Modo de impresión optimizado

### 🚧 Mejoras Futuras Sugeridas
- Buscador de hallazgos
- Filtros por categoría de riesgo
- Filtros por dependencia
- Gráficas de estadísticas
- Exportar a PDF
- Timeline histórico visual
- Sistema de versiones
- Backend para administración

## 📱 Responsive Design

La página se adapta automáticamente a:
- 📱 Móviles (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🖨️ Impresión

Para imprimir:
1. Usa `Ctrl+P` (Windows) o `Cmd+P` (Mac)
2. O ejecuta la función `printReport()` en la consola

La página automáticamente:
- Expande todos los hallazgos
- Oculta navegación y botones
- Optimiza el diseño para impresión

## 🎯 Mejores Prácticas para Actualización

### ✅ DO's
- Mantén el formato consistente
- Usa los mismos identificadores de riesgo (R1-R10)
- Actualiza siempre el dashboard con los totales
- Mantén el orden cronológico (más reciente primero)
- Usa emojis para mejor escaneabilidad

### ❌ DON'Ts
- No modifiques la estructura básica de las tarjetas
- No elimines las clases CSS existentes
- No olvides cerrar las etiquetas HTML
- No uses colores personalizados sin actualizar el CSS

## 🐛 Troubleshooting

### Los estilos no se cargan
- Verifica que `styles.css` esté en el mismo directorio
- Revisa la consola del navegador (F12) para errores

### Los botones de expandir no funcionan
- Verifica que `script.js` esté en el mismo directorio
- Asegúrate de que el navegador permita JavaScript

### El diseño se ve roto
- Verifica que no hayas eliminado clases CSS por error
- Revisa que todas las etiquetas HTML estén cerradas

## 📚 Recursos Adicionales

- [Diario Oficial de la Federación](https://dof.gob.mx)
- Documentación de referencia sobre riesgos de IA disponible en el repositorio del proyecto

## 🤝 Contribuciones

Para reportar hallazgos adicionales o sugerencias de mejora, documenta:
1. Fecha del DOF analizado
2. Dependencia emisora
3. Categorías de riesgo identificadas
4. Gap regulatorio específico
5. Recomendaciones

## 📄 Licencia

Este proyecto es de código abierto para fines de transparencia gubernamental.

## 📧 Contacto

Para más información sobre VIGÍA y el análisis de riesgos de IA en regulación mexicana.

---

**Última actualización**: 3 de noviembre de 2025
**Versión**: 1.0.0
**Una iniciativa de AI Safety Mexico**
