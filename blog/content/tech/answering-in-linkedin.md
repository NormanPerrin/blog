---
title: Answering in Linkedin
description: Solving Linkedin responding fatigue with a script
published: 2022-06-02
category: tech
type: public
---
The reasons to use this script are obvious if you have some years as a programmer with an account on Linkedin, and like me, you accept everyone's invite.

I did it in an hour or two so it's not going to be perfect. Improvements welcome.

Here's the script, enjoy 😁

```js
// @ts-check

/**
 * Working date: 2022-06-02
 *
 * How this works?
 *   1. Copy and paste it into the web console
 *   2. run `init()`
 *   3. You have to click in the input box, paste, and click on the "send" button.
 *   4. It decides if the answer is in english or not, when it doesn't know, a prompt will ask you.
 *
 * Some problems:
 *   - Sometimes the conversations doesn't load as fast as the script wants,
 *     so the `alreadyAnswered` function may not give a proper response in
 *     some cases. You can call `init()` again in those cases.
 *     If you have bad internet, you may want to increase some delays.
 *   - There is no auto scroll, to load more conversations you have to manually
 *     do it and run the script again.
 *   - It now requires human intervention, I could not find a way to insert text
 *     and submit it. Had to copy to the clipboard when the inbox was clicked
 *     and listen to the click event of the send button.
 */

const english_greets = ['hi', 'how', 'hello', 'hey']
  .map(word => new RegExp(`.*${word}.*`, 'i'))

const spanish_greets = ['buenos', 'buenas', 'hola']
  .map(word => new RegExp(`.*${word}.*`, 'i'))

const spanish_response = `Hola @name@!
Actualmente no estoy buscando un cambio de trabajo.
Gracias por haberme considerado.
Quedamos en contacto!`

const english_response = `Hi @name@!
Seems very interesting but I'm not looking for a job change now. Thanks for considering me for the position.
We keep in touch for future opportunities. And good luck with your search!`

/** @param {number} ms */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getName() {
  return document.querySelector('a[data-control-name="view_profile"]')
    .textContent.trim().split(' ')[0]
}

/** @param {string} response */
async function waitToPaste(response) {
  const input_box = document.querySelector('.msg-form__contenteditable')

  let input_fn
  await new Promise(resolve => {
    input_fn = () => {
      navigator.clipboard.writeText(response)
      resolve()
    }
    input_box.addEventListener('click', input_fn)
  })
  input_box.removeEventListener('click', input_fn)

  const button = document.querySelector('button[type="submit"]')
  let button_fn;
  await new Promise(resolve => {
    button_fn = () => resolve()
    button.addEventListener('click', button_fn)
  })
}

/** @param {Element} message_dom */
function alreadyAnswered(message_dom) {
  const profile_dom = message_dom.querySelector('[data-control-name="view_profile"]')
  if (!profile_dom) return false;
  return profile_dom.textContent.trim() === 'Norman Perrin'
}

async function answer() {
  const messages_dom = Array.from(document.querySelectorAll('.msg-s-message-list__event'))

  if (messages_dom.some(alreadyAnswered)) return;

  const conversation_text = messages_dom
    .map(e => e.querySelector('.msg-s-event__content'))
    .map(e => e.textContent)
    .join('')
    .replace(/\n/g, '')
    .replace(/ ( *)/g, ' ')

  const greet = conversation_text.slice(0, 20)
  let is_english = english_greets.some(r => r.test(greet))
  let is_spanish = spanish_greets.some(r => r.test(greet))

  if (!is_english && !is_spanish) {
    const response = prompt(`english or spanish? (e/s)\n${greet}`, 'e')
    is_english = response === 'e'
    is_spanish = response === 's'
  }

  const response = (is_english
    ? english_response
    : spanish_response)
    .replace('@name@', getName())

  await waitToPaste(response)
}

async function init() {
  const conversations_dom = document.querySelector('.msg-conversations-container__conversations-list')
  const conversation_items_dom = Array.from(conversations_dom.querySelectorAll('li[tabindex="-1"]'))

  for (const conversation of conversation_items_dom) {
    const link = conversation.querySelector('a')
    if (!link) continue;

    link.click()

    await delay(500)
    await answer()
    await delay(200)
  }
}
```
