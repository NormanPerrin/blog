---
title: Usando gpg
description: Usando gpg (OpenPGP, herramienta de encriptación y firma) desde la terminal
published: 2021-11-14
category: tech
type: public
lang: es
---

## Para quién

Para cualquier persona que quiera comunicarse de forma segura, protegiendo el contenido de los mensajes que envíe y reciba.

## Para quién no

La encriptación de datos no protege tu anonimidad, eso dependerá de la plataforma que uses para comunicarte, solo te asegura que tu mensaje no podrá ser leido, salvo por la persona con la que quieras comunicarte.

Por ejemplo, si usas **gpg** para encriptar un mensaje y lo publicas en Facebook, nadie podrá leerlo (salvo el recipiente, más detalles luego) pero todos sabrán que has publicado ese mensaje.

## Bases

Se parte de un par de **claves**: **pública** y **privada**:

- La **pública** se comparte públicamente...
- La **privada**, pa casa. No se comparte con nadie.

Puedes generar un par usando este comando:

```bash
$ gpg --full-generate-key
```

Y luego seleccionando las opciones que más sentido te hagan, pero para uso general te recomiendo que sea RSA 4096 con expiración de 1 o 2 años.

Ahora con `gpg --list-keys` pueden ver en su "keyring" la clave recién creada.

```bash
$ gpg --list-keys

/Users/nperrin/.local/share/gnupg/pubring.kbx
---------------------------------------------
pub   ed25519 2021-08-05 [SC] [expires: 2023-08-05]
      EDE35A04B36DAFC471C64AE1303DFEF9E29C1A10
uid           [ultimate] Norman Perrin <norman.perrin.94@gmail.com>
sub   cv25519 2021-08-05 [E] [expires: 2023-08-05]
```

## Abriéndose al mundo

Puedes compartir tu clave pública por mensaje mediante cualquier vía de comunicación, subiéndola a tu página personal (como yo, [/nperrin.asc](/nperrin.asc)), o a un keyserver, uno común es el de MIT (pgp.mit.edu).

Para buscar una clave en el servidor:

```bash
# En este caso busco por mail, se puede buscar por nombre también.
# Aunque lo mejor es buscar por el fingerprint.
$ gpg --keyserver pgp.mit.edu --search-keys 'norman.perrin.94@gmail.com'

gpg: data source: http://pgp.mit.edu:11371
(1)	Norman Perrin <norman.perrin.94@gmail.com>
	  256 bit EDDSA key 303DFEF9E29C1A10, created: 2021-08-05, expires: 2023-08-05
Keys 1-1 of 1 for "norman.perrin.94@gmail.com".  Enter number(s), N)ext, or
```

Y para guardar tu clave generada en el servidor:

```bash
# Tienes que poner como valor el "fingerprint" de tu clave,
# la puedes obtener haciendo gpg --list-keys
$ gpg --send-keys --keyserver pgp.mit.edu EDE35A04B36DAFC471C64AE1303DFEF9E29C1A10
```

## Saliendo del mundo

Si mi clave privada fue comprometida o algo pasó, y quiero que otras personas dejen de usar la clave pública que tengo en algún servidor, puedo revocarla, para eso:

1. Se crea un certificado de revocación (es otra clave). Mejor si se hace inmediatamente después de crearse un par de claves público privadas. Y aún mejor si se designa un amigo de confianza para que nos pueda revocar nuestra clave.
2. Se importa la clave, y queda revocado en el "keyring", localmente.
3. Finalmente al subir esta clave de revocación al keyserver queda la clave revocada.

Si lo hacemos nosotros:

```bash
$ gpg --gen-revoke EDE35A04B36DAFC471C64AE1303DFEF9E29C1A10 --output revoke.key

$ gpg --import revoke.key

$ gpg --keyserver pgp.mit.edu --send-keys EDE35A04B36DAFC471C64AE1303DFEF9E29C1A10

$ gpg --search-keys EDE35A04B36DAFC471C64AE1303DFEF9E29C1A10

gpg: data source: http://pgp.mit.edu:11371
(1)     Norman Perrin <norman.perrin.94@gmail.com>
          256 bit EDDSA key 303DFEF9E29C1A10, created: 2021-08-05, expires: 2023-08-05 (revoked)
```

Para asignar un contacto de confianza para que pueda revocar la clave:

```bash
$ gpg --edit-key EDE35A04B36DAFC471C64AE1303DFEF9E29C1A10

pg (GnuPG) 2.3.3; Copyright (C) 2021 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  ed25519/F1ADA621F8AC75BB
     created: 2021-08-05  expires: 2023-08-05  usage: SC
     trust: ultimate      validity: ultimate
ssb  cv25519/6D5E942017E153FE
     created: 2021-08-05  expires: 2023-08-05  usage: E
[ultimate] (1). Norman Perrin <norman.perrin.94@gmail.com>

gpg> addrevoker

Enter the user ID of the designated revoker:

# Se agrega la clave pública del "revocador" designado, luego "save" y estamos
```

## Flujo de mensajes

Supongamos que quieres **enviar un mensaje** encriptado a Norman:

1. Obtienes su clave pública, te la debe compartir.
2. La importamos.
3. Usas su clave pública para encriptar el mensaje que quieres enviar.
4. Le envías el mensaje.
5. FIN

¿Y cómo es esto desde la terminal?

```bash
$ echo 'Hola Norman. ¿Querés que lleve algo para el asado?' > mensaje.txt

# Si la ha subido a un servidor, podemos buscarla así como dice arriba,
# si nos la comparte como archivo, hacemos lo siguiente
$ gpg --import clave-publica-de-norman.key

$ gpg --list-keys

/Users/nperrin/.local/share/gnupg/pubring.kbx
---------------------------------------------
pub   ed25519 2021-08-05 [SC] [expires: 2023-08-05]
      EDE35A04B36DAFC471C64AE1303DFEF9E29C1A10
uid           [ultimate] Norman Perrin <norman.perrin.94@gmail.com>
sub   cv25519 2021-08-05 [E] [expires: 2023-08-05]

# El valor de recipient puede ser el nombre, mail, o identificador hexadecimal de su clave pública
$ gpg --encrypt --recipient 'Norman Perrin' mensaje.txt

# Se habrá generado el archivo mensaje.txt.gpg,
# este será el que le enviemos
```

Y si ahora Norman nos tiene que responder:

1. Le compartimos nuestra clave pública a Norman.
2. Norman hace los pasos de arriba y nos envía el mensaje encriptado.
3. Una vez recibido, podemos usar nuestra clave privada para desencriptar el mensaje y leerlo.
4. FIN

¿Desde la terminal?

```bash
$ gpg --decrypt respuesta.txt.gpg

gpg: encrypted with cv25519 key, ID 374C8408D28B8F02, created 2021-08-05
      "Norman Perrin <norman.perrin.94@gmail.com>"
Hola Norman. ¿Querés que lleve algo para el asado?
```

¡Y eso es todo!

## Practicidad

¿Cómo puedo usar esto con mail, slack, whatsapp?

Algunos programas tienen soporte para **gpg**, como [Thunderbird](https://www.thunderbird.net/es-ES/) con [Enigmail](https://enigmail.net/index.php/en/) para los mails, también escuché que [mutt](http://www.mutt.org/), y probablemente muchos otros clientes de mail. También he visto de una extensión de Chrome para encriptar mails desde gmail... pero no me acuerdo cuál era, ya que usé Thunderbird cuando quise usar **gpg**.

Para otros programas que no tienen soporte, no queda otra que encriptar el mensaje y enviarlo. Quizás sea una buena idea usar más mail.

## A tener en cuenta

- No hay forma de borrar claves una vez subidas al servidor, se pueden revocar únicamente.
- Como un fingerprint es largo, se suele compartir los últimos 8 o 16 caracteres de la clave

## Conclusiones

Parece que el uso de **gpg** no es tan críptico como hemos visto. Los comando son bastante intuitivos y el manual que tienen es muy bueno.

Aunque su uso básico no pasa de lo que expliqué. Es interesante leer el manual de gpg (es bastante directo) `man gpg` donde verán más funcionalidades y opciones de **gpg** para su uso.

Espero que les haya gustado el artículo y les sirva en sus próximas comunicaciones 🙏
