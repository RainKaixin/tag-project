// 测试 description 元素的可见性
// 在 TAGMe 页面的控制台中运行

console.log('🔍 Testing description visibility...');

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
      console.log(
        `   Description text length: ${descriptionElement.textContent.length}`
      );

      // 检查样式
      const styles = window.getComputedStyle(descriptionElement);
      console.log(`   Display: ${styles.display}`);
      console.log(`   Visibility: ${styles.visibility}`);
      console.log(`   Opacity: ${styles.opacity}`);
      console.log(`   Color: ${styles.color}`);
      console.log(`   Background: ${styles.backgroundColor}`);
      console.log(`   Height: ${styles.height}`);
      console.log(`   Width: ${styles.width}`);
      console.log(`   Overflow: ${styles.overflow}`);
      console.log(`   Line-height: ${styles.lineHeight}`);
      console.log(`   Max-height: ${styles.maxHeight}`);

      // 检查父元素
      const parent = descriptionElement.parentElement;
      console.log(`   Parent element:`, parent);
      console.log(
        `   Parent display: ${window.getComputedStyle(parent).display}`
      );
      console.log(
        `   Parent height: ${window.getComputedStyle(parent).height}`
      );

      // 检查是否有 line-clamp 样式
      const hasLineClamp = descriptionElement.className.includes('line-clamp');
      console.log(`   Has line-clamp: ${hasLineClamp}`);

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
    } else {
      console.log(`   ❌ No description element found`);

      // 列出所有 p 元素
      const allP = card.querySelectorAll('p');
      console.log(`   All p elements:`, allP.length);
      allP.forEach((p, pIndex) => {
        console.log(
          `     P ${pIndex + 1}: "${p.textContent}" (classes: ${p.className})`
        );
      });
    }
  });
}, 2000);
