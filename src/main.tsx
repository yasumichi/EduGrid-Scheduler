import { render } from 'preact';
import { App } from './App';
import './index.css';
import './i18n';

render(<App />, document.getElementById('app')!);
