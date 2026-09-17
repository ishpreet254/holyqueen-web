/* Applied before first paint so the stored theme never flashes.
   Light is the default: if nothing is stored, nothing changes. */
const script = `(function(){try{var t=localStorage.getItem("hq-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
