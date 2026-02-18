# Aircards Nuxt Template

## To Create A New WebXR Project

1. Click "Use this template" on the [Aircards Nuxt Template](https://github.com/Aircards/aircards-nuxt-template)
2. Click "Create a new repository" and give it a name and set it to private
3. Clone the new repository to your local machine
4. Open the local project folder and update the `aircards.config.ts` file in the project's root folder with your project details:
5. Commit and push your changes to three new branches: `development`, `staging`, and `production`

### `aircards.config.ts`

```typescript 
  USE_SERVER: false, // set to true to enable SSR, set to false to statically generate the site
  USE_XRWEB: false, // set to true to enable 8thwall plugin (requires setting the XRWEB_APPKEY param below)
  XRWEB_APPKEY: 'XYZ123', // set to your XRweb app key from 8thwall.com
  PROJECT_TITLE: 'Aircards Nuxt Template', // set to your project title
  NUXT_APP_CDN_URL: undefined, // delete or set to undefined to load static assets from the same domain as the app
  METALITIX_APP_KEY: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // set to your Metalitix app key from metalitix.com or le
  GTM_ID: 'GTM-XXXXXXX', // set to your Google Tag Manager ID from tagmanager.google.com
  USERBACK_TOKEN: '00000|00000|xyz123', // delete or set to undefined to disable Userback
  FALLBACK_LOCALE: 'en-us'
```

## To Develop Locally

### Clone the repository 

replace the template URL with your project url

```bash
git clone https://github.com/Aircards/aircards-nuxt-template.git
```

### Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the SSR application for production:

```bash
npm run build
```

Build a static application fro production

```bash
npm run generate
```

Locally preview production build:

```bash
npm run preview
```

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
