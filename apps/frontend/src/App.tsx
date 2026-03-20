import { Button, Card, Typography } from "antd";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const { Title, Paragraph } = Typography;

export default function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#f5f5f5" }}>
      <Card style={{ maxWidth: 720, margin: "0 auto" }}>
        <Title level={2}>QuanLyThueNha</Title>
        <Paragraph>
          Frontend da san sang voi React, Vite, TypeScript, Wagmi, Ethers,
          Ant Design va Tailwind.
        </Paragraph>

        {isConnected ? (
          <>
            <Paragraph>
              Wallet connected: <strong>{address}</strong>
            </Paragraph>
            <Button danger onClick={() => disconnect()}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect Wallet
          </Button>
        )}
      </Card>
    </div>
  );
}
