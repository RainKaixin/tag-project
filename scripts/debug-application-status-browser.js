// 浏览器控制台调试脚本 - 直接复制到浏览器控制台运行
(function () {
  console.log('=== 申请状态调试脚本 (浏览器版) ===');

  // 检查localStorage中的申请数据
  const checkApplicationData = () => {
    console.log('\n1. 检查localStorage中的申请数据:');

    const allKeys = Object.keys(localStorage);
    const applicationKeys = allKeys.filter(key =>
      key.startsWith('tag_applications_data')
    );

    console.log('找到的申请数据键:', applicationKeys);

    applicationKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        const parsedData = JSON.parse(data);
        console.log(`\n键: ${key}`);
        console.log('数据:', parsedData);

        if (parsedData.applications) {
          Object.entries(parsedData.applications).forEach(
            ([positionId, applications]) => {
              console.log(`  职位 ${positionId} 的申请:`, applications);
            }
          );
        }
      } catch (error) {
        console.error(`解析键 ${key} 时出错:`, error);
      }
    });
  };

  // 检查协作项目数据
  const checkCollaborationData = () => {
    console.log('\n2. 检查localStorage中的协作项目数据:');

    try {
      const collaborationsData = localStorage.getItem('mock_collaborations');
      if (collaborationsData) {
        const collaborations = JSON.parse(collaborationsData);
        console.log('协作项目数据:', collaborations);

        collaborations.forEach(collab => {
          console.log(`\n项目 ${collab.id}:`);
          console.log('  - 角色/职位:', collab.roles);
          console.log('  - 合作者:', collab.collaborators);
          console.log('  - Vision合作者:', collab.vision?.collaborators);
        });
      } else {
        console.log('没有找到协作项目数据');
      }
    } catch (error) {
      console.error('解析协作项目数据时出错:', error);
    }
  };

  // 检查当前页面的positions数据
  const checkCurrentPageData = () => {
    console.log('\n3. 检查当前页面的positions数据:');

    // 尝试从React组件中获取数据
    const reactRoot = document.querySelector('#root');
    if (reactRoot && reactRoot._reactInternalFiber) {
      console.log('React根节点:', reactRoot._reactInternalFiber);
    }

    // 检查全局变量
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('React DevTools可用');
    }

    // 尝试从localStorage推断当前项目ID
    const applicationKeys = Object.keys(localStorage).filter(key =>
      key.startsWith('tag_applications_data')
    );
    if (applicationKeys.length > 0) {
      const currentProjectId = applicationKeys[0].replace(
        'tag_applications_data_',
        ''
      );
      console.log('推断的当前项目ID:', currentProjectId);
    }
  };

  // 执行调试
  checkApplicationData();
  checkCollaborationData();
  checkCurrentPageData();

  console.log('\n=== 调试完成 ===');
})();
