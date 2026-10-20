# mascolo-francesco-angular-http

Laboratorio 03.16 - Chiamate HTTP: da JSONPlaceholder ai fatti sui gatti.

Il progetto Angular è nella cartella `angular-http` e ha quattro pagine:

- **Post**: JSONPlaceholder (GET di un post, di tutti i post, a pagine, e POST);
- **Gatti**: fatti casuali da catfact.ninja;
- **NASA**: foto astronomica del giorno (APOD);
- **Pokédex**: tipi e ricerca di Pokémon con PokeAPI.

## Avvio

```bash
cd angular-http
npm install
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.development.ts
ng serve
```

Nei due file copiati sostituisci `INSERISCI_QUI_LA_TUA_CHIAVE` con la tua chiave di https://api.nasa.gov. I due file sono nel `.gitignore` e non vanno committati.

Le risposte alle domande sono in [RISPOSTE.md](RISPOSTE.md).
