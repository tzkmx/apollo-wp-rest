const uaForFetch = ({secrets}) => {
  return { headers: { 'User-Agent': `${secrets.userAgent}` } }
}

export {uaForFetch}
