const fs = require('fs');
const Uglify = require('uglify-es');

const listFilesFolder = (path) => {
  console.log('Directory file list: ');
  fs.readdirSync(path).forEach(file => console.log(file));
  console.log('');
};
const path = './build/static/js/';
const fileList = fs.readdirSync(path);
const fileName = fileList[0];
const fileNameFragments = fileName.split('.');
const randomFileNumber = fileNameFragments[1];
console.log('Random number:', randomFileNumber);

const uglifyjsOptions = {compress: true, mangle: {keep_fnames: true}, timings: true};

try {
  //todo: comprobar el nombre del fichero 'path + fileName'. debe ser del tipo main.*.js y no terminar en *.copia
  fs.renameSync((path + fileName), (path + fileName + '.copia'));
  listFilesFolder(path);
  const fileToUglify = path + fileName + '.copia';
  console.log('Reading file to uglify: ', fileToUglify);
  const fileContent = fs.readFileSync(fileToUglify, 'utf-8');

  console.log('Starting uglify process with options: ', uglifyjsOptions);
  console.log('...');
  const uglifyResult = Uglify.minify(fileContent, uglifyjsOptions);

  if (uglifyResult.error) {
    throw uglifyResult.error;
  }

  console.log('Uglify result', uglifyResult.timings);
  console.log('Creating destination file: ', path + fileName);
  fs.writeFileSync((path + fileName), uglifyResult.code, 'utf-8');
  fs.unlinkSync(path + fileName + '.copia');
  listFilesFolder(path);
} catch (error) {
  console.error(error);
}