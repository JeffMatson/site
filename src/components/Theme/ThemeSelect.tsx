import { useStore } from '@nanostores/react';
import { themeStore, setTheme } from '../../stores/themeStore';

export default function ThemeSelect() {

    const theme = useStore(themeStore);

    const onChange = (e: any) => {
        setTheme(e.target.value);
    }

    return (
        <>
        <label className="label" htmlFor="theme" aria-label="Theme select"></label>
        <select className="select" name="theme" id="themeSelector" value={theme} onChange={onChange}>
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
            <option value="sanity">Sanity Mode</option>
        </select>
        </>
    )
}