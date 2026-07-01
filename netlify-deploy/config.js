/** Shared site configuration — single source of truth */
window.GL_CONFIG = {
	brand: 'GamerLeech',
	email: 'gamerleech2@gmail.com',
	siteUrl: 'https://gamerleech.netlify.app',
	/** Bump after image/deploy updates to bust mobile browser cache */
	assetVersion: '10',
	emailjs: {
		publicKey: 'o1TL0rKhww3ZFclTv',
		serviceId: 'service_kxignqr',
		templateContact: 'template_contact',
		templatePayment: 'template_pdgnqm1',
		templateConfirmation: 'template_trz0679'
	},
	/** GamerLeech merchant crypto receive addresses (former checkout) */
	cryptoWallets: {
		bitcoin: { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', address: '1LrtmepWxUKXbWVMcNBHXV8WXqt29aHUWv', barcode: 'Images/barcodes/BTC.jpg', network: 'Bitcoin network only' },
		ethereum: { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/eth.jpg', network: 'Ethereum (ERC20) only' },
		'usdt-trc20': { id: 'usdt-trc20', symbol: 'USDT', name: 'Tether', address: 'TCwDWG1sWdke4X7AyLAUKSQFA93Hcqzb5w', barcode: 'Images/barcodes/usdt trc20.jpg', network: 'TRC20 (Tron) only' },
		'usdt-eth': { id: 'usdt-eth', symbol: 'USDT', name: 'Tether', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/eth.jpg', network: 'Ethereum (ERC20) only' },
		'usdt-polygon': { id: 'usdt-polygon', symbol: 'USDT', name: 'Tether', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/usdt polygon.jpg', network: 'Polygon only' },
		usdc: { id: 'usdc', symbol: 'USDC', name: 'USD Coin', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/eth.jpg', network: 'Ethereum (ERC20) only' },
		'usdc-polygon': { id: 'usdc-polygon', symbol: 'USDC', name: 'USD Coin', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/Usdc polygon.jpg', network: 'Polygon only' },
		'usdc-arbitrum': { id: 'usdc-arbitrum', symbol: 'USDC', name: 'USD Coin', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/usdc arbitrum .jpg', network: 'Arbitrum only' },
		'usdc-solana': { id: 'usdc-solana', symbol: 'USDC', name: 'USD Coin', address: '8TP6k4DHorT67LUSPrH7C34maPLzZN6MUuSdWGkW7iXc', barcode: 'Images/barcodes/usdc solana.jpg', network: 'Solana only' },
		'binance-pay': { id: 'binance-pay', symbol: 'BNB', name: 'Binance Pay', address: 'bnb1qxy2kg9gj2gskp6e5m4kmq6g5g4n6g8k9x0z2p', barcode: null, network: 'BNB Beacon Chain' },
		'crypto-com': { id: 'crypto-com', symbol: 'CRO', name: 'Crypto.com', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', barcode: null, network: 'Cronos / EVM' }
	},
	cryptoPrimary: ['bitcoin', 'ethereum', 'usdt-trc20', 'usdt-eth', 'usdc', 'usdt-polygon'],
	cryptoExtended: ['usdc-polygon', 'usdc-arbitrum', 'usdc-solana', 'binance-pay', 'crypto-com']
};
