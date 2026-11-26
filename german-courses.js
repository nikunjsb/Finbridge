const goethe = 'https://www.goethe.de/ins/de/en/';
const cube = {
  name: 'Languages Cube', url: 'https://www.languagescube.com/',
  detail: 'German A1, A2 and B1. Ask about the next batch and fees.',
  contact: 'https://wa.me/message/57E5CH4LZMHCG1'
};
const classrooms = [
  {city: 'Berlin', name: 'Berliner Volkshochschulen (VHS)', detail: 'Explore German and integration courses across the twelve district adult education centres.', url: 'https://www.berlin.de/vhs/kurse/deutsch-integration/deutsch-und-integrationsangebote/'},
  {city: 'Berlin', name: 'Goethe-Institut Berlin', detail: 'German classroom courses in Berlin.', url: goethe + 'ort/ber.html'},
  {city: 'Heidelberg', name: 'vhs Heidelberg', detail: 'German courses at the local adult education centre.', url: 'https://www.vhs-hd.de/fachbereich/gesamtprogramm/deutsch'},
  {city: 'Kalyan West, India', ...cube},
  {city: 'Mannheim', name: 'Goethe-Institut Mannheim', detail: 'German classroom courses in Mannheim.', url: goethe + 'ort/man.html'},
  {city: 'Munich (München)', name: 'Münchner Volkshochschule (MVHS)', detail: 'Browse German courses and check the classroom location for each listing.', url: 'https://www.mvhs.de/kurse/deutsch-integration/deutschkurse-460-CAT-KAT19234'},
  {city: 'Munich (München)', name: 'Goethe-Institut Munich', detail: 'German classroom courses in Munich.', url: goethe + 'ort/mue.html'}
];
const online = [
  {name: 'Goethe-Institut', detail: 'Compare online group courses and independent study options.', url: goethe + 'kur/typ.html'},
  {name: 'Lingoda', detail: 'Live German lessons online in small groups or one-to-one.', url: 'https://www.lingoda.com/en/german/'},
  cube
];

export function courseFinder() {
  const cities = [...new Set(classrooms.map(item => item.city))];
  return `<section id="germanCourses"><div class="sectionhead"><h2>Find German classes</h2></div>
    <div class="card"><div role="tablist" aria-label="Class format">
    ${['In person','Online'].map((label, i) => `<button type="button" role="tab" class="button${i ? ' secondary' : ''}" id="courseTab${i}" aria-controls="coursePanel" aria-selected="${!i}" tabindex="${i ? -1 : 0}">${label}</button>`).join(' ')}
    </div><div role="tabpanel" id="coursePanel" aria-labelledby="courseTab0">
    <div id="courseLocation"><label class="field">Classroom location<select id="courseCity"><option value="">All cities</option>${cities.map(city => `<option>${city}</option>`).join('')}</select></label></div>
    <label class="field">Search classes<input type="search" id="courseSearch" placeholder="Search by provider or keyword"></label>
    <p role="status" id="courseCount"></p><div class="grid two" id="courseMatches"></div>
    <p id="courseDirectories">For other German towns or postcodes, search the <a href="https://www.volkshochschule.de/kursfinder.php">nationwide VHS course finder</a> or the <a href="https://bamf-navi.bamf.de/en/Themen/Integrationskurse/">BAMF integration course finder</a>.</p></div></div></section>`;
}

export function mountCourseFinder() {
  const root = document.getElementById('germanCourses');
  const get = id => root.querySelector('#' + id);
  const tabs = [...root.querySelectorAll('[role=tab]')];
  const city = get('courseCity'), query = get('courseSearch');
  const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let isOnline = false;
  const terms = ['', ''];
  function update() {
    const words = normalize(query.value.trim()).split(/\s+/);
    const matches = (isOnline ? online : classrooms).filter(item => {
      const text = normalize([item.name, item.city, item.detail].join(' '));
      return (isOnline || !city.value || city.value === item.city) && words.every(word => text.includes(word));
    });
    get('courseCount').textContent = matches.length ? matches.length + (matches.length === 1 ? ' provider' : ' providers') : 'No matching providers. Try another search or clear your filters.';
    get('courseMatches').innerHTML = matches.map(item => `<article class="card"><h3>${item.name}</h3><b>${isOnline ? 'Online' : item.city}</b><p>${item.detail}</p><a href="${item.url}">View courses at ${item.name}</a>${item.contact ? ` · <a href="${item.contact}">Message Languages Cube on WhatsApp</a>` : ''}</article>`).join('');
  }
  function select(index) {
    terms[Number(isOnline)] = query.value;
    isOnline = index === 1;
    query.value = terms[index];
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(index === i));
      tab.tabIndex = index === i ? 0 : -1;
      tab.classList.toggle('secondary', i !== index);
    });
    get('coursePanel').setAttribute('aria-labelledby', tabs[index].id);
    get('courseLocation').hidden = get('courseDirectories').hidden = isOnline;
    update();
  }
  tabs.forEach((tab, i) => {
    tab.onclick = () => select(i);
    tab.onkeydown = event => {
      const next = {ArrowLeft: 1-i, ArrowRight: 1-i, Home: 0, End: 1}[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    };
  });
  city.onchange = query.oninput = update;
  update();
}
