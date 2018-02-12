const uaForFetch = (context) => {
  const secrets = typeof context === 'undefined'
    ? { userAgent: navigator.userAgent }
    : context.secrets
  return { headers: { 'User-Agent': `${secrets.userAgent}` } }
}

export {uaForFetch}
