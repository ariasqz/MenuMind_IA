const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

// Inicializamos el adapter de Postgres, Express, Prisma y la IA de Google
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const app = express();
const prisma = new PrismaClient({ adapter });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Configuraciones de seguridad y lectura de JSON
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Ruta principal para generar el menú y guardarlo en base de datos
app.post('/api/generar-menu', async (req, res) => {
  try {
    const { ingredientes } = req.body;

    if (!ingredientes) {
      return res.status(400).json({ error: 'Faltan los ingredientes en la petición' });
    }

    console.log(`[1/3] Generando menú para: ${ingredientes}`);

    // Llamada al modelo de Gemini
    const result = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: `Crea un menú usando exactamente estos ingredientes: ${ingredientes}`,
    });

    const respuestaTexto = result.text;
    console.log('[2/3] Menú generado exitosamente por la IA');

    // Registro histórico en PostgreSQL usando Prisma
    console.log('[3/3] Guardando resultado en base de datos...');
    await prisma.menuGenerado.create({
      data: {
        ingredientes: ingredientes,
        sugerencias: respuestaTexto,
      },
    });
    console.log('¡Registro guardado en base de datos con éxito!');

    // Devolvemos la respuesta exitosa al frontend
    return res.json({ sugerencias: respuestaTexto });

  } catch (error) {
    console.error('Error detallado en el servidor:', error);
    return res.status(500).json({ 
      error: 'Ocurrió un error interno al procesar tu solicitud o guardar en la base de datos.' 
    });
  }
});

// Arrancamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});