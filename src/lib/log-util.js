function LogDebug() {
  console.log('Debug:', ...arguments);
}

function LogRelease() {
  console.log(...arguments);
}

export {
  LogDebug,
  LogRelease,
}