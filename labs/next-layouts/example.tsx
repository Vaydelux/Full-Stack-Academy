import React,{type ReactNode} from 'react';
// Example file: app/dashboard/layout.tsx
export default function DashboardLayout({children}:{children:ReactNode}){return <section aria-label="Dashboard shell"><nav aria-label="Dashboard navigation">Dashboard</nav><main>{children}</main></section>;}
