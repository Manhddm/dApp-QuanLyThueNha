import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function ConnectWallet({ className = "" }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 bg-[#1e1e2d] px-4 py-2 rounded-full border border-white/5 shadow-inner">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="font-mono text-xs text-[#e9e6f7]">{address?.slice(0,6)}...{address?.slice(-4)}</span>
        </div>
        <button 
          onClick={() => disconnect()}
          className="bg-[#242434] text-[#ff6e84] border border-[#ff6e84]/20 hover:bg-[#ff6e84]/10 transition-all px-4 py-2 rounded-lg font-bold text-xs uppercase"
          title="Disconnect Wallet"
        >
          <span className="material-symbols-outlined text-sm flex items-center justify-center">logout</span>
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => connect({ connector: connectors[0] })}
      className={`bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,164,255,0.4)] active:scale-95 transition-all duration-200 ${className}`}
    >
      Connect Wallet
    </button>
  );
}
