const fs = require('fs');
const path = require('path');

// Analyze CSS files for unused classes
function analyzeCSS() {
  const cssDir = path.join(__dirname, '../public/assets/css');
  const srcDir = path.join(__dirname, '../src');
  
  // Get all CSS files
  const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
  
  // Get all source files
  const getAllFiles = (dir, ext) => {
    let files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(getAllFiles(fullPath, ext));
      } else if (item.endsWith(ext)) {
        files.push(fullPath);
      }
    }
    
    return files;
  };
  
  const sourceFiles = getAllFiles(srcDir, '.jsx').concat(getAllFiles(srcDir, '.js'));
  
  // Read all source content
  let sourceContent = '';
  sourceFiles.forEach(file => {
    try {
      sourceContent += fs.readFileSync(file, 'utf8');
    } catch (error) {
      console.log(`Error reading ${file}:`, error.message);
    }
  });
  
  // Analyze each CSS file
  cssFiles.forEach(cssFile => {
    const cssPath = path.join(cssDir, cssFile);
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Extract class names from CSS
    const classMatches = cssContent.match(/\.[\w-]+/g) || [];
    const uniqueClasses = [...new Set(classMatches)];
    
    // Check which classes are used
    const unusedClasses = uniqueClasses.filter(className => {
      const cleanClass = className.substring(1); // Remove the dot
      return !sourceContent.includes(cleanClass);
    });
    
    console.log(`\n${cssFile}:`);
    console.log(`Total classes: ${uniqueClasses.length}`);
    console.log(`Unused classes: ${unusedClasses.length}`);
    console.log(`Usage rate: ${((uniqueClasses.length - unusedClasses.length) / uniqueClasses.length * 100).toFixed(2)}%`);
    
    if (unusedClasses.length > 0 && unusedClasses.length < 50) {
      console.log(`Unused classes: ${unusedClasses.slice(0, 10).join(', ')}${unusedClasses.length > 10 ? '...' : ''}`);
    }
  });
}

analyzeCSS();
