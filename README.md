# Sistema de Evaluacion por QR

Sistema web para evaluar atencion por tienda desde un QR, con dashboard administrativo, filtros, exportacion CSV y respuestas separadas por ciudad y sucursal.

## Ejecutar localmente

```bash
node server.js
```

Dashboard:

```text
http://localhost:3000/admin
```

Ejemplo de QR:

```text
http://localhost:3000/avaliar/SDG01
```

## Rutas QR

- `/avaliar/SDG01`
- `/avaliar/SDG02`
- `/avaliar/CDE-PARIS`
- `/avaliar/CDE-JEBAI`
- `/avaliar/CDE-CENTRO`
- `/avaliar/ENCARNACION`
- `/avaliar/PJC-DUBAI`
- `/avaliar/ASU-PINEDO`
- `/avaliar/ASU-MULTIPLAZA`
- `/avaliar/ASU-MARIANO-GONDOLA`
- `/avaliar/ASU-MARIANO-TIENDA`
- `/avaliar/ASU-PLAZA-NORTE`
- `/avaliar/ASU-SAN-LORENZO`

## Datos

Las evaluaciones se guardan en:

```text
data/evaluations.json
```
