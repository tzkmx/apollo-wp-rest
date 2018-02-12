const SerialJsonResponse = {
  url: response => response.clone().url,
  response: response => response.clone().json(),
  headers: response => {
    const headers = response.clone().headers._headers
    let accum = []
    for (var key in headers) {
      accum.push(key.toString() + ': ' + headers[key])
    }
    return accum
  }
}

export default SerialJsonResponse
