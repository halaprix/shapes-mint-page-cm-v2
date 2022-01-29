# Candy Machine V2 - Template

by [Halaprix](https://twitter.com/halaprix).<br/>Live preview [here](https://vol2.shapes.ltd/)<br/>
1click deploy:<br/><br/>
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhalaprix%2Fshapes-mint-page-cm-v2&env=REACT_APP_CANDY_MACHINE_ID,REACT_APP_SOLANA_NETWORK,REACT_APP_SOLANA_RPC_HOST&envDescription=REACT_APP_CANDY_MACHINE_ID%20is%20the%20ID%20of%20your%20Candy%20Machine.%20REACT_APP_SOLANA_NETWORK%20is%20the%20network%20you%20deployed%20your%20CM%20%60devnet%60%20or%20%60mainnet-beta%60%20%20REACT_APP_SOLANA_RPC_HOST%20is%20the%20URL%20of%20the%20RPC%20you%20want%20to%20use%20eg%20%60https%3A%2F%2Fssc-dao.genesysgo.net%2F%20%60&project-name=candy-machine-v2-mint-web&repo-name=candy-machine-v2-mint-web&demo-title=Shapes%20V2&demo-description=Shapes%20VOL2%20mint%20website%20created%20using%20this%20repo.&demo-url=https%3A%2F%2Fvol2.shapes.ltd%2F)

![Imgur](https://i.imgur.com/i8DDwWp.png)

# Installation

0. Prerequisities:

   - [node.js](https://nodejs.org/en/download/)
   - **yarn** - `npm add -g yarn` (run as root / su eg. `sudo npm add -g yarn`)

1. Clone the repository:

   `git clone https://github.com/halaprix/shapes-mint-page-cm-v2`

   ` cd shapes-mint-page-cm-v2`

2. use yarn to install all dependencies:

   `yarn install`

3. Fill `.env-example` with your Candy Machine details (can be found in `.json` file in `.cache` directory, after CM upload). Rename the file to `.env`.

4. Run yarn start to start the developement server.

   `yarn start`

5. If you are using traditional hosting, run `yarn build` and uplaod contents of the `build` folder to your hostings `public_html`
6. (Optional) - If deploying to Vercel, use the ENV VARIABLES from `.env` file here or use one click prefilled deploy:<br/>[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhalaprix%2Fshapes-mint-page-cm-v2&env=REACT_APP_CANDY_MACHINE_ID,REACT_APP_SOLANA_NETWORK,REACT_APP_SOLANA_RPC_HOST&envDescription=REACT_APP_CANDY_MACHINE_ID%20is%20the%20ID%20of%20your%20Candy%20Machine.%20REACT_APP_SOLANA_NETWORK%20is%20the%20network%20you%20deployed%20your%20CM%20%60devnet%60%20or%20%60mainnet-beta%60%20%20REACT_APP_SOLANA_RPC_HOST%20is%20the%20URL%20of%20the%20RPC%20you%20want%20to%20use%20eg%20%60https%3A%2F%2Fssc-dao.genesysgo.net%2F%20%60&project-name=candy-machine-v2-mint-web&repo-name=candy-machine-v2-mint-web&demo-title=Shapes%20V2&demo-description=Shapes%20VOL2%20mint%20website%20created%20using%20this%20repo.&demo-url=https%3A%2F%2Fvol2.shapes.ltd%2F)
   <br/> ![](https://i.imgur.com/x5mHNxV.png)

---

### Example configuration

Devnet:

```
- REACT_APP_SOLANA_NETWORK=devnet
- REACT_APP_SOLANA_RPC_HOST=https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/
```

Mainnet-beta:

```
- REACT_APP_SOLANA_NETWORK=mainnet-beta
- REACT_APP_SOLANA_RPC_HOST=https://ssc-dao.genesysgo.net/
```

# Styling

**Favicon, Phantom styling** - `index.html`<br/>

- Use this [generator](https://realfavicongenerator.net/) to generate favicons, metadata and images, to be put to `/public`.

**Buttons** - `/src/MintButton.tsx` and `src/Home.tsx`<br/>

- Change the style of the buttons in `styled` components. `background: linear-gradient(29deg, #34342F 0%, #44C3A1 100%);` is reponsible for the button gradient.

**Images** - `/public`<br/>

- `/public/logo.png` is the top logo
- `/public/animation.gif` is the middle container image.

**Styles** - `/src/index.css`<br/>

- Change the styles of the website. `background: linear-gradient(29deg, #34342f 0%, #5ff1cb 50%, #44c3a1 100%);` is the background gradient. You can generate the gradient using this [generator](https://cssgradient.io/)
- change the `Paper` style (the three containers) in `/src/Home.tsx` :
  ```
  const StyledPaper = styled(Paper)`
  padding: 24px;
  background-color: #34342f;
  border-radius: 6px;
  margin: 10px;
  `;
  ```

---
