const drawings = {
  registration: `<path d="M18 49V30l8-6h25l8 9h37v36H18z" fill="#b1c6bb"/>
    <g class="news-art-detail"><path d="M42 10h36l10 10v39H42z" fill="#fffaf0"/><path d="M78 10v10h10M49 28h25m-25 7h29m-29 7h15"/></g>
    <path d="M16 45h35l6-5h46l-8 31H22z" fill="#d5bb91"/><rect x="31" y="51" width="23" height="8" rx="2" fill="#fffaf0"/>`,
  salary: `<path d="M18 12h57v55l-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3-5-3-7 3z" fill="#fffaf0"/>
    <path d="M26 22h35m-35 8h17m9 0h12m-38 9h17m9 0h12m-38 9h20" />
    <path d="M65 47l26-9 15 8v20H65z" fill="#d6b78c"/><g class="news-art-detail"><circle cx="83" cy="35" r="11" fill="#e3c484"/><path d="M86 30q-9-3-9 5t9 5m-12-6h9m-9 3h8"/></g>
    <path d="M61 47h49v24H61z" fill="#9ab8a6"/><path d="M98 54h14v9H98z" fill="#ecdfc4"/>`,
  recognition: `<path d="M23 14h45l8 9v43H23z" fill="#fffaf0"/><path d="M68 14v9h8M31 30h30m-30 8h24m-24 8h15"/>
    <path d="M85 14v14q0 14-12 14T61 28V17" stroke-width="4"/><path d="M73 42v8q0 15 14 15 12 0 12-15"/><circle cx="99" cy="45" r="7" fill="#b2c6bf"/>
    <g class="news-art-detail"><path d="M18 59h34v12H18z" fill="#d8b69a"/><circle cx="44" cy="57" r="7" fill="#e9d9b8"/><path d="m41 57 2 2 4-5"/></g>`,
  transfer: `<path d="M12 50l18-10 18 10zM14 66h33v4H14z" fill="#dfcda5"/><path d="M19 52v12m8-12v12m8-12v12m8-12v12"/>
    <path d="M82 48l16-12 17 12v22H82z" fill="#c0d0bd"/><path d="M90 53h6v6h-6zm9 17V58h8v12"/>
    <path d="M30 34Q59-3 98 29" stroke-dasharray="3 4"/><path d="m91 29 8 2-2-8"/>
    <g class="news-art-detail"><rect x="50" y="14" width="25" height="14" rx="3" fill="#e1bd83"/><circle cx="62.5" cy="21" r="3" fill="#fff8ea"/></g>`,
  expenses: `<path d="M45 35h57v37H45z" fill="#9fbaad"/><g class="news-art-detail"><path d="M23 9h39v47l-5-3-4 3-5-3-5 3-4-3-5 3-5-3-6 3z" fill="#fffaf0"/>
    <path d="M30 20h25m-25 8h14m4 0h7m-25 8h14m4 0h7"/></g>
    <path d="M43 47h25l6-6h34l-7 30H48z" fill="#d8bd97"/><path d="M57 52h18" stroke-width="3"/>`,
  jobs: `<rect x="21" y="12" width="66" height="58" rx="4" fill="#fffaf0"/><path d="M30 23h36m-36 10h45m-45 9h35m-35 9h20m-20 9h30"/>
    <g class="news-art-detail"><circle cx="81" cy="44" r="16" fill="#c2d9ce"/><circle cx="81" cy="44" r="11" fill="#edf4e9"/><path d="M73 42h13m-13 5h8"/><path d="m93 57 14 14" stroke-width="6"/></g>`,
  calendar: '<g fill="#fffaf0"><rect x="35" y="16" width="58" height="52" rx="5"/><path d="M35 31h58M48 11v10m30-10v10"/></g><g class="news-art-detail" fill="#b4c9b8"><rect x="45" y="39" width="10" height="9" rx="2"/><rect x="62" y="39" width="10" height="9" rx="2"/><path d="m63 56 5 5 10-13" fill="none"/></g>',
  paper: '<path d="M46 19h67v45q0 8-7 8H48q-6 0-6-6V32h4" fill="#e5d5b8"/><g class="news-art-detail"><path d="M33 11h69v54q0 7 5 7H40q-7 0-7-8z" fill="#fffaf0"/><path d="M42 21h49M42 27h31" stroke-width="3"/><path d="M42 37h19v14H42z" fill="#a8c5bd"/><path d="M68 38h23m-23 7h18m-18 7h23M42 60h49"/></g>',
  licence: '<rect x="51" y="7" width="39" height="67" rx="7" fill="#455f62"/><rect x="55" y="14" width="31" height="51" rx="2" fill="#dbeae1"/><path d="M67 69h7" stroke="#faf6ec"/><g class="news-art-detail"><rect x="24" y="33" width="54" height="33" rx="4" fill="#fff9e9"/><circle cx="36" cy="43" r="4" fill="#d5ac82"/><path d="M30 55q6-12 12 0z" fill="#97b4a5"/><path d="M49 43h20m-20 7h15m-15 7h19"/></g>',
  meter: '<path d="M25 56h-7V41h-5m84 1h18" fill="none"/><g fill="#e7d9bc"><rect x="24" y="29" width="12" height="38" rx="5"/><rect x="38" y="29" width="12" height="38" rx="5"/><rect x="52" y="29" width="12" height="38" rx="5"/><rect x="66" y="29" width="12" height="38" rx="5"/><rect x="80" y="29" width="12" height="38" rx="5"/></g><rect x="60" y="35" width="17" height="24" rx="3" fill="#fffdf4"/><path d="M64 41h9m-9 4h6"/><g class="news-art-detail" fill="none"><path d="M77 22q7-1 10 5m-11-12q14-2 18 10"/></g>',
  software: '<rect x="25" y="16" width="76" height="48" rx="4" fill="#b7cbbc"/><path d="M30 22h66v35H30z" fill="#fff9e9"/><path d="M18 65h90l-7 5H25z" fill="#d8c9aa"/><g class="news-art-detail" fill="none"><path d="m48 31-8 8 8 8m31-16 8 8-8 8m-12-17-7 19" stroke-width="3"/></g>'
};
export function newsArt(kind = 'paper') {
  const drawing = Object.hasOwn(drawings, kind) ? drawings[kind] : drawings.paper;
  return '<svg class="news-art" data-art="' + (Object.hasOwn(drawings, kind) ? kind : 'paper') + '" width="128" height="82" viewBox="0 0 128 82" fill="none" aria-hidden="true" focusable="false"><g stroke="#385451" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + drawing + '</g></svg>';
}

const flows = {
  registration: ['How address registration works', 'Get the housing confirmation', 'Attend registration', 'Keep the registration certificate'],
  salary: ['How the salary estimate works', 'Gross salary', 'Subtract wage tax and social contributions', 'Estimated take-home pay'],
  transfer: ['Compare a transfer to India', 'Enter the same euro amount for both quotes', 'Compare fees and the exchange rate', 'Check the rupees the recipient would get'],
  recognition: ['Prepare for professional recognition', 'Choose your profession and federal state', 'Find the responsible authority', 'Check its document and language requirements'],
  expenses: ['Prepare an expense for filing', 'Record what you paid', 'Attach the evidence', 'Review the entry before exporting']
};

export function illustratedPanel(kind) {
  return '<div class="atlas-art-panel">' + newsArt(kind) +
    '<button type="button" class="art-replay">Replay animation</button></div>';
}

export function guideFlow(kind) {
  const [title,...steps] = flows[kind];
  return '<figure class="guide-flow"><figcaption>' + title + '</figcaption>' + illustratedPanel(kind) +
    '<ol>' + steps.map(step => '<li>' + step + '</li>').join('') + '</ol></figure>';
}

let visibility;
export function mountIllustrations(root) {
  visibility?.disconnect();
  // Animate on first view so readers can see the movement even below the fold.
  if ('IntersectionObserver' in window) {
    visibility = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('art-in-view');
        visibility.unobserve(entry.target);
      }
    });
    root.querySelectorAll('.news-art').forEach(art => visibility.observe(art));
  }
  for (const replay of root.querySelectorAll('.art-replay')) {
    replay.onclick = () => {
      const art = replay.parentElement.querySelector('.news-art');
      art.classList.remove('art-in-view');
      art.getBoundingClientRect();
      art.classList.add('art-in-view');
    };
  }
}
