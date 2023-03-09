import { useStore } from '@nanostores/react';
import { themeStore, setTheme, setPalette } from '../../stores/themeStore';

export default function ThemeSelect() {

    const theme = useStore(themeStore);

    const onModeChange = (e: any) => {
        setTheme(e.target.value);
    }

    const onPaletteChange = (e: any) => {
        setPalette(e.target.value);
    }

    return (
        <>
        <label className="label" htmlFor="theme" aria-label="Theme select"></label>
        <select className="select" name="theme" id="themeSelector" value={theme} onChange={onModeChange}>
            <option value="sanity">Sanity Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
            <option value="hotdog">Hot Dog Stand</option>
        </select>
        </>
    )
}