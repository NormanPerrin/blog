---
title: Primer curso de NodeJS
description: Reflexiones de dar un curso de 3 meses sobre NodeJS
published: 2019-12-16
category: personal
lang: es
type: public
---

Horas después de haber participado de la presentación de proyectos finales por el curso de NodeJS de [Comunidad IT](http://www.comunidadit.org/), comparto algunas reflexiones sobre la cursada.

Ya voy advirtiendo que la info no va a estar perfectamente ordenada, voy escribiendo como sale.

## El plan

Tenía algo escrito en detalle sobre la planificación que hice antes de la cursada, pero lamentablemente ese apunte lo borré.

Más o menos lo que había pensado era lo siguiente.

### Formas

**No enseñar magia**: que entiendan cómo funcionan las cosas. No dar frameworks o herramientas de alto nivel si con algo más de esfuerzo pueden usar las herramientas que provee la plataforma y obtener el mismo, o mejor, resultado.

**No usar slides**: considero que las slides solo tienen fin de presentación, y para una clase prefiero presentar mostrando un ejemplo real, así ven cómo se puede hacer de paso. Y si necesito una ayuda gráfica mientras presento abro una imagen a lo sumo, o uso un pizarrón;

**Explicación seguida de práctica**;

**No práctica para casa excesiva**: ya que muchos trabajan o van a la facultad. Sabía que contaba con esa limitación desde el principio. Aunque tendría material para los que quieran hacer;

**Explicaciones grabadas y apuntes escritos**.

### Temas

Antes de la cursada ya tenía apuntes hechos de frontend por otros cursos.

- **Desarrollo web**: HTML, CSS, JS.
- **Desarrollo servidores**: creación de servicios, integración con servicios externos, persistencia de datos, seguridad, y más (... así lo tenía escrito).

### Objetivos

> Para el final de la cursada deberán poder saber cómo encarar proyectos relacionados a sistemas de información, con Node.js como tecnología para programar servidores (computadoras), entendiendo y pudiendo explicar las tareas a realizar para llevar a cabo el proyecto.

- **Asistencias**: Cumplir con un +75%.
- **Hacer proyecto final**: que sea una representación de los conceptos aprendidos en la cursada.

### Tiempos

Con lo que había planificado en principio se hubiesen terminado con los temas en 2 meses, y hubiese quedado 1 mes para sus proyectos finales.

## La realidad

Creo que siempre pude mantener mis formas y respeté mis opiniones, porque a lo largo del curso vi que funcionaban.

Algunas cosas las tuve que ir modificado según imprevistos y expectativas irreales para el común de la gente que empieza a programar, no por sus capacidades, sino por otros factores que voy a ir mencionando más adelante.

### Formas

**No enseñar magia**: pude mantener esta forma muy bien con la parte de frontend, pero en el back hacer servidores con el módulo `http` únicamente se hace bastante complicado. Así que 1 semana después de haber enseñado `http`, aunque no lo cacharon del todo bien, empezamos con `express`, lo cual les facilitó bastante la vida;

**No usar tanto slides**: resultó muy bien. Solo que algunas veces no tenía el pizarrón y no podía dibujar para explicar algo gráfico;

**Explicación seguida de práctica**: hubo algunas clases que por limarme y querer llegara a explicar cierto tema me pasaba de tiempo y quizás en esa clase no hacíamos práctica. No fueron muchas las clases en las que pasó eso, creo que 3, pero en las que pasó noté que fueron un desastre. La práctica es fundamental y no se puede pasar de largo. Las clases en las que no hubo práctica tuvieron que ser repetidas por completo;

**Explicaciones grabadas y apuntes escritos**: resultó genial también. Muchas veces en clase en vez de ir a alguna documentación o apuntes míos preferían ir a los videos... lo cual no era muy práctico, pero entiendo que al principio lo vean como algo más ameno.

### Temas

**Desarrollo web**: Genial. Pudimos ver manipulación con DOM y el uso de `fetch` con `async` `await` con los otros temas base de JS. Esta parte la hicieron ayudándose con los apuntes que les hice. No tenían que investigar tanto;

**Desarrollo servidores**: acá les solté un poco la mano dejando que investiguen. Paré de darles puré de manzana. Ya que en el trabajo no les van a dar todo servido, paso a paso, quise que la última parte se pongan a buscar y preguntar. Esta parte es la que más les costó. Si les daba apuntes con todo servido hubiesen entendido más, me pareció correcta la decisión que tomé igualmente. No llegamos a ver seguridad "y más", pero sí llegamos a ver bases de datos, aunque no en profundidad. Esta parte fue mérito de los alumnos, yo hacía más que nada práctica y respondía preguntas. Otra cosa a tener en cuenta es que enseñé algunos temas que terminaron siendo independientes NodeJS.

### Objetivos

**Asistencias**: Casi todos sobre el límite, con abandonos. Los que abandonaron fue o por la facultad o porque consiguieron trabajo. Personalmente yo trato a mis alumnos como gente adulta, y si quieren faltar que falten, después ven cómo hacen con las faltas, pero no voy a estar atrás de ellos todo el tiempo, o por lo menos no me gustaría, y eso es lo que hice;

**Hacer proyecto final**: me sorprendieron con los proyectos finales que vi. Todos muy originales y creativos, aunque hubo desniveles, algunos solo pudieron hacer un front mientras que otros sobrepasaron los temas enseñados en clase. Los resultados van a ser distintos siempre y algunos van a estar más motivados que otros.

### Imprevistos

**Instalaciones**: muchas veces tardamos en arrancar la clase por entrega de notebooks tardía, y también tuvimos varios problemas con la conexión a internet;

**Faltazos**: lamentablemente la gente falta, y aunque piensan que después en casa se ponen al día, no lo hacen. Esto retraza a los compañeros que asisten regularmente a las clases y siguen los temas. No se puede hacer mucho con este punto. Depende de la prioridad que le den al curso sobre lo otro que tengan en su vida;

**Faltazos estando presente**: no toda la gente viene fresquita a cursar, algunos trabajan de noche, otros quizás tienen problemas de antención o no les importa el curso y se ponen con el celu, miran noticias, etc. Lo primero lo entiendo, lo segundo lo tomo como una falta de respeto. Igualmente ayudo a todos, lo que sí remarco que repasen un tema si están muy atrasados. Los trato como gente adulta y dejo que se equivoquen y aprendan. Mis clases las intento hacer dinámicas siempre, y aunque haya recibido feedback positivo sobre este último punto, no puedo asegurar que fue entretenido para todos;

**Clases que salieron mal**: algunas clases, creo que 3, fueron para mi un desastre, esas clases se tuvieron que hacer de nuevo;

**Evacuaciones**: 2 evacuaciones durante la cursada, equivalen a 1 clase más o menos, puede ser considerable;

**Me enfermé y falté 2 clases durante los 3 meses**: afortunadamente a esas clases pudieron ir algunos ayundantes y se encargaron que no pierdan la clase por completo, y la aprovecharon para hacer práctica;

**Hacía falta más práctica**: no solo alcanza con mitad de la clase, sino también hice días de práctica integral.

Estos imprevistos hicieron que tenga que mover la finalización de temas más adelante, dejando 1 semana para sus proyectos solamente.

## Balanza

De lo anterior, voy a intentar dividir lo que me parece que estuvo bien y mal de mi cursada.

### Seguir haciendo.

- Videos y apuntes.
- No enseñar magia.
- Enseñar temas comunes a todas tecnologías.
- No slides.
- Práctica.
- No tarea para casa.
- Ayudantes.

### Mejorar

- No saltearme práctica en clases por intentar llegar a un tema, en 3 ocaciones.
- En las primeras clases no aprovechar el tiempo de espera de alumnos para ir haciendo práctica, se desperdiciaba como media hora esperando gente, afortunadamente en el último mes se aprovechó.
- No comer ensalada de sushi mala y enfermarse.

### Sumatoria

Creo que el curso salió genial. Hay algunas clases que considero que las di mal y fueron desperdiciadas, se podrían haber aprovechado para hacer más práctica y ir más profundo en un tema.

Pero con el tiempo de la cursada, 3 meses, creo que los temas que se vieron fueron suficientes.

Como mayor crítica diría que faltó más práctica.

## Conclusiones

El enseñar me encanta, pero no soy psicólogo, por lo que estar encima de los alumnos y preocuparme por sus problemas es algo que no me llama la anteción y en lo que tampoco soy bueno;

Al tener alumnos que faltan, o vienen y no prestan atención, y retrazan a otros alumnos, me gustaría elegir a las personas a las que enseño. Creo que lo mejor es tener un grupo reducido, como de 6 personas, y que pasen por un proceso de selección que sea más estricto con las otras actividades que puedan influir en la asistencia regular al curso;

En cierta medida, parecido a las universidades públicas, no creo que los alumnos aprecien la oportunidad que tienen cuando se los beca o acceden a un curso "gratuito". Y el que hayan llegado al final, no signifique que hayan aprovechado al máximo el curso. Hay algunos que se comprometen más que otros. Para esto no digo que paguen algo simbólico, pero sí que se sea más estrictos con las faltas y que haya evaluaciones intermedias en el curso para ver si siguen o no.

## Agradecimientos

Gracias a

- [Comunidad IT](http://www.comunidadit.org/) por confiar en mi para llevar adelante el curso de NodeJS.
- Los colaboradores por darme una mano gigante con las clases. Gracias [Alan Gaia](https://www.instagram.com/valiant_182/), [Camila Celeste](https://twitter.com/CamilaGaunaCel1), y un especial agradecimiento a [Fernando Díaz](https://twitter.com/__FernandoDiaz).
- [Atos](https://atos.net/) por las instalaciones.
- Los alumnos que tuve y llegaron al final.

Los alumnos la verdad que siempre vinieron con muy buena onda. Me encanta el curso que me tocó, y aunque tuvimos algunos imprevistos y dificultades, el curso salió genial en mi opinión. Puedo ser muy crítico, pero estoy contento con el resultado final.

![Foto final del curso de NodeJS por Comunidad IT en Atos](/img/curso-nodejs-foto-final.jpg)
