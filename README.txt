This folder is intentionally empty.

Dignity Art Edge uses royalty-free placeholder photography served live from
picsum.photos (e.g. https://picsum.photos/seed/ochre-horizon/700/875) instead
of bundling binary image files. This keeps the project lightweight and easy
to clone/share, while still rendering full product photography in the browser.

To use your own product photography in production:
1. Drop your image files into this folder (e.g. /assets/images/products/).
2. Update the `image` / `gallery` fields for each product in
   /assets/js/data.js to point at your local paths instead of the
   picsum.photos URLs.
