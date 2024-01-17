const fs = require('fs');
const path = require('path');

// Define the directory and file paths
const filtersDirPath = path.join(process.cwd(), 'filters');
const packageJsonPath = path.join(process.cwd(), 'package.json');

// Read the package.json file
const packageJson = require(packageJsonPath);

// Ensure the exports field exists
packageJson.exports = {};

packageJson.exports['.'] = {
    import: './lib/index.mjs',
    require: './lib/index.js',
    types: './lib/index.d.js',
};

// Read all directories in the filters folder
fs.readdirSync(filtersDirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) =>
    {
    // Add each directory to the exports field
        const dirName = dirent.name;

        packageJson.exports[`./${dirName}`] = {
            import: `./lib/${dirName}.mjs`,
            require: `./lib/${dirName}.js`,
            types: `./lib/${dirName}.d.js`,
        };
    });

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
