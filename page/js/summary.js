/**
 * 存贷组合产品测算器 - 汇总收益页面逻辑
 */

class SummaryPage {
    constructor() {
        this.products = [];
        this.currencyIncomes = {};
        this.exchangeRates = {};
        this.currentGroup = 'group1'; // 默认组

        // 汇率默认值配置 (以CNY为基准)
        this.defaultExchangeRates = {
            'CNY': {
                'USD': 0.14,    // 1 CNY = 0.14 USD
                'EUR': 0.13,    // 1 CNY = 0.13 EUR
                'GBP': 0.11,    // 1 CNY = 0.11 GBP
                'HKD': 1.09,    // 1 CNY = 1.09 HKD
                'JPY': 20.5,    // 1 CNY = 20.5 JPY
                'AUD': 0.21,    // 1 CNY = 0.21 AUD
                'CAD': 0.19,    // 1 CNY = 0.19 CAD
                'SGD': 0.19,    // 1 CNY = 0.19 SGD
                'CHF': 0.12     // 1 CNY = 0.12 CHF
            },
            'USD': {
                'CNY': 7.2,     // 1 USD = 7.2 CNY
                'EUR': 0.92,    // 1 USD = 0.92 EUR
                'GBP': 0.79,    // 1 USD = 0.79 GBP
                'HKD': 7.8,     // 1 USD = 7.8 HKD
                'JPY': 147.0,   // 1 USD = 147.0 JPY
                'AUD': 1.52,    // 1 USD = 1.52 AUD
                'CAD': 1.36,    // 1 USD = 1.36 CAD
                'SGD': 1.35,    // 1 USD = 1.35 SGD
                'CHF': 0.88     // 1 USD = 0.88 CHF
            },
            'EUR': {
                'CNY': 7.8,     // 1 EUR = 7.8 CNY
                'USD': 1.09,    // 1 EUR = 1.09 USD
                'GBP': 0.86,    // 1 EUR = 0.86 GBP
                'HKD': 8.5,     // 1 EUR = 8.5 HKD
                'JPY': 160.0,   // 1 EUR = 160.0 JPY
                'AUD': 1.66,    // 1 EUR = 1.66 AUD
                'CAD': 1.48,    // 1 EUR = 1.48 CAD
                'SGD': 1.47,    // 1 EUR = 1.47 SGD
                'CHF': 0.96     // 1 EUR = 0.96 CHF
            },
            'GBP': {
                'CNY': 9.1,     // 1 GBP = 9.1 CNY
                'USD': 1.27,    // 1 GBP = 1.27 USD
                'EUR': 1.16,    // 1 GBP = 1.16 EUR
                'HKD': 9.9,     // 1 GBP = 9.9 HKD
                'JPY': 186.0,   // 1 GBP = 186.0 JPY
                'AUD': 1.93,    // 1 GBP = 1.93 AUD
                'CAD': 1.72,    // 1 GBP = 1.72 CAD
                'SGD': 1.71,    // 1 GBP = 1.71 SGD
                'CHF': 1.12     // 1 GBP = 1.12 CHF
            },
            'HKD': {
                'CNY': 0.92,    // 1 HKD = 0.92 CNY
                'USD': 0.13,    // 1 HKD = 0.13 USD
                'EUR': 0.12,    // 1 HKD = 0.12 EUR
                'GBP': 0.10,    // 1 HKD = 0.10 GBP
                'JPY': 18.8,    // 1 HKD = 18.8 JPY
                'AUD': 0.19,    // 1 HKD = 0.19 AUD
                'CAD': 0.17,    // 1 HKD = 0.17 CAD
                'SGD': 0.17,    // 1 HKD = 0.17 SGD
                'CHF': 0.11     // 1 HKD = 0.11 CHF
            },
            'JPY': {
                'CNY': 0.049,   // 1 JPY = 0.049 CNY
                'USD': 0.0068,  // 1 JPY = 0.0068 USD
                'EUR': 0.0063,  // 1 JPY = 0.0063 EUR
                'GBP': 0.0054,  // 1 JPY = 0.0054 GBP
                'HKD': 0.053,   // 1 HKD = 0.053 JPY
                'AUD': 0.010,   // 1 JPY = 0.010 AUD
                'CAD': 0.0092,  // 1 JPY = 0.0092 CAD
                'SGD': 0.0092,  // 1 JPY = 0.0092 SGD
                'CHF': 0.0060   // 1 JPY = 0.0060 CHF
            },
            'AUD': {
                'CNY': 4.8,     // 1 AUD = 4.8 CNY
                'USD': 0.66,    // 1 AUD = 0.66 USD
                'EUR': 0.60,    // 1 AUD = 0.60 EUR
                'GBP': 0.52,    // 1 AUD = 0.52 GBP
                'HKD': 5.1,     // 1 AUD = 5.1 HKD
                'JPY': 97.0,    // 1 AUD = 97.0 JPY
                'CAD': 0.89,    // 1 AUD = 0.89 CAD
                'SGD': 0.89,    // 1 AUD = 0.89 SGD
                'CHF': 0.58     // 1 AUD = 0.58 CHF
            },
            'CAD': {
                'CNY': 5.4,     // 1 CAD = 5.4 CNY
                'USD': 0.74,    // 1 CAD = 0.74 USD
                'EUR': 0.68,    // 1 CAD = 0.68 EUR
                'GBP': 0.58,    // 1 CAD = 0.58 GBP
                'HKD': 5.7,     // 1 CAD = 5.7 HKD
                'JPY': 109.0,   // 1 CAD = 109.0 JPY
                'AUD': 1.12,    // 1 CAD = 1.12 AUD
                'SGD': 0.99,    // 1 CAD = 0.99 SGD
                'CHF': 0.65     // 1 CAD = 0.65 CHF
            },
            'SGD': {
                'CNY': 5.4,     // 1 SGD = 5.4 CNY
                'USD': 0.74,    // 1 SGD = 0.74 USD
                'EUR': 0.68,    // 1 SGD = 0.68 EUR
                'GBP': 0.58,    // 1 SGD = 0.58 GBP
                'HKD': 5.7,     // 1 SGD = 5.7 HKD
                'JPY': 109.0,   // 1 SGD = 109.0 JPY
                'AUD': 1.12,    // 1 SGD = 1.12 AUD
                'CAD': 1.01,    // 1 SGD = 1.01 CAD
                'CHF': 0.65     // 1 SGD = 0.65 CHF
            },
            'CHF': {
                'CNY': 8.3,     // 1 CHF = 8.3 CNY
                'USD': 1.14,    // 1 CHF = 1.14 USD
                'EUR': 1.04,    // 1 CHF = 1.04 EUR
                'GBP': 0.89,    // 1 CHF = 0.89 GBP
                'HKD': 8.9,     // 1 CHF = 8.9 HKD
                'JPY': 167.0,   // 1 CHF = 167.0 JPY
                'AUD': 1.73,    // 1 CHF = 1.73 AUD
                'CAD': 1.54,    // 1 CHF = 1.54 CAD
                'SGD': 1.54     // 1 CHF = 1.54 SGD
            }
        };

        this.init();
    }

    /**
     * 获取URL参数
     */
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const group = urlParams.get('group');
        if (group && (group === 'group1' || group === 'group2')) {
            this.currentGroup = group;
        }
        
        // 更新页面标题
        this.updatePageTitle();
    }

    /**
     * 更新页面标题
     */
    updatePageTitle() {
        const navTitle = document.getElementById('navTitle');
        if (navTitle) {
            const groupName = this.currentGroup === 'group1' ? '产品组1' : '产品组2';
            navTitle.textContent = `${groupName}汇总收益`;
        }
    }

    /**
     * 初始化默认汇率
     */
    initializeDefaultRates() {
        // 为所有外币设置默认汇率（如果用户还没有设置的话）
        const foreignCurrencies = ['USD', 'EUR', 'GBP', 'HKD', 'JPY', 'AUD', 'CAD', 'SGD', 'CHF'];

        foreignCurrencies.forEach(currency => {
            if (!this.exchangeRates[currency] || this.exchangeRates[currency] <= 0) {
                const defaultRate = this.getDefaultExchangeRate(currency, 'CNY');
                if (defaultRate && defaultRate > 0) {
                    this.exchangeRates[currency] = defaultRate;
                }
            }
        });
    }

    /**
     * 初始化页面
     */
    async init() {
        try {
            // 获取URL参数
            this.getUrlParams();
            
            // 初始化数据库
            await window.productDB.init();

            // 初始化公告服务
            try {
                await window.announcementService.init();
            } catch (error) {
                console.warn('公告服务初始化失败，将不显示公告信息:', error);
            }

            // 初始化默认汇率
            this.initializeDefaultRates();

            // 绑定事件
            this.bindEvents();

            // 加载公告信息
            await this.loadAnnouncements();

            // 加载产品数据并计算收益
            await this.loadAndCalculate();

        } catch (error) {
            console.error('页面初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 返回按钮
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });

        // 首页按钮
        document.getElementById('homeBtn').addEventListener('click', () => {
            this.goHome();
        });
    }

    /**
     * 加载公告信息
     */
    async loadAnnouncements() {
        try {
            console.log('开始加载公告信息...');
            
            if (!window.announcementService) {
                console.warn('公告服务不可用');
                return;
            }

            console.log('公告服务可用，开始获取数据...');
            const announcements = await window.announcementService.getActiveAnnouncements();
            console.log('获取到公告数据:', announcements);
            
            this.renderAnnouncements(announcements);
        } catch (error) {
            console.error('加载公告信息失败:', error);
            // 显示简单的错误提示
            this.showAnnouncementError(error.message);
        }
    }

    /**
     * 渲染公告信息
     */
    renderAnnouncements(announcements) {
        const announcementSection = document.getElementById('announcementSection');
        const announcementList = document.getElementById('announcementList');

        if (!announcements || announcements.length === 0) {
            announcementSection.style.display = 'none';
            return;
        }

        announcementSection.style.display = 'block';
        
        const announcementHtml = announcements.map(announcement => {
            const contentHtml = this.renderAnnouncementContent(announcement.contentBlocks || []);
            const updateTime = window.announcementService.formatDateTime(announcement.updateTime);
            
            return `
                <div class="announcement-item">
                    <div class="announcement-title">${announcement.title || '公告'}</div>
                    <div class="announcement-content">${contentHtml}</div>
                    <div class="announcement-meta">
                        <span class="announcement-time">${updateTime}</span>
                        <span class="announcement-maintainer">${announcement.maintainer || '系统'}</span>
                    </div>
                </div>
            `;
        }).join('');

        announcementList.innerHTML = announcementHtml;
    }

    /**
     * 渲染公告内容块
     */
    renderAnnouncementContent(contentBlocks) {
        if (!contentBlocks || contentBlocks.length === 0) {
            return '<p>暂无内容</p>';
        }

        return contentBlocks.map(block => {
            if (block.type === 'text') {
                return `<p>${block.content || ''}</p>`;
            } else if (block.type === 'image') {
                return `<img src="${block.imageData || ''}" alt="公告图片" style="max-width: 100%; height: auto; margin: 8px 0;">`;
            }
            return '';
        }).join('');
    }

    /**
     * 显示公告错误信息
     */
    showAnnouncementError(message) {
        const announcementSection = document.getElementById('announcementSection');
        const announcementList = document.getElementById('announcementList');
        
        announcementSection.style.display = 'block';
        announcementList.innerHTML = `
            <div class="announcement-item" style="border-left-color: #dc3545; background: #f8d7da;">
                <div class="announcement-title" style="color: #721c24;">公告加载失败</div>
                <div class="announcement-content" style="color: #721c24;">
                    <p>无法加载公告信息: ${message}</p>
                    <p><small>请检查浏览器控制台查看详细错误信息</small></p>
                </div>
            </div>
        `;
    }

    /**
     * 加载产品数据并计算收益
     */
    async loadAndCalculate() {
        try {
            // 显示加载状态
            this.showLoading();
            
            // 获取指定组的产品
            this.products = await window.productDB.getProductsByGroup(this.currentGroup);
            
            // 计算各币种收益
            this.calculateCurrencyIncomes();
            
            // 渲染币种收益列表
            this.renderCurrencyList();
            
            // 计算人民币汇总收益
            this.calculateCNYSummary();
            
            // 隐藏加载状态
            this.hideLoading();
            
        } catch (error) {
            console.error('加载数据失败:', error);
            this.showError('加载数据失败');
            this.hideLoading();
        }
    }

    /**
     * 计算各币种收益
     */
    calculateCurrencyIncomes() {
        this.currencyIncomes = {};
        this.totalFeesCNY = 0; // 总手续费（人民币）
        
        this.products.forEach(product => {
            const income = this.getProductIncome(product);
            const currency = this.getProductCurrency(product);
            const feeCNY = this.getProductFeeCNY(product);
            
            if (!this.currencyIncomes[currency]) {
                this.currencyIncomes[currency] = {
                    income: 0,
                    total: 0
                };
            }
            
            // 计算收益（不包含手续费）
            this.currencyIncomes[currency].income += income;
            this.currencyIncomes[currency].total = this.currencyIncomes[currency].income;
            
            // 累计手续费（人民币）
            this.totalFeesCNY += feeCNY;
        });
    }

    /**
     * 获取产品收益
     */
    getProductIncome(product) {
        switch (product.type) {
            case 'deposit':
                // 存款收益 = 利息
                return product.interest || 0;
            case 'loan':
                // 贷款收益 = -利息，贷款是支出（不包含手续费）
                return -(product.interest || 0);
            case 'credit':
                // 信用证收益 = 0，不计算手续费
                return 0;
            case 'foreign_swap':
                // 掉期收益 = 期末收益（不包含手续费）
                return product.finalIncome || 0;
            case 'foreign_spot':
            case 'foreign_forward':
                // 即期/远期交易通常没有直接收益
                return 0;
            case 'foreign_option':
                // 期权收益 = 期权费（收入为正，支出为负）
                const optionFeeAmount = product.optionFeeAmount || 0;
                return product.optionFeeType === 'income' ? optionFeeAmount : -optionFeeAmount;
            default:
                return 0;
        }
    }

    /**
     * 获取产品币种
     */
    getProductCurrency(product) {
        switch (product.type) {
            case 'deposit':
            case 'loan':
                return product.currency;
            case 'foreign_spot':
            case 'foreign_forward':
                return product.buyCurrency; // 以买入币种为准
            case 'foreign_swap':
                return product.nearBuyCurrency; // 以近端买入币种为准
            case 'foreign_option':
                return 'CNY'; // 期权费固定为人民币
            default:
                return 'CNY';
        }
    }

    /**
     * 获取汇率默认值
     */
    getDefaultExchangeRate(fromCurrency, toCurrency) {
        // 如果是相同币种，返回1
        if (fromCurrency === toCurrency) {
            return 1;
        }

        // 从默认汇率配置中查找
        if (this.defaultExchangeRates[fromCurrency] && this.defaultExchangeRates[fromCurrency][toCurrency]) {
            return this.defaultExchangeRates[fromCurrency][toCurrency];
        }

        // 尝试反向查找
        if (this.defaultExchangeRates[toCurrency] && this.defaultExchangeRates[toCurrency][fromCurrency]) {
            return 1 / this.defaultExchangeRates[toCurrency][fromCurrency];
        }

        return null;
    }

    /**
     * 获取产品手续费（转换为人民币）
     */
    getProductFeeCNY(product) {
        const feeAmount = parseFloat(product.feeAmount) || 0;
        if (feeAmount === 0) {
            return 0;
        }

        // 获取手续费币种
        const feeCurrency = product.feeCurrency || this.getProductCurrency(product);

        // 如果手续费币种是人民币，直接返回
        if (feeCurrency === 'CNY') {
            return feeAmount;
        }

        // 如果手续费币种不是人民币，需要汇率转换
        // 优先使用用户设置的汇率，如果没有则使用默认汇率
        let rate = this.exchangeRates[feeCurrency];
        if (!rate || rate <= 0) {
            rate = this.getDefaultExchangeRate(feeCurrency, 'CNY');
        }

        if (rate && rate > 0) {
            return feeAmount * rate;
        }

        return 0; // 没有汇率时返回0
    }



    /**
     * 渲染币种收益列表
     */
    renderCurrencyList() {
        const currencyList = document.getElementById('currencyList');
        const emptyState = document.getElementById('emptyState');
        
        if (Object.keys(this.currencyIncomes).length === 0) {
            currencyList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        currencyList.style.display = 'block';
        
        const currencyItems = Object.entries(this.currencyIncomes)
            .filter(([currency, data]) => data.total !== 0) // 只显示非零收益
            .map(([currency, data]) => this.renderCurrencyItem(currency, data))
            .join('');
        
        currencyList.innerHTML = currencyItems;
        
        // 绑定汇率输入事件
        this.bindRateInputEvents();
    }

    /**
     * 渲染币种收益项
     */
    renderCurrencyItem(currency, data) {
        const currencyName = this.getCurrencyName(currency);
        const incomeClass = this.getIncomeClass(data.total);
        const isCNY = currency === 'CNY';

        // 获取当前汇率（优先用户设置的，如果没有则使用默认值）
        let currentRate = this.exchangeRates[currency];
        if (!currentRate || currentRate <= 0) {
            currentRate = this.getDefaultExchangeRate(currency, 'CNY');
        }

        const hasRate = currentRate && currentRate > 0;
        const cnyConverted = hasRate ? data.total * currentRate : (isCNY ? data.total : 0);
        
        return `
            <div class="currency-item ${hasRate ? 'has-rate' : 'no-rate'}" data-currency="${currency}">
                <div class="currency-header">
                    <div class="currency-info">
                        <div class="currency-name">${currencyName}</div>
                    </div>
                    <div class="currency-income">
                        <div class="income-amount ${incomeClass}">${this.formatAmountWithSign(data.total)} ${currency}</div>
                        ${!isCNY && hasRate ? `
                            <div class="income-label">${this.formatCNYAmountWithSign(cnyConverted)}</div>
                        ` : ''}
                    </div>
                </div>
                
                ${!isCNY ? `
                    <div class="exchange-rate-section">
                        <div class="rate-input-group">
                            <div class="rate-label">汇率</div>
                            <input type="number"
                                   class="rate-input"
                                   data-currency="${currency}"
                                   placeholder="请输入${currency}对人民币汇率"
                                   step="0.01"
                                   min="0.01"
                                   max="9999.99"
                                   value="${currentRate && currentRate > 0 ? currentRate.toFixed(4) : ''}">
                        </div>
                        <div class="rate-error" data-currency="${currency}" style="display: none;"></div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * 获取币种名称
     */
    getCurrencyName(currency) {
        const currencyNames = {
            'CNY': '人民币',
            'USD': '美元',
            'EUR': '欧元',
            'GBP': '英镑',
            'HKD': '港币',
            'JPY': '日元',
            'AUD': '澳元',
            'CAD': '加元',
            'SGD': '新加坡元',
            'CHF': '瑞士法郎'
        };
        return currencyNames[currency] || currency;
    }

    /**
     * 获取收益样式类
     */
    getIncomeClass(amount) {
        if (amount > 0) return 'positive';
        if (amount < 0) return 'negative';
        return 'zero';
    }

    /**
     * 绑定汇率输入事件
     */
    bindRateInputEvents() {
        // 先移除所有现有的事件监听器
        document.querySelectorAll('.rate-input').forEach(input => {
            input.removeEventListener('input', this.handleRateInput);
            input.removeEventListener('blur', this.handleRateBlur);
        });
        
        // 重新绑定事件监听器
        document.querySelectorAll('.rate-input').forEach(input => {
            input.addEventListener('input', this.handleRateInput.bind(this));
            input.addEventListener('blur', this.handleRateBlur.bind(this));
        });
    }

    /**
     * 处理汇率输入事件
     */
    handleRateInput(e) {
        const currency = e.target.dataset.currency;
        const value = e.target.value;
        
        // 清除之前的定时器
        if (this.inputTimers && this.inputTimers[currency]) {
            clearTimeout(this.inputTimers[currency]);
        }
        
        // 初始化定时器对象
        if (!this.inputTimers) {
            this.inputTimers = {};
        }
        
        // 设置3秒延迟计算
        this.inputTimers[currency] = setTimeout(() => {
            const rate = parseFloat(value);
            this.onRateChange(currency, rate, e.target);
        }, 3000);
    }

    /**
     * 处理汇率失焦事件
     */
    handleRateBlur(e) {
        const currency = e.target.dataset.currency;
        const value = e.target.value;
        
        // 清除定时器
        if (this.inputTimers && this.inputTimers[currency]) {
            clearTimeout(this.inputTimers[currency]);
        }
        
        // 失焦时立即计算
        const rate = parseFloat(value);
        this.onRateChange(currency, rate, e.target);
        
        // 验证汇率
        this.validateRate(e.target);
    }

    /**
     * 汇率变化处理
     */
    onRateChange(currency, rate, inputElement) {
        // 清除错误状态
        this.clearRateError(currency);
        
        // 更新汇率
        if (rate && rate > 0) {
            this.exchangeRates[currency] = rate;
        } else {
            delete this.exchangeRates[currency];
        }
        
        // 更新汇率转换显示
        this.updateRateConversionDisplay(currency);
        
        // 重新计算手续费（因为汇率变化可能影响手续费的人民币金额）
        this.calculateCurrencyIncomes();
        
        // 重新计算人民币汇总
        this.calculateCNYSummary();
    }

    /**
     * 更新汇率转换显示
     */
    updateRateConversionDisplay(currency) {
        const currencyItem = document.querySelector(`[data-currency="${currency}"].currency-item`);
        if (!currencyItem || !this.currencyIncomes[currency]) {
            return;
        }
        
        const incomeElement = currencyItem.querySelector('.currency-income');
        const data = this.currencyIncomes[currency];
        const rate = this.exchangeRates[currency];
        
        if (rate && rate > 0) {
            const cnyConverted = data.total * rate;
            const incomeLabel = incomeElement.querySelector('.income-label');
            
            if (incomeLabel) {
                incomeLabel.textContent = `${this.formatCNYAmountWithSign(cnyConverted)}`;
            } else {
                const newLabel = document.createElement('div');
                newLabel.className = 'income-label';
                newLabel.textContent = `${this.formatCNYAmountWithSign(cnyConverted)}`;
                incomeElement.appendChild(newLabel);
            }
        } else {
            const incomeLabel = incomeElement.querySelector('.income-label');
            if (incomeLabel) {
                incomeLabel.remove();
            }
        }
    }

    /**
     * 验证汇率
     */
    validateRate(inputElement) {
        const currency = inputElement.dataset.currency;
        const rate = parseFloat(inputElement.value);
        
        if (inputElement.value && (!rate || rate <= 0)) {
            this.showRateError(currency, '汇率需为正数');
            inputElement.classList.add('error');
        } else if (rate && rate > 9999.99) {
            this.showRateError(currency, '汇率不能超过9999.99');
            inputElement.classList.add('error');
        } else {
            this.clearRateError(currency);
            inputElement.classList.remove('error');
        }
    }

    /**
     * 显示汇率错误
     */
    showRateError(currency, message) {
        const errorElement = document.querySelector(`[data-currency="${currency}"].rate-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    /**
     * 清除汇率错误
     */
    clearRateError(currency) {
        const errorElement = document.querySelector(`[data-currency="${currency}"].rate-error`);
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    }

    /**
     * 更新币种项
     */
    updateCurrencyItem(currency) {
        const currencyItem = document.querySelector(`[data-currency="${currency}"].currency-item`);
        if (currencyItem && this.currencyIncomes[currency]) {
            const newHtml = this.renderCurrencyItem(currency, this.currencyIncomes[currency]);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHtml;
            const newItem = tempDiv.firstElementChild;
            
            // 保持汇率输入框的值
            const oldInput = currencyItem.querySelector('.rate-input');
            const newInput = newItem.querySelector('.rate-input');
            if (oldInput && newInput) {
                newInput.value = oldInput.value;
            }
            
            currencyItem.outerHTML = newItem.outerHTML;
            
            // 重新绑定事件
            this.bindRateInputEvents();
        }
    }

    /**
     * 计算人民币汇总收益
     */
    calculateCNYSummary() {
        const cnyTotalAmount = document.getElementById('cnyTotalAmount');
        const cnyBreakdown = document.getElementById('cnyBreakdown');
        const feeTotalAmount = document.getElementById('feeTotalAmount');
        
        let totalCNY = 0;
        const breakdownItems = [];
        
        // 计算各币种的人民币等值
        Object.entries(this.currencyIncomes).forEach(([currency, data]) => {
            if (data.total !== 0) {
                if (currency === 'CNY') {
                    // 人民币直接计入总收益
                    totalCNY += data.total;
                    breakdownItems.push({
                        currency: currency,
                        amount: data.total
                    });
                } else {
                    // 其他币种需要汇率转换
                    const rate = this.exchangeRates[currency];
                    if (rate && rate > 0) {
                        const cnyAmount = data.total * rate;
                        totalCNY += cnyAmount;
                        breakdownItems.push({
                            currency: currency,
                            amount: cnyAmount
                        });
                    }
                }
            }
        });
        
        // 更新手续费汇总显示（手续费是支出，显示为负数）
        if (feeTotalAmount) {
            feeTotalAmount.textContent = this.formatCNYAmountWithSign(-this.totalFeesCNY);
        }
        
        // 添加手续费汇总到明细中
        if (this.totalFeesCNY !== 0) {
            breakdownItems.push({
                currency: '手续费',
                amount: -this.totalFeesCNY // 手续费是支出，显示为负数
            });
            totalCNY -= this.totalFeesCNY; // 从总收益中扣除手续费
        }
        
        // 更新总金额
        cnyTotalAmount.textContent = this.formatCNYAmountWithSign(totalCNY);
        
        // 更新总金额的颜色样式
        cnyTotalAmount.className = 'cny-amount';
        if (totalCNY > 0) {
            cnyTotalAmount.classList.add('positive');
        } else if (totalCNY < 0) {
            cnyTotalAmount.classList.add('negative');
        } else {
            cnyTotalAmount.classList.add('zero');
        }
        
        // 更新明细
        if (breakdownItems.length > 0) {
            const breakdownHtml = breakdownItems
                .map(item => {
                    const amountClass = item.amount > 0 ? 'positive' : (item.amount < 0 ? 'negative' : 'zero');
                    return `
                        <div class="cny-breakdown-item">
                            <div class="breakdown-currency">${item.currency}</div>
                            <div class="breakdown-amount ${amountClass}">${this.formatCNYAmountWithSign(item.amount)}</div>
                        </div>
                    `;
                })
                .join('');
            cnyBreakdown.innerHTML = breakdownHtml;
        } else {
            cnyBreakdown.innerHTML = `
                <div class="cny-breakdown-item">
                    <div class="breakdown-currency">暂无数据</div>
                    <div class="breakdown-amount zero">0.00 CNY</div>
                </div>
            `;
        }
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        const currencyList = document.getElementById('currencyList');
        currencyList.innerHTML = '<div class="loading">计算收益中...</div>';
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        // 加载状态会在renderCurrencyList中被清除
    }

    /**
     * 格式化金额
     */
    formatAmount(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return '0.00';
        }
        return parseFloat(amount).toFixed(2);
    }

    /**
     * 格式化带符号的金额
     */
    formatAmountWithSign(amount) {
        const formatted = this.formatAmount(amount);
        if (amount > 0) {
            return `+${formatted}`;
        }
        return formatted;
    }

    /**
     * 格式化人民币金额
     */
    formatCNYAmount(amount) {
        const formatted = this.formatAmount(amount);
        return `${formatted} CNY`;
    }

    /**
     * 格式化带符号的人民币金额
     */
    formatCNYAmountWithSign(amount) {
        const formatted = this.formatAmount(amount);
        if (amount > 0) {
            return `+${formatted} CNY`;
        }
        return `${formatted} CNY`;
    }

    /**
     * 返回上一页
     */
    goBack() {
        window.location.href = 'index.html';
    }

    /**
     * 跳转到首页
     */
    goHome() {
        window.location.href = 'index.html';
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        this.showMessage(message, 'error');
    }

    /**
     * 显示成功信息
     */
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    /**
     * 显示消息
     */
    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `${type}-message`;
        messageElement.textContent = message;
        
        const container = document.querySelector('.main-content');
        container.insertBefore(messageElement, container.firstChild);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    /**
     * 清理定时器
     */
    cleanup() {
        if (this.inputTimers) {
            Object.values(this.inputTimers).forEach(timer => {
                if (timer) {
                    clearTimeout(timer);
                }
            });
            this.inputTimers = {};
        }
    }
}

// 页面加载完成后初始化
let summaryPageInstance;

document.addEventListener('DOMContentLoaded', () => {
    summaryPageInstance = new SummaryPage();
});

// 页面卸载时清理定时器
window.addEventListener('beforeunload', () => {
    if (summaryPageInstance) {
        summaryPageInstance.cleanup();
    }
});
