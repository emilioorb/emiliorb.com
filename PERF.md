# Registro de rendimiento

Lighthouse móvil sobre el build de producción, portada. Cada idea se mide contra la anterior con 5 corridas alternadas y se compara la mediana; si queda dentro del ruido, se revierte.

| Idea | Antes → después (mediana) | Veredicto | Por qué |
|---|---|---|---|
| Arreglos de la auditoría de movimiento, rendimiento y móvil (memo de escenas, subtítulos `backwards`, Lenis en el reloj de GSAP, paradas medidas una vez) | puntaje 75 → 83–85, TBT 1.120 → 560–640 ms | se queda | Desaparece la tarea larga de Lenis y baja el trabajo por frame. |
| Coreografías de a una escena por tarea (`scheduler.yield`) | TBT 1.125 → 591 ms | se queda | El armado de GSAP fuerza maquetación en cada lectura; partido, ninguna tarea pasa el segundo. |
| `content-visibility: auto` en los lienzos fijos | TBT 560–640 → 810–1.960 ms | revertido | Con lienzos `sticky` apilados el navegador reevalúa la visibilidad cada frame. |
| Sacar todo el armado de GSAP del commit de React | TBT 470–650 → 700–810 ms | revertido | Mueve el trabajo pero sigue dentro de la ventana del TBT, en más tareas. |
| Apagar `text-wrap: balance` | sin cambio medible | descartado | No es el costo del primer pintado. |
| `content-visibility: auto` en las secciones (no en los lienzos) | puntaje 71 → 71, TBT 614 → 541 ms | revertido | Dentro del ruido: los rangos de las 5 corridas se superponen. |
