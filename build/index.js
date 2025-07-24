import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import FilterPanel from './FilterPanel.js';
const schema = [
    { name: 'Name', type: 'string' },
    { name: 'Type', type: 'string' },
    { name: 'Level', type: 'number' },
    { name: 'Area', type: 'string' },
];
function onSearch(filters) {
    if (window.applyReactFilters) {
        window.applyReactFilters(filters);
    }
    else {
        console.log('Filters', filters);
    }
}
const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(_jsx(FilterPanel, { schema: schema, onSearch: onSearch }));
