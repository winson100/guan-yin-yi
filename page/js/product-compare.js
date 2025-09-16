/**
 * 存贷组合产品测算器 - 产品组合比较页面逻辑
 */

class ProductComparePage {
    constructor() {
        this.group1Products = [];
        this.group2Products = [];
        this.group1CurrencyIncomes = {};
        this.group2CurrencyIncomes = {};
        this.exchangeRates = {};

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
                'HKD': 0.053,   // 1 JPY = 0.053 HKD
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
                'HKD': 5.8,     // 1 CAD = 5.8 HKD
                'JPY': 109.0,   // 1 CAD = 109.0 JPY
                'AUD': 1.12,    // 1 CAD = 1.12 AUD
                'SGD': 1.00,    // 1 CAD = 1.00 SGD
                'CHF': 0.65     // 1 CAD = 0.65 CHF
            },
            'SGD': {
                'CNY': 5.4,     // 1 SGD = 5.4 CNY
                'USD': 0.74,    // 1 SGD = 0.74 USD
                'EUR': 0.68,    // 1 SGD = 0.68 EUR
                'GBP': 0.58,    // 1 SGD = 0.58 GBP
                'HKD': 5.8,     // 1 SGD = 5.8 HKD
                'JPY': 109.0,   // 1 SGD = 109.0 JPY
                'AUD': 1.12,    // 1 SGD = 1.12 AUD
                'CAD': 1.00,    // 1 SGD = 1.00 CAD
                'CHF': 0.65     // 1 SGD = 0.65 CHF
            },
            'CHF': {
                'CNY': 8.3,     // 1 CHF = 8.3 CNY
                'USD': 1.14,    // 1 CHF = 1.14 USD
                'EUR': 1.04,    // 1 CHF = 1.04 EUR
                'GBP': 0.89,    // 1 CHF = 0.89 GBP
                'HKD': 8.9,     // 1 CHF = 8.9 HKD
                'JPY': 167.0,   // 1 CHF = 167.0 JPY
                'AUD': 1.72,    // 1 CHF = 1.72 AUD
                'CAD': 1.54,    // 1 CHF = 1.54 CAD
                'SGD': 1.54     // 1 CHF = 1.54 SGD
            }
        };

        this.init();
    }

    /**
     * 初始化页面
     */
    async init() {
        try {
            // 初始化数据库
            await window.productDB.init();
            
            // 绑定事件
            this.bindEvents();
            
            // 加载和计算数据
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
     * 加载和计算数据
     */
    async loadAndCalculate() {
        try {
            // 获取两个组的产品数据
            this.group1Products = await window.productDB.getProductsByGroup('group1');
            this.group2Products = await window.productDB.getProductsByGroup('group2');

            // 计算两个组的收益
            this.calculateGroupIncomes('group1', this.group1Products);
            this.calculateGroupIncomes('group2', this.group2Products);

            // 渲染页面
            this.renderPage();

        } catch (error) {
            console.error('加载数据失败:', error);
            this.showError('加载数据失败');
        }
    }

    /**
     * 计算指定组的收益
     */
    calculateGroupIncomes(groupId, products) {
        const currencyIncomes = {};
        let totalFeeAmount = 0;

        products.forEach(product => {
            const income = this.getProductIncome(product);
            const currency = this.getProductCurrency(product);
            
            if (!currencyIncomes[currency]) {
                currencyIncomes[currency] = {
                    amount: 0,
                    count: 0,
                    products: []
                };
            }
            
            currencyIncomes[currency].amount += income;
            currencyIncomes[currency].count += 1;
            currencyIncomes[currency].products.push(product);

            // 计算手续费
            const feeCNY = this.getProductFeeCNY(product);
            totalFeeAmount += feeCNY;
        });

        if (groupId === 'group1') {
            this.group1CurrencyIncomes = currencyIncomes;
            this.group1TotalFeeAmount = totalFeeAmount;
        } else {
            this.group2CurrencyIncomes = currencyIncomes;
            this.group2TotalFeeAmount = totalFeeAmount;
        }
    }

    /**
     * 获取产品手续费（人民币）
     */
    getProductFeeCNY(product) {
        // 手续费原始数据就是按照人民币输入的，直接返回
        return parseFloat(product.feeAmount) || 0;
    }

    /**
     * 获取产品收益
     */
    getProductIncome(product) {
        switch (product.type) {
            case 'deposit':
                const depositAmount = parseFloat(product.amount) || 0;
                const depositRate = parseFloat(product.rate) || 0;
                const depositPeriod = parseFloat(product.period) || 0;
                const depositUnit = product.periodUnit || 'day';
                
                let depositDays = depositPeriod;
                if (depositUnit === 'month') {
                    depositDays = depositPeriod * 30;
                } else if (depositUnit === 'year') {
                    depositDays = depositPeriod * 365;
                }
                
                return (depositAmount * depositRate * depositDays) / 36500;

            case 'loan':
                const loanAmount = parseFloat(product.amount) || 0;
                const loanRate = parseFloat(product.rate) || 0;
                const loanPeriod = parseFloat(product.period) || 0;
                const loanUnit = product.periodUnit || 'day';
                
                let loanDays = loanPeriod;
                if (loanUnit === 'month') {
                    loanDays = loanPeriod * 30;
                } else if (loanUnit === 'year') {
                    loanDays = loanPeriod * 365;
                }
                
                return -(loanAmount * loanRate * loanDays) / 36500;

            case 'credit':
                const creditAmount = parseFloat(product.amount) || 0;
                const creditRate = parseFloat(product.rate) || 0;
                const creditPeriod = parseFloat(product.period) || 0;
                const creditUnit = product.periodUnit || 'day';
                
                let creditDays = creditPeriod;
                if (creditUnit === 'month') {
                    creditDays = creditPeriod * 30;
                } else if (creditUnit === 'year') {
                    creditDays = creditPeriod * 365;
                }
                
                return (creditAmount * creditRate * creditDays) / 36500;

            case 'foreign_spot':
            case 'foreign_forward':
            case 'foreign_swap':
                const sellAmount = parseFloat(product.sellAmount) || 0;
                const buyAmount = parseFloat(product.buyAmount) || 0;
                const exchangeRate = parseFloat(product.exchangeRate) || 0;
                
                if (exchangeRate > 0) {
                    return sellAmount - (buyAmount / exchangeRate);
                }
                return 0;

            case 'foreign_option':
                const optionFeeAmount = parseFloat(product.optionFeeAmount) || 0;
                const optionFeeType = product.optionFeeType;
                
                if (optionFeeType === 'income') {
                    return optionFeeAmount;
                } else if (optionFeeType === 'expense') {
                    return -optionFeeAmount;
                }
                return 0;

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
            case 'credit':
                return product.currency || 'CNY';
            case 'foreign_spot':
            case 'foreign_forward':
            case 'foreign_swap':
                return product.sellCurrency || 'USD';
            case 'foreign_option':
                return 'CNY';
            default:
                return 'CNY';
        }
    }

    /**
     * 渲染页面
     */
    renderPage() {
        // 渲染产品组1
        this.renderGroup('group1', this.group1Products, this.group1CurrencyIncomes, this.group1TotalFeeAmount);
        
        // 渲染产品组2
        this.renderGroup('group2', this.group2Products, this.group2CurrencyIncomes, this.group2TotalFeeAmount);
        
        // 渲染比较结果
        this.renderComparison();
    }

    /**
     * 渲染指定组的数据
     */
    renderGroup(groupId, products, currencyIncomes, totalFeeAmount) {
        const countElement = document.getElementById(`${groupId}Count`);
        const currencyListElement = document.getElementById(`${groupId}CurrencyList`);
        const emptyStateElement = document.getElementById(`${groupId}EmptyState`);
        const cnyBreakdownElement = document.getElementById(`${groupId}CnyBreakdown`);
        const cnyTotalElement = document.getElementById(`${groupId}CnyTotalAmount`);

        // 更新产品数量
        countElement.textContent = `共 ${products.length} 个产品`;

        if (products.length === 0) {
            // 显示空状态
            currencyListElement.style.display = 'none';
            emptyStateElement.style.display = 'block';
            cnyBreakdownElement.innerHTML = '';
            cnyTotalElement.textContent = '0.00';
            return;
        }

        // 隐藏空状态
        emptyStateElement.style.display = 'none';
        currencyListElement.style.display = 'block';

        // 渲染币种收益列表
        this.renderCurrencyList(currencyListElement, currencyIncomes);

        // 计算并渲染人民币汇总
        const cnyTotal = this.calculateCnyTotal(currencyIncomes);
        this.renderCnyBreakdown(cnyBreakdownElement, currencyIncomes, cnyTotal, totalFeeAmount);
        cnyTotalElement.textContent = this.formatAmount(cnyTotal);
        cnyTotalElement.className = `cny-amount ${cnyTotal >= 0 ? 'positive' : 'negative'}`;
    }

    /**
     * 渲染币种收益列表
     */
    renderCurrencyList(container, currencyIncomes) {
        const currencies = Object.keys(currencyIncomes).sort();
        
        if (currencies.length === 0) {
            container.innerHTML = '<div class="empty-text">暂无币种收益数据</div>';
            return;
        }

        container.innerHTML = currencies.map(currency => {
            const data = currencyIncomes[currency];
            const amount = data.amount;
            const count = data.count;
            
            return `
                <div class="currency-item">
                    <div class="currency-info">
                        <div class="currency-name">${currency}</div>
                        <div class="currency-count">${count} 个产品</div>
                    </div>
                    <div class="currency-amount ${amount >= 0 ? 'positive' : 'negative'}">
                        ${this.formatAmount(amount)} ${currency}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * 计算人民币汇总
     */
    calculateCnyTotal(currencyIncomes) {
        let totalCny = 0;
        
        Object.keys(currencyIncomes).forEach(currency => {
            const amount = currencyIncomes[currency].amount;
            if (currency === 'CNY') {
                totalCny += amount;
            } else {
                // 转换为人民币
                const rate = this.getExchangeRate(currency, 'CNY');
                totalCny += amount * rate;
            }
        });
        
        return totalCny;
    }

    /**
     * 渲染人民币明细
     */
    renderCnyBreakdown(container, currencyIncomes, totalCny, totalFeeAmount = 0) {
        const currencies = Object.keys(currencyIncomes).sort();
        const breakdownItems = [];

        currencies.forEach(currency => {
            const amount = currencyIncomes[currency].amount;
            let cnyAmount = amount;
            let label = `${currency}收益`;

            if (currency !== 'CNY') {
                const rate = this.getExchangeRate(currency, 'CNY');
                cnyAmount = amount * rate;
                label = `${currency}收益 (汇率: ${rate})`;
            }

            if (Math.abs(cnyAmount) > 0.01) {
                breakdownItems.push({
                    label: label,
                    amount: cnyAmount
                });
            }
        });

        // 添加手续费汇总作为最后一个列表项
        breakdownItems.push({
            label: '手续费汇总',
            amount: totalFeeAmount
        });

        if (breakdownItems.length === 0) {
            container.innerHTML = '<div class="empty-text">暂无收益明细</div>';
            return;
        }

        container.innerHTML = breakdownItems.map(item => `
            <div class="cny-breakdown-item">
                <div class="cny-breakdown-label">${item.label}</div>
                <div class="cny-breakdown-amount ${item.amount >= 0 ? 'positive' : 'negative'}">
                    ${this.formatAmount(item.amount)} CNY
                </div>
            </div>
        `).join('');
    }

    /**
     * 渲染比较结果
     */
    renderComparison() {
        const group1CnyTotal = this.calculateCnyTotal(this.group1CurrencyIncomes);
        const group2CnyTotal = this.calculateCnyTotal(this.group2CurrencyIncomes);
        const difference = group1CnyTotal - group2CnyTotal;

        const incomeDifferenceElement = document.getElementById('incomeDifference');
        const recommendedGroupElement = document.getElementById('recommendedGroup');

        // 显示收益差异
        incomeDifferenceElement.textContent = `${this.formatAmount(Math.abs(difference))} CNY`;
        incomeDifferenceElement.className = `comparison-value ${difference > 0 ? 'positive' : difference < 0 ? 'negative' : 'neutral'}`;

        // 显示推荐方案
        if (Math.abs(difference) < 0.01) {
            recommendedGroupElement.textContent = '收益相当';
            recommendedGroupElement.className = 'comparison-value neutral';
        } else if (difference > 0) {
            recommendedGroupElement.textContent = '产品组1';
            recommendedGroupElement.className = 'comparison-value positive';
        } else {
            recommendedGroupElement.textContent = '产品组2';
            recommendedGroupElement.className = 'comparison-value positive';
        }
    }

    /**
     * 获取汇率
     */
    getExchangeRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) {
            return 1;
        }

        // 先尝试直接汇率
        if (this.defaultExchangeRates[fromCurrency] && this.defaultExchangeRates[fromCurrency][toCurrency]) {
            return this.defaultExchangeRates[fromCurrency][toCurrency];
        }

        // 通过CNY中转
        if (fromCurrency !== 'CNY' && toCurrency !== 'CNY') {
            const fromToCny = this.defaultExchangeRates[fromCurrency] && this.defaultExchangeRates[fromCurrency]['CNY'];
            const cnyToTo = this.defaultExchangeRates['CNY'] && this.defaultExchangeRates['CNY'][toCurrency];
            
            if (fromToCny && cnyToTo) {
                return fromToCny * cnyToTo;
            }
        }

        return 1; // 默认汇率
    }

    /**
     * 格式化金额
     */
    formatAmount(amount) {
        if (isNaN(amount) || amount === null || amount === undefined) {
            return '0.00';
        }
        return Number(amount).toFixed(2);
    }

    /**
     * 返回上一页
     */
    goBack() {
        window.history.back();
    }

    /**
     * 返回首页
     */
    goHome() {
        window.location.href = 'index.html';
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        alert(message); // 简单实现，可以后续优化为组件库弹层
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ProductComparePage();
});
