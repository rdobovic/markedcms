// Used to run app on cpanel, it won't work directly

const runApp = async () => {
    await import('./build/index.js');
}

runApp();