# MarkedCMS

MarkedCMS is simple web application for building websites written in Markdown
markup language. It allows you to create posts and categories which can be nested.
Hierarchy created by nesting posts and categories is than used to generate sidebar
menu, you ofcourse have full control over which posts and categories will or will
not be displayed in the menu.

MarkedCMS is great for building simple websites quickly since it's design is
not highly customizable and thus really easy to use.

`TODO: Write proper README`


## Developing

Once you've downloaded a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
