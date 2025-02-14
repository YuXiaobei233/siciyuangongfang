const storage = {
    getUsage() {
        return JSON.parse(localStorage.getItem('toolUsage') || '{}')
    },
    updateUsage(toolName) {
        const usage = this.getUsage()
        usage[toolName] = (usage[toolName] || 0) + 1
        localStorage.setItem('toolUsage', JSON.stringify(usage))
        return usage
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const toolCards = document.querySelectorAll('.tool-card');
    const iframeContainer = document.querySelector('.tool-iframe-container');
    const toolFrame = document.querySelector('.tool-frame');

    // 初始化主题
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) document.documentElement.className = savedTheme

    // 初始化使用统计
    const usageCounter = document.querySelector('.usage-counter')
    const updateCounter = () => {
        const total = Object.values(storage.getUsage()).reduce((a, b) => a + b, 0)
        usageCounter.textContent = `📊 ${total}`
    }
    updateCounter()

    // 添加主题切换功能
    document.querySelector('.theme-toggle').addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', isDark ? 'dark' : '')
    })

    // 处理工具卡片点击
    toolCards.forEach(card => {
        card.querySelector('.open-tool').addEventListener('click', () => {
            const toolName = card.dataset.tool;
            storage.updateUsage(toolName);
            updateCounter();  // 更新统计显示
            toolFrame.src = `${toolName}.html`;
            iframeContainer.style.display = 'flex';
        });
    });

    // 关闭工具窗口
    iframeContainer.addEventListener('click', (e) => {
        if (e.target === iframeContainer) {
            toolFrame.src = '';
            iframeContainer.style.display = 'none';
        }
    });

    // 首页按钮功能
    document.querySelector('.home-link').addEventListener('click', (e) => {
        e.preventDefault()
        // 关闭工具窗口
        toolFrame.src = ''
        iframeContainer.style.display = 'none'
        // 平滑滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })

    // 修改现有的导航栏点击处理
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // 关闭工具窗口
                toolFrame.src = '';
                iframeContainer.style.display = 'none';
                
                // 平滑滚动
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 添加临时高亮
                targetSection.style.transition = 'box-shadow 0.5s';
                targetSection.style.boxShadow = `0 0 0 3px ${getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color')}`;
                
                setTimeout(() => {
                    targetSection.style.boxShadow = 'none';
                }, 1000);
            }
        });
    });
}); 