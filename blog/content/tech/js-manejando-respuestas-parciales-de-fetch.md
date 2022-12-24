---
title: JS. Manejando respuestas parciales de fetch
description: Diferencias entre XMLHttpRequest y fetch para manejar las respuestas parciales de un request
published: 2021-10-30
category: tech
type: public
lang: es
---

Generalmente cuando hacemos un request desde el browser esperamos 1 respuesta:

```js
const response = await fetch('/'),
    text = await response.text();

// ta-da!
```

Pero qué pasa si esa respuesta es lenta y en el medio queremos ir obteniendo resultados parciales? Cómo los podemos ir mostrando?

## Escenario

Vamos a poner como ejemplo que desde el FE (Front End), queremos ejecutar un shell script en nuestro servidor e ir obteniendo el output que da, digamos que el script a ejecutar es algo así:

_test.sh_

```bash
#!/bin/sh

echo Uno
sleep 2
echo Dos
sleep 2
echo Tres
sleep 2
echo Fin!
```

En total la ejecución de ese script será de 6 segundos, y nosotros queremos ir mostrando cada mensaje a medida que los va sacando ese script.

## Usando XMLHttpRequest

El primer approach que se me ocurrió fue usar [XMLHttpRequest](https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest).

```html
<form onsubmit="enviarComando(event)">
    <input type="text"></input>
</form>

<pre class="resultado"></pre>

<script>
    const contenedorResultado = document.querySelector('.resultado');

    function enviarComando(e) {
        e.preventDefault();

        const input = e.target.children[0],
            comando = input.value;

        input.value = '';
        contenedorResultado.textContent = '';

        const request = new XMLHttpRequest();

        request.onprogress = (progreso) => {
            contenedorResultado.textContent = progreso.target.responseText;
        };

        request.open('POST', '/');
        request.send(comando);
    }
</script>
```

_Para ver el código completo con el servidor y script pueden ver [este repositorio](#)._

En Firefox funciona genial, pero en Chrome, ay Chromcito...

![](/videos/xmlhttprequest-on-chrome.mp4)

¿Por qué no funciona en Chrome? No sé. Pero hay otra alternativa...

## Axios

Esta no. Usa `XMLHttpRequest` por debajo y entonces el evento `onDownloadProgress` tiene el mismo problema en Chrome.

## Fetch

Siempre usé la funcionalidad básica del fetch, transformar toda una respuesta a texto o json y siga.

Pero hay una funcionalidad, relativamente nueva, con algunos features en desarrollo, pero con Firefox 65+ y Chrome 42+ se puede usar. Pueden leer más detalles en [este artículo de MDN](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams).

Para este ejemplo, quedaría así:

```html
<form onsubmit="enviarComando(event)">
    <input type="text"></input>
</form>

<pre class="resultado"></pre>

<script>
    const contenedorResultado = document.querySelector('.resultado');

    async function enviarComando(e) {
        e.preventDefault();

        const input = e.target.children[0],
            comando = input.value;

        input.value = '';
        contenedorResultado.textContent = '';

        const respuesta = await fetch('/', {
            method: 'POST',
            body: comando
        });

        const reader = respuesta.body.getReader();

        let fin = false;

        while(!fin) {
            const lectura = await reader.read(),
                texto = new TextDecoder('utf-8').decode(lectura.value);

            fin = lectura.done;
            contenedorResultado.textContent += texto;
        }
    }
</script>
```

Aunque un poco más complicado, porque hay que transormar un [`Uint8Array`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) a `string`, ahora funciona tanto en Chrome como en Firefox!

![](/videos/fetch-on-chrome.mp4)


Y probablemente a futuro podamos concatenar streams para el procesamiento de los resultados que vayan llegando.

## Websockets

Es cierto que esto mismo es posible con Websockets, aunque la implementación aumenta un poco en complejidad, gran parte de la complejidad siendo el manteniemiento de estas conexiones.

Obvio que tiene su caso de uso, y cada uno decidirá en dónde es mejor usarlo, pero ahora saben de otra alternativa.

## Conclusiones

Aunque me da un poco de bronca que una forma tan vieja de hacer requests como `XMLHttpRequest` no funcione en Chrome, me gusta lo que se viene.

Espero que al haber visto esto hayan podido expandir las posibilidades que se tiene desarrollando en la web y lo que se viene.
