// 测试 description 修复是否有效
// 在 TAGMe 页面的控制台中运行

console.log('🔍 Testing description fix...');

// 等待页面加载完成
setTimeout(() => {
  // 查找所有协作卡片
  const collaborationCards = document.querySelectorAll('[class*="grid"] > div');
  console.log('🎴 Found collaboration cards:', collaborationCards.length);

  collaborationCards.forEach((card, index) => {
    console.log(`\n📄 Card ${index + 1}:`);

    // 查找 description 元素
    const descriptionElement = card.querySelector('p[class*="text-xs"]');
    if (descriptionElement) {
      console.log(`   Description element found:`, descriptionElement);
      console.log(`   Description text: "${descriptionElement.textContent}"`);
      console.log(`   Description classes: "${descriptionElement.className}"`);

      // 检查样式
      const styles = window.getComputedStyle(descriptionElement);
      console.log(`   Display: ${styles.display}`);
      console.log(`   Visibility: ${styles.visibility}`);
      console.log(`   Opacity: ${styles.opacity}`);
      console.log(`   Color: ${styles.color}`);
      console.log(`   Height: ${styles.height}`);
      console.log(`   Width: ${styles.width}`);
      console.log(`   Overflow: ${styles.overflow}`);

      // 检查元素是否在视口中
      const rect = descriptionElement.getBoundingClientRect();
      console.log(`   Element position:`, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      console.log(
        `   Is visible in viewport: ${rect.height > 0 && rect.width > 0}`
      );

      // 检查是否有 line-clamp 样式
      const hasLineClamp = descriptionElement.className.includes('line-clamp');
      console.log(`   Has line-clamp: ${hasLineClamp}`);

      if (hasLineClamp) {
        console.log(`   ⚠️  Still has line-clamp class!`);
      } else {
        console.log(`   ✅ No line-clamp class found`);
      }
    } else {
      console.log(`   ❌ No description element found`);
    }
  });
}, 2000);
