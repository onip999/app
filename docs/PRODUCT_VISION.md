# Product Vision — Comparatore di convenienza

## Direzione strategica

Il progetto non deve essere un semplice clone di Trovaprezzi o Idealo e non deve limitarsi a mostrare quale negozio ha il prezzo nominale più basso.

La domanda a cui il prodotto deve rispondere è:

> **Dove mi conviene davvero comprarlo?**

L'obiettivo è diventare un assistente alla decisione d'acquisto: confrontare il valore complessivo delle offerte e aiutare l'utente a scegliere quella migliore per le proprie esigenze.

## Due risultati principali

L'interfaccia deve mostrare chiaramente e separatamente due risposte, senza confonderle:

- **💰 Prezzo più basso** — l'offerta con il costo totale più basso (prodotto + spedizione), per chi vuole massimizzare il risparmio.
- **⭐ Miglior acquisto** — l'offerta con il miglior Punteggio Convenienza, considerando anche condizioni e qualità complessiva dell'acquisto.

Le due etichette possono coincidere sulla stessa offerta, ma devono rimanere concettualmente indipendenti. Se il Miglior acquisto costa più del Prezzo più basso, l'interfaccia deve spiegare in modo semplice perché vale la differenza.

## Dati da confrontare

Per ogni offerta considerare, quando disponibili:

- prezzo del prodotto;
- costo di spedizione;
- costo totale (prezzo + spedizione);
- disponibilità;
- tempi e condizioni di consegna;
- durata e condizioni del reso;
- garanzia;
- affidabilità del negozio;
- quantità/confezione quando rilevante.

## Punteggio convenienza

Introdurre un **Punteggio Convenienza** (es. 9,2/10) che sintetizzi la qualità complessiva dell'offerta.

Il punteggio non deve dipendere soltanto dal prezzo. Deve poter considerare prezzo totale, spedizione, reso, garanzia, disponibilità e affidabilità del venditore.

L'interfaccia deve spiegare in modo trasparente perché un'offerta riceve un determinato punteggio.

Esempio:

- Prezzo: eccellente
- Spedizione: gratuita
- Reso: 30 giorni
- Garanzia: 24 mesi
- Affidabilità negozio: alta

In questo modo l'offerta più economica può non essere necessariamente quella consigliata.

## Prezzo storico — evoluzione futura

Aggiungere successivamente uno storico dei prezzi per mostrare, ad esempio:

- prezzo attuale rispetto alla media degli ultimi 30/90 giorni;
- minimo storico;
- variazione percentuale;
- indicazione se il prezzo attuale rappresenta realmente un buon affare.

## Assistente AI — elemento distintivo

Evoluzione prevista: utilizzare l'AI per consigliare quale offerta scegliere e spiegare il motivo in linguaggio semplice.

Esempio:

> Ti consiglio l'offerta B: costa 5 € in più rispetto alla più economica, ma include spedizione gratuita, 30 giorni di reso e una garanzia migliore.

L'AI deve assistere la decisione, non nascondere i dati utilizzati per formularla.

## Monetizzazione e indipendenza

Il modello iniziale deve privilegiare le **commissioni di affiliazione** generate dai click e dagli eventuali acquisti completati sui siti dei negozi partner.

La pubblicità può essere una fonte secondaria di ricavo, ma deve essere discreta e non invasiva: niente popup, overlay o video automatici. Eventuali contenuti sponsorizzati devono essere chiaramente riconoscibili.

Regola fondamentale: **nessun negozio o inserzionista può acquistare il titolo di Miglior acquisto, modificare il Punteggio Convenienza o alterare il ranking organico delle offerte.** La fiducia dell'utente viene prima della monetizzazione.

## Posizionamento

Proposta di valore:

> **Non trovare il prezzo più basso. Trova l'acquisto migliore.**

Il progetto deve quindi posizionarsi come **comparatore di convenienza complessiva / assistente alla decisione d'acquisto**, non come semplice comparatore prezzi.

## Priorità MVP

1. Confronto offerte e costo totale.
2. Visualizzazione separata di Prezzo più basso e Miglior acquisto.
3. Spedizione, reso, garanzia e disponibilità chiaramente visibili.
4. Punteggio convenienza con spiegazione dei fattori principali.
5. Link diretto al negozio e tracciamento dei click.
6. In una fase successiva: storico prezzi e raccomandazioni AI.

Questa visione deve guidare le future modifiche all'interfaccia, al database e alla logica di confronto.
