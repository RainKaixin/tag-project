// 调试协作项目中的联系信息数据
// 在项目详情页面的控制台中运行

console.log('🔍 Debugging contact information...');

// 检查 localStorage 中的协作数据
const stored = localStorage.getItem('mock_collaborations');
console.log('📦 Raw stored data:', stored ? 'Found' : 'Not found');

if (stored) {
  const collaborations = JSON.parse(stored);
  console.log('📋 Total collaborations:', collaborations.length);

  collaborations.forEach((collab, index) => {
    console.log(`\n${index + 1}. ${collab.title}:`);
    console.log(`   Contact Info:`, collab.contactInfo);
    console.log(`   Contact Email:`, collab.contactInfo?.email);
    console.log(`   Contact Discord:`, collab.contactInfo?.discord);
    console.log(`   Contact Other:`, collab.contactInfo?.other);
    console.log(
      `   Has contact info:`,
      !!(
        collab.contactInfo?.email ||
        collab.contactInfo?.discord ||
        collab.contactInfo?.other
      )
    );
  });

  // 检查当前页面的项目数据
  console.log('\n🔍 Current page project data:');

  // 尝试从页面获取项目数据
  const projectData =
    window.location.state?.project ||
    window.location.state?.collaboration ||
    window.location.state?.projectData;

  if (projectData) {
    console.log('📄 Project data from location state:', projectData);
    console.log(
      '📧 Contact info from location state:',
      projectData.contactInfo
    );
  } else {
    console.log('❌ No project data found in location state');
  }

  // 检查页面上的项目数据
  setTimeout(() => {
    console.log('\n🔍 Checking page elements...');

    // 查找项目描述元素
    const projectDescription = document.querySelector(
      '[class*="Project Description"]'
    );
    if (projectDescription) {
      console.log('📄 Found Project Description element:', projectDescription);
    } else {
      console.log('❌ No Project Description element found');
    }

    // 查找联系信息元素
    const contactInfo = document.querySelector(
      '[class*="Contact Information"]'
    );
    if (contactInfo) {
      console.log('📧 Found Contact Information element:', contactInfo);
    } else {
      console.log('❌ No Contact Information element found');
    }
  }, 1000);
} else {
  console.log('❌ No collaborations found in localStorage');
}

console.log('✅ Debug completed!');
