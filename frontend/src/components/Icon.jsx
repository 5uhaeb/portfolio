export default function Icon({ name = 'arrow', size = 20, ...props }) {
  const paths = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    external: <><path d="M7 17 17 7M7 7h10v10" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" /></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
    moon: <path d="M20.6 13.2A9 9 0 0 1 10.8 3.4a9 9 0 1 0 9.8 9.8Z"/>,
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    location: <><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    book: <><path d="M12 5C7 2 3 4 3 4v15s4-2 9 1c5-3 9-1 9-1V4s-4-2-9 1Zm0 0v15"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.arrow}</svg>;
}
