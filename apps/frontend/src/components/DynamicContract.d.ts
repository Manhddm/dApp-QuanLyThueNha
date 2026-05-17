interface DynamicContractProps {
    isOpen: boolean;
    onClose: () => void;
    onSign: () => void;
    isPending: boolean;
    room: any;
    landlord: any;
    tenant: any;
}
export default function DynamicContract({ isOpen, onClose, onSign, isPending, room, landlord, tenant }: DynamicContractProps): import("react/jsx-runtime").JSX.Element;
export {};
