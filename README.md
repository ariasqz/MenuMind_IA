# MenuMind IA

**Convierte lo que tienes disponible en tu inventario en un menú completo, generado por IA.**

MenuMind IA es una API full-stack que recibe una lista de ingredientes y usa **Google Gemini** para crear sugerencias de menú al instante, guardando el historial de cada generación en una base de datos PostgreSQL.

---

- **Generación de menús con IA** usando Google Gemini
- **Persistencia en PostgreSQL** con Prisma ORM
- **Totalmente dockerizado**: backend, base de datos y panel de administración
- Frontend en Next.js para probar la generación desde el navegador

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| ORM | Prisma 7 |
| IA | Google Gemini |
| Frontend | Next.js |
| Infraestructura | Docker + Docker Compose |

---

## Endpoint principal

**`POST /api/generar-menu`**

Recibe una lista de ingredientes y devuelve una sugerencia de menú generada por IA, guardando el resultado en base de datos.

```json
{
  "ingredientes": "pollo, arroz, limón"
}
```


