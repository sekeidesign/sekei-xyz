# Third-party notices

## dither-kit

<https://github.com/Boring-Software-Inc/dither-kit>

The dither renderer of shad-fx in `components/shad-fx/dither/` began from dither-kit's
ordered-dither rendering and is derived from it in these respects:

- Drawing into a low-resolution backing canvas and scaling it up with
  `image-rendering: pixelated`, sized as the CSS box divided by a cell size and
  capped to a maximum grid.
- The `BAYER4` 4×4 ordered-dither threshold matrix, normalised to 0–1 as
  `(v + 0.5) / 16`.
- Painting every cell at one of two alpha tiers of the same colour instead of
  leaving a hole where the cell does not clear the threshold.

The effects themselves (fire, bolt, rings, fluid, beam), the `Painter` blitting
through a single `ImageData`, the frame loop with its eased intensity and idle
parking, and the reduced-motion handling are not from dither-kit.

dither-kit declares `"license": "MIT"` in its package.json files. As of this
writing it ships no LICENSE file and no copyright line, so there is no upstream
notice to reproduce verbatim. The MIT terms it declares are reproduced below,
with copyright attributed to its stated owner. This notice will be corrected to
match once an upstream LICENSE exists.

---

MIT License

Copyright (c) Boring Software Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## mulberry32

The seeded random number generator in `components/shad-fx/dither/engine.ts` is
mulberry32 by Tommy Ettinger, released into the public domain.
