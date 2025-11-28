# Frontend React con Redux - Sistema de Autenticación

Este proyecto implementa un sistema de autenticación utilizando **Redux Toolkit** como gestor de estado global. Es la versión con Redux del mismo proyecto que usa Context API.

## Índice

1. [¿Qué es Redux?](#qué-es-redux)
2. [Principios Fundamentales](#principios-fundamentales-de-redux)
3. [Conceptos Clave](#conceptos-clave)
4. [Redux Toolkit](#redux-toolkit)
5. [Flujo de Datos en Redux](#flujo-de-datos-en-redux)
6. [React-Redux: Conectando React con Redux](#react-redux-conectando-react-con-redux)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Comparación: Context vs Redux](#comparación-context-vs-redux)
9. [Cuándo Usar Redux](#cuándo-usar-redux)
10. [Instalación y Uso](#instalación-y-uso)

---

## ¿Qué es Redux?

**Redux** es una librería de JavaScript para gestionar el estado de aplicaciones de forma predecible. Aunque se usa frecuentemente con React, es independiente de cualquier framework.

### El Problema que Resuelve

En aplicaciones React grandes, el estado puede volverse difícil de manejar:

```
     ┌─────────────────────────────────────────────────────┐
     │                      App                            │
     │                       │                             │
     │          ┌────────────┼────────────┐               │
     │          ▼            ▼            ▼               │
     │       Header       Main        Footer              │
     │          │            │                            │
     │     ┌────┴────┐  ┌────┴────┐                       │
     │     ▼         ▼  ▼         ▼                       │
     │   Nav      User  Sidebar  Content                  │
     │                     │                              │
     │               ┌─────┼─────┐                        │
     │               ▼     ▼     ▼                        │
     │            Menu  Widget  Profile ← necesita datos  │
     │                              │     del usuario     │
     └──────────────────────────────┼─────────────────────┘
                                    │
                          ¿Cómo llegan los datos aquí?
```

**Sin Redux (Prop Drilling):**
Los datos del usuario tendrían que pasar por App → Main → Content → Profile.
Cada componente intermedio debe recibir y pasar las props aunque no las use.

**Con Redux:**
Profile accede directamente al estado global sin necesidad de props intermedias.

---

## Principios Fundamentales de Redux

Redux se basa en tres principios que hacen el estado predecible:

### 1. Única Fuente de Verdad (Single Source of Truth)

Todo el estado de la aplicación se almacena en un único **store**:

```javascript
// Así se ve el estado completo de la aplicación
{
  auth: {
    user: { email: "usuario@ejemplo.com" },
    token: "jwt-token-xxx",
    isAuthenticated: true,
    loading: false,
    error: null
  },
  // Otros slices del estado...
  products: { items: [], loading: false },
  cart: { items: [], total: 0 }
}
```

**Ventajas:**
- Fácil de debuggear (puedes ver todo el estado en un solo lugar)
- Estado predecible y consistente
- Facilita funcionalidades como "deshacer/rehacer"

### 2. El Estado es de Solo Lectura (State is Read-Only)

La única forma de cambiar el estado es emitiendo una **acción**:

```javascript
// Incorrecto - Modificar directamente
state.user = { email: "nuevo@email.com" };

// Correcto - Disparar una acción
dispatch({
  type: 'auth/loginSuccess',
  payload: { email: "nuevo@email.com", token: "xxx" }
});
```

**Ventajas:**
- Cambios rastreables (cada acción es un registro)
- Facilita el debugging con Redux DevTools
- Evita modificaciones accidentales

### 3. Cambios con Funciones Puras (Pure Functions)

Los **reducers** son funciones puras que calculan el nuevo estado:

```javascript
// Un reducer es una función pura:
// - Mismo input → siempre mismo output
// - Sin efectos secundarios
// - No modifica el estado original

function authReducer(state, action) {
  switch (action.type) {
    case 'auth/loginSuccess':
      return {
        ...state,  // Copiamos el estado anterior
        user: { email: action.payload.email },
        token: action.payload.token,
        isAuthenticated: true
      };
    default:
      return state;
  }
}
```

---

## Conceptos Clave

### Store

El **store** es el objeto que contiene todo el estado de la aplicación:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// El store tiene tres métodos principales:
store.getState();      // Obtiene el estado actual
store.dispatch(action); // Dispara una acción
store.subscribe(fn);    // Se suscribe a cambios
```

### Actions (Acciones)

Las **acciones** son objetos planos que describen qué ocurrió:

```javascript
// Acción simple
{ type: 'auth/logout' }

// Acción con datos (payload)
{
  type: 'auth/loginSuccess',
  payload: {
    email: 'usuario@ejemplo.com',
    token: 'jwt-token-xxx'
  }
}
```

### Action Creators

Funciones que crean acciones (Redux Toolkit los genera automáticamente):

```javascript
// Sin Redux Toolkit - Manual
const loginSuccess = (email, token) => ({
  type: 'auth/loginSuccess',
  payload: { email, token }
});

// Con Redux Toolkit - Automático
const authSlice = createSlice({
  name: 'auth',
  reducers: {
    loginSuccess: (state, action) => { ... }
  }
});

export const { loginSuccess } = authSlice.actions;
// loginSuccess({ email, token }) genera:
// { type: 'auth/loginSuccess', payload: { email, token } }
```

### Reducers

Los **reducers** especifican cómo cambia el estado en respuesta a acciones:

```javascript
// Reducer tradicional (sin Redux Toolkit)
function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'auth/loginSuccess':
      return {
        ...state,
        user: { email: action.payload.email },
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'auth/logout':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
}
```

### Selectors

Los **selectors** extraen datos específicos del estado:

```javascript
// Selector simple
const selectUser = (state) => state.auth.user;

// Selector derivado
const selectUserEmail = (state) => state.auth.user?.email;

// Uso en componentes
const user = useSelector(selectUser);
```

---

## Redux Toolkit

**Redux Toolkit (RTK)** es la forma oficial y recomendada de usar Redux. Simplifica enormemente la configuración y reduce el código boilerplate.

### ¿Por qué Redux Toolkit?

| Sin RTK | Con RTK |
|---------|---------|
| Configuración manual del store | `configureStore()` automático |
| Actions y reducers separados | `createSlice()` genera ambos |
| Inmutabilidad manual con spread | Immer permite "mutaciones" |
| Middleware manual | Thunk incluido por defecto |
| DevTools manual | DevTools automático |

### createSlice

`createSlice` es la función principal de Redux Toolkit:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  // Nombre del slice (prefijo para action types)
  name: 'auth',

  // Estado inicial
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },


  reducers: {
    loginStart: (state) => {
      state.loading = true;  
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = { email: action.payload.email };
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// Actions generadas automáticamente
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Reducer para el store
export default authSlice.reducer;
```

### Immer: Inmutabilidad Simplificada

Redux requiere inmutabilidad, pero Immer (incluido en RTK) lo hace fácil:

```javascript
// Sin Immer - Tedioso y propenso a errores
return {
  ...state,
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      name: action.payload.name
    }
  }
};

// Con Immer - Simple y legible
state.user.profile.name = action.payload.name;
// Immer detecta los cambios y crea automáticamente un nuevo objeto
```

---

## Flujo de Datos en Redux

El flujo de datos en Redux es **unidireccional** y predecible:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Usuario hace click en "Login"                          │
│                    │                                        │
│                    ▼                                        │
│  ┌─────────────────────────────────┐                       │
│  │          COMPONENTE             │                       │
│  │   dispatch(loginStart())        │◄──────────┐           │
│  └─────────────────────────────────┘           │           │
│                    │                           │           │
│                    ▼                           │           │
│  ┌─────────────────────────────────┐           │           │
│  │           ACCIÓN                │           │           │
│  │  { type: 'auth/loginStart' }    │           │           │
│  └─────────────────────────────────┘           │           │
│                    │                           │           │
│                    ▼                           │           │
│  ┌─────────────────────────────────┐           │           │
│  │           REDUCER               │           │           │
│  │  (state, action) => newState    │           │           │
│  └─────────────────────────────────┘           │           │
│                    │                           │           │
│                    ▼                           │           │
│  ┌─────────────────────────────────┐           │           │
│  │            STORE                │           │           │
│  │  { auth: { loading: true } }    │───────────┘           │
│  └─────────────────────────────────┘  useSelector detecta  │
│                                        el cambio y         │
│                                        re-renderiza        │
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo Práctico: Proceso de Login

```javascript
// 1. Usuario envía el formulario
const handleSubmit = async (e) => {
  e.preventDefault();

  // 2. Dispatch de acción "inicio de login"
  dispatch(loginStart());
  // Estado: { loading: true, error: null }

  try {
    // 3. Llamada al backend
    const response = await authService.signin(email, password);

    // 4. Dispatch de acción "login exitoso"
    dispatch(loginSuccess({
      token: response.data.accessToken,
      email: email,
    }));
    // Estado: { loading: false, isAuthenticated: true, user: {...} }

    navigate('/dashboard');

  } catch (err) {
    // 4b. Dispatch de acción "login fallido"
    dispatch(loginFailure(err.message));
    // Estado: { loading: false, error: "Credenciales inválidas" }
  }
};
```

---

## React-Redux: Conectando React con Redux

**React-Redux** es la librería oficial para usar Redux con React.

### Provider

El `Provider` hace que el store esté disponible para toda la aplicación:

```jsx
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <MiAplicacion />
    </Provider>
  );
}
```

### useSelector

`useSelector` extrae datos del store:

```jsx
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from './store';

function Profile() {
  // Forma recomendada: usando selectores
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuthenticated);

  // Forma directa (menos mantenible)
  const email = useSelector(state => state.auth.user?.email);

  return <div>Bienvenido, {user?.email}</div>;
}
```

**Importante:** `useSelector` causa re-render cuando el valor seleccionado cambia.

### useDispatch

`useDispatch` retorna la función `dispatch` del store:

```jsx
import { useDispatch } from 'react-redux';
import { logout } from './store';

function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <button onClick={handleLogout}>Cerrar Sesión</button>;
}
```

---

## Estructura del Proyecto

```
frontend_react_redux/
├── src/
│   ├── store/                 # Todo lo relacionado con Redux
│   │   ├── index.js           # Barrel export (exportación centralizada)
│   │   ├── store.js           # Configuración del store
│   │   └── authSlice.js       # Slice de autenticación
│   │
│   ├── services/
│   │   └── api.js             # Servicios de comunicación con backend
│   │
│   ├── components/
│   │   └── ProtectedRoute.jsx # Ruta protegida (usa Redux)
│   │
│   ├── pages/
│   │   ├── Login.jsx          # Página de login (usa Redux)
│   │   ├── Register.jsx       # Página de registro
│   │   └── Dashboard.jsx      # Dashboard (usa Redux)
│   │
│   ├── App.jsx                # Componente raíz con Provider
│   ├── main.jsx               # Punto de entrada
│   └── *.css                  # Estilos
│
├── package.json
├── vite.config.js
└── README.md
```

### Descripción de Archivos del Store

| Archivo | Descripción |
|---------|-------------|
| `store.js` | Configura el store con `configureStore` |
| `authSlice.js` | Define estado, reducers y selectores de autenticación |
| `index.js` | Exporta todo desde un solo punto (barrel export) |

---

## Comparación: Context vs Redux

| Aspecto | Context API | Redux |
|---------|-------------|-------|
| **Complejidad** | Simple | Más complejo pero más estructurado |
| **Boilerplate** | Mínimo | Más código (reducido con RTK) |
| **DevTools** | No incluido | Excelentes herramientas de debugging |
| **Rendimiento** | Re-render en todo el árbol | Optimizado por selector |
| **Middleware** | Manual | Thunk incluido, fácil de añadir otros |
| **Escalabilidad** | Limitada | Excelente |
| **Curva de aprendizaje** | Baja | Media-Alta |
| **Comunidad** | Parte de React | Gran ecosistema y comunidad |

### Código Comparativo

**Context API:**
```jsx
// Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const login = (token, email) => setUser({ email });
  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};

// Componente
const { user, login } = useUser();
login(token, email);
```

**Redux:**
```jsx
// Slice
const authSlice = createSlice({
  name: 'auth',
  reducers: {
    loginSuccess: (state, action) => {
      state.user = { email: action.payload.email };
    }
  }
});

// Componente
const dispatch = useDispatch();
const user = useSelector(selectUser);
dispatch(loginSuccess({ email, token }));
```

---

## Cuándo Usar Redux

### USA Redux cuando:

- La aplicación tiene **estado global complejo**
- **Múltiples partes** de la app necesitan acceder al mismo estado
- El estado se **actualiza frecuentemente**
- La lógica de actualización es **compleja**
- La app tiene un **tamaño medio-grande**
- Necesitas **debugging avanzado** (DevTools)
- El proyecto tiene un **equipo grande**

### NO uses Redux cuando:

- La aplicación es **pequeña/simple**
- El estado es **mayormente local**
- Solo unos pocos componentes comparten estado
- **Context API** es suficiente
- Quieres mantener la **simplicidad**

### Alternativas a considerar:

- **Zustand**: Redux simplificado, menos boilerplate
- **Jotai/Recoil**: Estado atómico, más granular
- **TanStack Query**: Para estado del servidor (caché de datos)
- **Context + useReducer**: Para casos simples

---

## Instalación y Uso

### Requisitos

- Node.js 18+
- npm o yarn
- Backend corriendo en `http://localhost:3000`

### Instalación

```bash
# Navegar al directorio
cd frontend_react_redux

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Ejecutar linter
```

### Dependencias Principales

```json
{
  "@reduxjs/toolkit": "^2.3.0",  // Redux Toolkit
  "react-redux": "^9.2.0",        // Conexión React-Redux
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6"
}
```

---

## Redux DevTools

Redux DevTools es una extensión de navegador esencial para debugging:

### Instalación

1. Instala la extensión para [Chrome](https://chrome.google.com/webstore/detail/redux-devtools) o [Firefox](https://addons.mozilla.org/es/firefox/addon/reduxdevtools/)

2. Redux Toolkit configura automáticamente la conexión

### Funcionalidades

- **State**: Ver el estado completo del store
- **Action**: Historial de todas las acciones
- **Diff**: Ver qué cambió con cada acción
- **Time Travel**: Navegar por el historial de estados
- **Export/Import**: Guardar y cargar estados

```
┌─────────────────────────────────────────────────────────────┐
│ Redux DevTools                                              │
├─────────────────────────────────────────────────────────────┤
│ Actions          │  State                                   │
│ ─────────────────│───────────────────────────────────────── │
│ auth/loginStart  │  auth: {                                 │
│ auth/loginSuccess│    user: { email: "test@test.com" },     │
│ ▶ auth/logout    │    token: null,                          │
│                  │    isAuthenticated: false,               │
│                  │    loading: false,                       │
│                  │    error: null                           │
│                  │  }                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Recursos Adicionales

- [Documentación oficial de Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React-Redux](https://react-redux.js.org/)
- [Redux Essentials Tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)

---

## Conclusión

Redux, especialmente con Redux Toolkit, es una herramienta poderosa para gestionar el estado en aplicaciones React complejas. Aunque tiene una curva de aprendizaje más pronunciada que Context API, los beneficios en términos de:

- **Predictibilidad** del estado
- **Debugging** con DevTools
- **Escalabilidad** del código
- **Trazabilidad** de cambios

Lo hacen una excelente opción para aplicaciones medianas y grandes donde el estado compartido es crítico.

La clave está en elegir la herramienta adecuada para cada proyecto: Context para lo simple, Redux para lo complejo.
