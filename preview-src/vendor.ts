import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';

const w = window as unknown as Record<string, unknown>;
w.React = React;
w.ReactDOM = ReactDOMClient;

export {};
