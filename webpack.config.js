const Encore = require('@symfony/webpack-encore');

// Commentons tout temporairement
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')

    // Activation des entrées
    .addEntry('app', './assets/app.js')
    .addStyleEntry('styles', './assets/styles/app.css')

    .splitEntryChunks()
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())

    // Activation de Sass
    .enableSassLoader()
    ;

module.exports = Encore.getWebpackConfig();
