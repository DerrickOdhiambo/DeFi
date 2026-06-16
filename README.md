# DeFi Real Estate

A decentralized real estate investment platform built with React, TypeScript, Vite, and wagmi.

---

## Recent Changes — `feat/wallet`

### A. Wallet Integration

Real MetaMask wallet connection replacing the previous mock implementation.

**Files changed:**

- `src/context/WalletContext.tsx` — core wallet logic
- `src/components/modals/WalletConnectModal.tsx` — connect flow
- `src/pages/Home.tsx` — CTA section wallet state
- `wagmi.js` — chain/transport configuration

**What was implemented:**

- **Connect MetaMask** — calls `window.ethereum.request({ method: 'eth_requestAccounts' })` to trigger the MetaMask popup
- **Display connected address** — real wallet address shown in the Navbar and Home CTA section (truncated: `0x1234...5678`)
- **Account change handling** — listens to MetaMask's `accountsChanged` event; updates address on switch, disconnects if wallet is locked
- **Network change handling** — listens to `chainChanged` event and reloads the page (MetaMask recommended approach)
- **Admin access** — wallet address is compared against `VITE_ADMIN_ADDRESS`; matching address unlocks the Admin dashboard
- **Home CTA** — shows connected address + "Browse Properties" when connected, "Connect Wallet" modal trigger when not
- **CORS fix** — wagmi configured with explicit public RPC transports per chain to avoid `eth.merkle.io` CORS errors in development

### B. Button Loading State (Spinner)

- `src/components/ui/Spinner.tsx` — spinner component with animated SVG circle
- `src/components/modals/WalletConnectModal.tsx` — `handleConnect` is now `async`/`await`; spinner replaces the `Connect →` arrow while loading; buttons disabled during pending connection; modal stays open until MetaMask confirms (fixes inability to reconnect without page refresh)

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Wallet address that has admin access to the platform
VITE_ADMIN_ADDRESS=0xYourWalletAddressHere
```

> `.env.local` is git-ignored and will never be committed.

### Getting your admin address

1. Open MetaMask
2. Click your account name — it copies the full address
3. Paste it as the value of `VITE_ADMIN_ADDRESS`

### Testnets

Set `VITE_ENABLE_TESTNETS=true` to add the Sepolia testnet to the supported chains list.

---

## RPC Transports

The following public CORS-friendly RPC endpoints are configured in `wagmi.js` (no API key required):

| Chain            | RPC Endpoint                   |
| ---------------- | ------------------------------ |
| Ethereum Mainnet | `https://cloudflare-eth.com`   |
| Polygon          | `https://polygon.llamarpc.com` |
| Optimism         | `https://mainnet.optimism.io`  |
| Arbitrum         | `https://arb1.arbitrum.io/rpc` |
| Base             | `https://mainnet.base.org`     |
| Sepolia          | `https://rpc.sepolia.org`      |

---

## Getting Started

```bash
# Install dependencies
npm install

# Create your environment file
cp .env.local.example .env.local  # then fill in your values

# Start the dev server
npm run client
```
