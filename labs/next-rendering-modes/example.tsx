import React from 'react';
import {cacheLife} from 'next/cache';
async function getPublicIntro(){'use cache';cacheLife('days');return 'Public handbook';}
export default async function Handbook(){return <main><h1>{await getPublicIntro()}</h1></main>;}
