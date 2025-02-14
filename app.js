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
}); 