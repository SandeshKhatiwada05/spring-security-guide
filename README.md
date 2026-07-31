# Spring Security 6 Guide — Zero to Confident

An interactive, beginner-first tutorial that teaches **Spring Security 6** the way it actually works: not as a list of annotations to memorize, but as a chain of filters that stands between the browser and your code. No prior security knowledge required — just Java, Spring Boot, and a willingness to meet the bouncer.

![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

> Add a `screenshot.png` to the repo root to show a live preview here.

## What you'll learn

| Chapter | Topic |
|---|---|
| 1 | **The mental model** — Spring Security as the "bouncer" of your app: authentication vs. authorization |
| 2 | **The two core jobs** — proving identity and deciding access, with working code for both |
| 3 | **The filter chain, step by step** — an interactive stepper that follows one request from browser to controller |
| 4 | **The 5 building blocks** — `SecurityFilterChain`, `UserDetailsService`, `PasswordEncoder`, `AuthenticationManager`, `SecurityContextHolder` — each with plain-English explanation, code, and the most common mistake |
| 5 | **A complete, runnable example** — a full annotated `SecurityConfig.java` with callouts explaining every line |
| 6 | **Common beginner mistakes** — six pitfalls that silently cost people an afternoon, each with the fix |
| 7 | **When to use what** — a decision table mapping your architecture (Thymeleaf, REST API, OAuth2, SSO, microservices) to the right approach |
| 8 | **Quick reference cheat sheet** — annotations, classes, 401 vs 403, and password encoder types |

## Features

- **Hands-on "Try It" simulation** — type any URL path and watch the filter chain decide *pass* or *block*, just like a real `SecurityFilterChain` would
- **Interactive steppers, tabs, and accordions** — the filter chain, the five building blocks, and the cheat sheet all unfold as you explore
- **Syntax-highlighted, copy-paste-ready code** — every block has a one-click **Copy** button
- **Auto-generated table of contents** — collapsible sidebar with scroll-spy highlighting of the section you're reading
- **Fully accessible** — keyboard-navigable widgets, ARIA labels, `prefers-reduced-motion` support, skip link, semantic landmarks
- **Zero dependencies** — no frameworks, no build step, no node_modules. Just three files.

## Getting started

The whole guide is static HTML — clone it and open it, or serve it locally:

```bash
# Option 1 — just open it
open index.html

# Option 2 — serve it (recommended; copy buttons work best over http)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
.
├── index.html   # the entire guide, chapter by chapter
├── style.css    # design tokens, layout, components, dark code blocks
└── script.js    # syntax highlighter, copy buttons, stepper, TOC, "Try It" demo
```

## Customize it

Want to make it yours? A few easy starting points:

- **Colors** — every color on the page comes from four CSS custom properties at the top of `style.css` (`--bg`, `--surface`, `--accent`, `--ink`)
- **Demo access rules** — the "Try It" bouncer's hardcoded rules live in `script.js` in the `checkPath()` function
- **Demo users** — the `user` / `ROLE_USER` persona used by the simulator is described in the `#tryit` section of `index.html`

## Built with

- Semantic **HTML5** for structure and accessibility
- Vanilla **CSS3** with custom properties, `clamp()`-based fluid type, and responsive layouts
- Dependency-free **JavaScript (ES5-style, IIFE)** for all interactivity — works even with no bundler

## Contributing

Found a mistake, a confusing sentence, or a topic you'd like covered? Open an issue or a pull request — the guide's goal is clarity, and every chapter benefits from a second pair of eyes.

## Resources

- [Official Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Spring Security 6 API docs](https://docs.spring.io/spring-security/site/docs/6.x/api/)
- [Spring Initializr](https://start.spring.io/)

## License

MIT — free to use, learn from, and adapt. Built for beginners; no prior security knowledge required.
