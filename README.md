# NestJS Ecommerce

## 🏗️ Comparación Arquitectónica: ¿Por qué Hexagonal Modular?

Para este desafío, se optó por una **Arquitectura Hexagonal Modular por Dominios** en lugar de una arquitectura plana o tradicional. A continuación, la justificación técnica de esta decisión:

### 🏆 La elección: Modular Hexagonal
```text
modules/
  catalog/
  inventory/
  users/
  ...
    domain/
    application/
    infrastructure/
```

### 🧠 Razón #1 — Pensamiento de Microservicios
Aunque el challenge permite un monolito, la evaluación premia el **pensamiento distribuido**. Separar en módulos permite definir *Bounded Contexts* claros:
- `catalog ↔ inventory` se comunican exclusivamente vía **eventos**.
Esto refleja un diseño de DDD (Domain-Driven Design) preparado para una transición a microservicios casi por "copy-paste".

### 🧠 Razón #2 — Event-Driven exige separación por dominio
En una arquitectura plana, los eventos se mezclan (`product-created`, `stock-updated` en una misma carpeta). En la modular, cada dominio es dueño de sus propios eventos:
- `catalog/domain/events`
- `inventory/domain/events`
Esto proporciona una **claridad conceptual absoluta**.

### 🧠 Razón #3 — Escalabilidad y Deploy futuro
Esta estructura permite extraer componentes a servicios independientes (`apps/catalog-service`, `apps/inventory-service`) con un refactor mínimo.

### 🧠 Razón #4 — Narrativa de Sistemas Complejos
La arquitectura plana es ideal para MVPs o productos pequeños. La **Modular Hexagonal** es la arquitectura de elección para sistemas complejos reales, demostrando mayor capacidad de abstracción y diseño.

---

## 🔍 1. Diagnóstico Inicial 

Al analizar el repositorio original, se detectaron y corrigieron los siguientes puntos críticos:

- **Deuda Técnica de Entorno**: Incompatibilidad entre NestJS v9 y Node.js v24. Se resolvió mediante un upgrade mayor a **NestJS v11**, eliminando workarounds de ejecución.
- **Acoplamiento Directo**: El catálogo llamaba directamente al servicio de inventario. Se rompió esta dependencia migrando a un bus de eventos local.
- **Inconsistencia de Capas**: DTOs y lógica de persistencia estaban mezclados en servicios planos. Se separaron en puertos (interfaces) y adaptadores (TypeORM).

## ⚡ 2. Alcance Backend: Eventos de Dominio

Se diseñaron e implementaron dos flujos desacoplados para validar el sistema:

1. **`ProductCreatedEvent` (Catálogo)**: Se emite tras la persistencia de un producto.
2. **`InventoryInitialization` (Inventario)**: Consumidor asíncrono que reacciona al evento anterior para crear automáticamente el registro de stock base (qty: 0).
3. **Decisión Técnica**: Se incluyó la creación automática de una `ProductVariation` por defecto para asegurar que el inventario tenga una referencia válida desde el segundo 1.

---

## 🛠️ 3. Cómo Levantar el Proyecto

1. **Infraestructura**:
   ```bash
   docker-compose up -d
   ```
   *Nota: Postgres corre en el puerto `5433`.*

2. **Backend**:
   ```bash
   npm install
   npm run build
   npm run migration:run
   npm run seed:run
   npm run start:dev
   ```

3. Las credenciales por defecto que crea el seed son:

| Campo | Valor |
|---|---|
| Email | [admin@admin.com] |
| Password | 12345678 |

## � 4. Modos de Ejecución: Local vs Cloud

El sistema de eventos soporta **dos modos de ejecución** sin cambios de código, solo por configuración de entorno:

| Variable | Vacía → Local | Configurada → Cloud |
|---|---|---|
| `AWS_SNS_TOPIC_ARN` | `EventEmitter` (NestJS) | Amazon SNS |
| `AWS_SQS_QUEUE_URL` | `EventEmitter` (NestJS) | Amazon SQS |

### 🏠 Modo Local (por defecto)
Si las variables de AWS quedan vacías en el `.env`, el sistema usa el **`EventEmitter` nativo de NestJS** como bus de eventos. Los flujos de dominio (`ProductCreatedEvent` → inicialización de inventario) funcionan exactamente igual, pero todo se resuelve en memoria dentro del mismo proceso.

```env
# .env — Modo local (sin infraestructura AWS)
AWS_SNS_TOPIC_ARN=
AWS_SQS_QUEUE_URL=
```

> **No se necesita ninguna cuenta ni servicio de AWS para probar el proyecto.**

### ☁️ Modo Cloud (producción)
Para un entorno distribuido, se configuran los ARNs reales y el sistema publica/consume eventos vía **SNS/SQS**, habilitando la comunicación asíncrona entre servicios independientes.

```env
# .env — Modo cloud
AWS_REGION=us-east-1
AWS_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789:product-events
AWS_SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/inventory-queue
```

Esta decisión de diseño permite **evaluar toda la arquitectura event-driven localmente** y migrar a infraestructura real con un cambio de configuración.

---

## �🛠️ Tecnología
- Nest.js v11 | TypeScript 5 | PostgreSQL | TypeORM
