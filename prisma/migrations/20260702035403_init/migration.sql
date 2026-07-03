-- CreateTable
CREATE TABLE "MenuGenerado" (
    "id" SERIAL NOT NULL,
    "ingredientes" TEXT NOT NULL,
    "sugerencias" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuGenerado_pkey" PRIMARY KEY ("id")
);
