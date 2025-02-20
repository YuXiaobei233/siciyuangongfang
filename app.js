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

// 修正工具加载逻辑
const toolConfigs = {
    zimupaiban: {
        title: "自动排版表生成器",
        url: "zimupaiban.html",
        icon: `<path d="M6 2h12v2H6V2zm0 4h12v2H6V6zm0 4h12v2H6v-2zm0 4h12v2H6v-2zm0 4h12v2H6v-2z"/>`
    },
    tupianyasuo: {
        title: "智能图片压缩",
        url: "tupianyasuo.html",
        icon: `<path d="M8 5h8v2H8V5zm10 14H6V7h12v12zm0-14H6V3h12v2zM4 21h16V5h2v16H2V5h2v16z"/>`
    },
    lunch: {
        title: "今日午餐吃什么",
        url: "zhongwuchishenmo.html",
        icon: `<path d="M12 2c5.5 0 10 4.5 10 10 0 3.2-1.7 6-4.2 7.6l-1.1-1.8c1.8-1.1 3-3.1 3-5.4 0-3.6-2.9-6.5-6.5-6.5-3.3 0-6 2.4-6.5 5.5H6.3C6.8 6.3 9.1 4 12 4c4.4 0 8 3.6 8 8s-3.6 8-8 8c-1.7 0-3.3-.5-4.6-1.4l-1.7 1.7C7.5 21.5 9.7 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm-1 5v5h5v-2h-3V7h-2z"/>`
    }
};

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
            const toolConfig = toolConfigs[toolName]; // 获取配置
            
            storage.updateUsage(toolName);
            updateCounter();
            toolFrame.src = toolConfig.url; // 使用配置中的URL
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