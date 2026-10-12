import './styles.css';
import { renderHero } from './hero.ts';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root is missing');

app.append(renderHero());
