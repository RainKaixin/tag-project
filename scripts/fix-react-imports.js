const fs = require('fs');
const path = require('path');

// 递归查找所有JS/JSX文件
function findJsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (
      stat.isDirectory() &&
      !item.startsWith('.') &&
      item !== 'node_modules'
    ) {
      files.push(...findJsFiles(fullPath));
    } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

// 修复单个文件的React导入
function fixReactImport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 移除未使用的React导入
    const reactImportRegex = /^import\s+React\s+from\s+['"]react['"];?\s*$/gm;
    if (reactImportRegex.test(content)) {
      // 检查文件中是否使用了JSX
      const hasJSX = /<[A-Z][^>]*>/.test(content);

      if (!hasJSX) {
        content = content.replace(reactImportRegex, '');
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// 主函数
function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findJsFiles(srcDir);

  console.log(`Found ${files.length} JS/JSX files`);

  for (const file of files) {
    fixReactImport(file);
  }

  console.log('React import cleanup completed!');
}

main();

