# Risposte - Laboratorio 03.16 · Chiamate HTTP

## Passo 6 - Richieste osservate

Richieste osservate nella scheda Network (F12, filtro Fetch/XHR) premendo i pulsanti della pagina dei post.

| Pulsante | Metodo | URL | Stato |
|---|---|---|---|
| Carica un post (con 1) | GET | https://jsonplaceholder.typicode.com/posts/1 | 200 OK |
| Carica un post (con 999) | GET | https://jsonplaceholder.typicode.com/posts/999 | 404 Not Found |
| Carica tutti | GET | https://jsonplaceholder.typicode.com/posts | 200 OK |
| Invia un post | POST | https://jsonplaceholder.typicode.com/posts | 201 Created |

Osservazioni:

- Nella riga della `POST`, in **Payload** c'è l'oggetto inviato (`userId`, `title`, `body`) e in **Response** lo stesso oggetto con in più `"id": 101`.
- Prima della `POST` compare una richiesta `OPTIONS` allo stesso URL, con stato 204: è la richiesta preliminare CORS con cui il browser chiede al server il permesso di inviargli dati JSON da un'altra origine (`http://localhost:4200`).
- In modalità **Offline** il pulsante *Carica tutti* mostra in pagina "Errore 0: ...": la richiesta non è arrivata al server, quindi non c'è un codice di stato.
