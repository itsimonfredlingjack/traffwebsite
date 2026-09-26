import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { FAQS } from './data/faqs';

export function render() {
  return renderToString(React.createElement(App));
}

export { FAQS };
