# Tienda DR Envío - Prueba Técnica

  <p>Una plataforma moderna para organizar y gestionar tu información digital</p>

[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000?style=for-the-badge)](https://shadcn.dev)

</div>

## 📋 Tabla de Contenidos

- [📃 Introducción](#-introducción)
- [✨ Características](#-características)
- [⚙️ Instalación](#️-instalación)
- [🛠️ Tecnologías](#️-tecnologías)
- [👨‍💻 Desarrollador](#-desarrollador)

## 📃 Introducción

Tienda DR Envío es una aplicación web moderna desarrollada con Next.js que permite gestionar productos y precios especiales para diferentes usuarios. La aplicación está diseñada para ofrecer una experiencia de usuario fluida y responsiva, con una interfaz intuitiva que facilita la administración de productos y precios personalizados.

## ✨ Características

- **Gestión de productos**: Visualización y búsqueda de productos disponibles en la tienda.
- **Precios especiales**: Asignación de precios personalizados a usuarios específicos.
- **Panel de administración**: Interfaz para crear, editar y eliminar precios especiales.
- **Diseño responsivo**: Experiencia optimizada para dispositivos móviles y de escritorio.
- **Interfaz moderna**: UI elegante y funcional con componentes reutilizables.

## ⚙️ Instalación

### Prerrequisitos

- Node.js 18.x o superior
- node.js & npm

1. Clona el repositorio:

```bash
git clone https://github.com/sebas19957/frontend-challenge-drenvio
```

2. Instala las dependencias:

```bash
cd special-price-drenvio
npm install
```

3. Configura las variables de entorno:

```bash
cp .env.example .env.local
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Construye la aplicación para producción:

```bash
npm run build
```

6. Inicia la aplicación en modo producción:

```bash
npm run start
```

## 🛠️ Tecnologías

Esta aplicacion está construido con tecnologías modernas:

- **Framework**: [React.js 18.3.1](https://react.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Iconos**: [Lucide Icons](https://lucide.dev/)
- **Data Fetching**: [SWR](https://swr.vercel.app/) & [Axios](https://axios-http.com/)
- **Enrutamiento**: [React Router 6](https://reactrouter.com/)

## 🏅 Justificación de elecciones técnicas

### TypeScript

El lenguaje principal elegido fue TypeScript y, para ello, vale la pena resaltar algunas razones fundamentales:

- **Tipado estático**: Aporta detección de errores en tiempo de desarrollo, lo que disminuye la cantidad de bugs en producción.
- **Mejor documentación**: Los tipos también se pueden considerar como documentación en vivo, lo que ayuda bastante a entender partes desconocidas del código.
- **Escalabilidad**: estructurar a largo plazo. Hacer proyectos más grandes en comparación con JavaScript puro y no perder la conciencia de lo que ya se ha conseguido.

### SWR (Stale-While-Revalidate)

Pese a que el proyecto actualmente utiliza hooks personalizados para la gesión de los dato s, su implementación debería beneficiarse de SWR por varias razones:

- **Caché y revalidación automática**: Mantiene los datos actualizados mientras muestra datos en caché para una experiencia de usuario más rápida.
- **Reintento automático**: Maneja automáticamente los reintentos en caso de fallos de red.
- **Desduplicación de solicitudes**: Evita solicitudes redundantes al mismo endpoint.
- **Experiencia en tiempo real**: Proporciona actualizaciones en tiempo real con revalidación periódica.

### Axios

La implementación de Axios para las solicitudes HTTP ofrece ventajas significativas:

- **Interceptores**: Permite modificar solicitudes o respuestas globalmente.
- **Transformación automática de datos JSON**: Simplifica el manejo de respuestas.
- **Soporte para progreso de carga**: Útil para mostrar indicadores de progreso en cargas de archivos.

### Tailwind CSS

Tailwind CSS fue elegido como framework de estilos por varias razones:

- **Desarrollo rápido**: Permite construir interfaces complejas de manera ágil utilizando clases utilitarias.
- **Personalización**: Hace más fácil diseñar elementos únicos sin necesidad de sobrescribir estilos existentes.
- **Optimización para producción**: Reduce el CSS a lo mínimo en producción gracias a la función de purge.
- **Diseño responsivo**: Facilita la creación de interfaces que se adaptan a diferentes dispositivos.
- **Consistencia visual**: Asegura un sistema de diseño uniforme en toda la aplicación.

### shadcn/ui

La biblioteca de componentes shadcn/ui fue elegida por:

- **Componentes accesibles**: Construidos sobre Radix UI, lo que asegura su accesibilidad.
- **Altamente personalizables**: Permite ajustar los componentes al diseño específico del proyecto.
- **No es una dependencia**: Los componentes se integran directamente en el proyecto, evitando dependencias externas.
- **Tipado completo**: Se integra a la perfección con TypeScript.
- **Estilizado con Tailwind**: Complementa de manera ideal nuestra elección de Tailwind CSS.
- **Diseño moderno**: Estética contemporánea y profesional lista para usar.
- **Fácil de utilizar**: Simplemente, me parece muy fácil de utilizar

## 👨‍💻 Desarrollador

<div align="center">
  <img src="https://avatars.githubusercontent.com/sebas19957" width="100px" style="border-radius: 50%;" alt="Sebastian Mosquera Valencia"/>
  <h3>Sebastian Mosquera Valencia</h3>
  <p>Desarrollador Full Stack</p>
  
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/semosva/)
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sebas19957)
</div>

---

<div align="center">
  <p>Hecho con ❤️ por Sebastian Mosquera Valencia</p>
</div>
