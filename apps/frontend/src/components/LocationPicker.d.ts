import 'leaflet/dist/leaflet.css';
interface LocationPickerProps {
    position: [number, number] | null;
    onChange: (lat: number, lng: number) => void;
    addressContext?: string;
}
export default function LocationPicker({ position, onChange, addressContext }: LocationPickerProps): import("react/jsx-runtime").JSX.Element;
export {};
