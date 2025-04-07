# Star Astro Chat - Frontend

Star Astro is an innovative and cutting-edge AI-based astrology web app that provides personalized astrological insights and predictions. This repository contains the frontend code for the Star Astro Chat App.

The landing page is hosted on AWS Amplify and can be accessed through the following URL: [chat.starastrogpt.com](https://chat.starastrogpt.com)

## Getting Started

To run the landing page locally on your development environment, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/WhitelineNFT/chat-star-astro
   cd chat-star-astro
   ```

2. Install the required dependencies using Yarn:

   ```bash
   yarn install
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

   This will start the app on [http://localhost:3001](http://localhost:3001)
   .

## Available Scripts

In the project directory, you can use the following scripts:

- `yarn dev`: Starts the development server on port 3001.
- `yarn build`: Builds the production-ready app for deployment.
- `yarn start`: Starts the production server.
- `yarn lint`: Runs the ESLint linter to identify and fix code issues.

## Deployment

The Star Astro chat App is deployed using AWS Amplify. Changes pushed to the main branch of this repository are automatically deployed to the production environment. The live landing page can be accessed at [chat.starastrogpt.com](https://chat.starastrogpt.com).

## Contributing

Contributions are not accepted for this private project, as it is intended for personal use only.

## License

This project is privately owned and not open for public use or distribution.

---

**Package.json Details:**

```json
{
  "name": "chatstarastrogpt",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@chakra-ui/color-mode": "^2.2.0",
    "@headlessui/react": "^1.7.16",
    "@headlessui/tailwindcss": "^0.2.0",
    "@types/node": "20.4.5",
    "@types/react": "18.2.17",
    "@types/react-copy-to-clipboard": "^5.0.4",
    "@types/react-datepicker": "^4.15.0",
    "@types/react-dom": "18.2.7",
    "@types/react-input-mask": "^3.0.2",
    "@types/react-syntax-highlighter": "^15.5.7",
    "@types/scroll-lock": "^2.1.0",
    "axios": "^1.4.0",
    "csstype": "^3.0.10",
    "eslint": "^8.47.0",
    "eslint-config-next": "13.4.12",
    "next": "13.4.12",
    "rc-slider": "^10.2.1",
    "react": "18.2.0",
    "react-calendar": "^4.6.0",
    "react-copy-to-clipboard": "^5.1.0",
    "react-datepicker": "^4.16.0",
    "react-datetime-picker": "^5.5.1",
    "react-dom": "18.2.0",
    "react-hook-form": "^7.45.4",
    "react-hot-toast": "^2.4.1",
    "react-input-mask": "^3.0.0-alpha.2",
    "react-responsive": "^9.0.2",
    "react-select": "^5.7.4",
    "react-syntax-highlighter": "^15.5.0",
    "react-textarea-autosize": "^8.5.2",
    "scroll-lock": "^2.1.5",
    "tailwind-merge": "^1.14.0",
    "tailwind-scrollbar": "^3.0.4",
    "typescript": "5.1.6",
    "yarn": "^1.22.19"
  },
  "devDependencies": {
    "@rvxlab/tailwind-plugin-ios-full-height": "^1.1.0",
    "autoprefixer": "^10.4.14",
    "concurrently": "^8.2.0",
    "eslint-plugin-prettier": "^5.0.0",
    "postcss": "^8.4.27",
    "postcss-import": "^15.1.0",
    "tailwindcss": "^3.3.3"
  },
  "optionalDependencies": {
    "@next/swc-darwin-arm64": "false",
    "@next/swc-darwin-x64": "false",
    "@next/swc-linux-arm64-gnu": "false",
    "@next/swc-linux-arm64-musl": "false",
    "@next/swc-win32-arm64-msvc": "false",
    "@next/swc-win32-ia32-msvc": "false",
    "@next/swc-win32-x64-msvc": "false",
    "fsevents": "false"
  }
}
```
# star-astro-chat-web-app
# star-astro-chat-web-app
