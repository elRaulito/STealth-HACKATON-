# Come installarlo?

Scaricare la cartella AI[backend] e al suo interno eseguire il comando

```
npm install 
```

successivamente avviare l'AI con

```
node index.js
```
Il server è avviato e ascolta l'indirizzo http://localhost:3000

# come inviare una richiesta?

Usare uno strumento per convertire una immagine in base64 come [questo](https://base64.guru/converter/encode/image)
Mandare la richiesta tramite postman

```
curl --location --request POST 'http://localhost:3000/image' \
--header 'Content-Type: application/json' \
--data-raw '{
    "image": "image encoded in base64 in plain text"
}'

```
La risposta sarà:




```
[
    {
        "bbox": [
            12.013011932373047,
            28.14077541232109,
            323.8699836730957,
            224.03340235352516
        ],
        "class": "bicycle",
        "score": 0.931533932685852
    },
    {
        "bbox": [
            73.09247589111328,
            1.23288094997406,
            176.43450164794922,
            142.04309940338135
        ],
        "class": "person",
        "score": 0.557381808757782
    }
]

```

Il bbox è il quadrato che contiene l'oggetto, la classe è la categoria dell'oggetto e lo score è la confidence dell'AI
