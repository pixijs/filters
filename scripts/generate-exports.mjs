import fs from 'node:fs';
import path from 'node:path';
import packageJson from '../package.json' assert { type: 'json' };

// Define the directory and file paths
const filtersDirPath = path.resolve('src');
const packageJsonPath = path.resolve('package.json');

// Ensure the exports field exists
packageJson.exports = packageJson.exports ?? {};

packageJson.exports['.'] = {
    import: './lib/index.mjs',
    require: './lib/index.js',
    types: './lib/index.d.ts',
};

// Read all directories in the filters folder
fs.readdirSync(filtersDirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) =>
    {
    // Add each directory to the exports field
        const dirName = dirent.name;

        packageJson.exports[`./${dirName}`] = {
            import: `./lib/${dirName}/index.mjs`,
            require: `./lib/${dirName}/index.js`,
            types: `./lib/${dirName}/index.d.ts`,
        };
    });

async function fileExists(filePath)
{
    try
    {
        fs.accessSync(path.resolve(filePath));

        return true;
    }
    catch
    {
        return false;
    }
}

function validateExports(exports)
{
    return Promise.all(
        Object.entries(exports).map(async ([key, value]) =>
        {
            const { import: importPath, require: requirePath, types: typesPath } = value;

            if (!importPath || !(await fileExists(importPath)))
            {
                throw new Error(`The import path "${importPath}" for "${key}" does not exist.`);
            }

            if (!requirePath || !(await fileExists(requirePath)))
            {
                throw new Error(`The require path "${requirePath}" for "${key}" does not exist.`);
            }

            if (!typesPath || !(await fileExists(typesPath)))
            {
                throw new Error(`The types path "${typesPath}" for "${key}" does not exist.`);
            }
        })
    );
}

try
{
    await validateExports(packageJson.exports);
    // Write the updated package.json back to disk
    fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
catch (error)
{
    console.error(`ERROR: ${error.message}\n`);
    process.exit(1);
}

