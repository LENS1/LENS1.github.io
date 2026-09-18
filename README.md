# LENS project page

Static GitHub Pages source for the anonymous ICLR 2027 LENS project page.

## Local preview

Run any static file server from this directory, for example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Updating paper assets

- Replace `assets/images/motivation.png` only with a same-purpose Fig. 1 asset.
- Replace the Fig. 2 placeholder in `index.html` when the framework overview is finalized.
- Update the four backbone comparison cards in `index.html` and the `ablations` data in `app.js` whenever paper results are revised.
- Keep author names, paper URL, checkpoints, and dataset links anonymous until the public version is ready.
