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
        this.inputTimers = {};

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

        // 初始化币种数据结构的方法
        const initCurrencyData = (currency) => {
            if (!currencyIncomes[currency]) {
                currencyIncomes[currency] = {
                    amount: 0,
                    count: 0,
                    products: [],
                    depositInterest: 0,      // 存款利息
                    loanInterest: 0,         // 贷款利息
                    swapEndIncome: 0,        // 掉期期末收益
                    feeAmount: 0,           // 手续费金额（只有CNY）
                    spotSellAmount: 0,      // 即期卖出金额
                    spotBuyAmount: 0,       // 即期买入金额
                    forwardSellAmount: 0,   // 远期卖出金额
                    forwardBuyAmount: 0,    // 远期买入金额
                    optionFee: 0            // 期权费（只有CNY）
                };
            }
        };

        products.forEach(product => {
            // 根据产品类型计算各项收益，外汇产品需要分别处理两种币种
            this.calculateProductIncomeByType(product, currencyIncomes, initCurrencyData);
        });

        // 计算每个币种的最终收益
        Object.keys(currencyIncomes).forEach(currency => {
            const data = currencyIncomes[currency];
            data.amount = data.depositInterest - data.loanInterest + data.swapEndIncome 
                        - data.feeAmount - data.spotSellAmount + data.spotBuyAmount 
                        - data.forwardSellAmount + data.forwardBuyAmount + data.optionFee;
        });

        if (groupId === 'group1') {
            this.group1CurrencyIncomes = currencyIncomes;
        } else {
            this.group2CurrencyIncomes = currencyIncomes;
        }
    }

    /**
     * 根据产品类型计算各项收益
     */
    calculateProductIncomeByType(product, currencyIncomes, initCurrencyData) {
        switch (product.type) {
            case 'deposit':
                const depositCurrency = product.currency || 'CNY';
                initCurrencyData(depositCurrency);
                
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
                
                currencyIncomes[depositCurrency].depositInterest += (depositAmount * depositRate * depositDays) / 36500;
                currencyIncomes[depositCurrency].count += 1;
                currencyIncomes[depositCurrency].products.push(product);
                break;

            case 'loan':
                const loanCurrency = product.currency || 'CNY';
                initCurrencyData(loanCurrency);
                
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
                
                currencyIncomes[loanCurrency].loanInterest += (loanAmount * loanRate * loanDays) / 36500;
                currencyIncomes[loanCurrency].count += 1;
                currencyIncomes[loanCurrency].products.push(product);
                
                // 贷款手续费（人民币）
                const loanFeeAmount = parseFloat(product.feeAmount) || 0;
                if (loanFeeAmount > 0) {
                    initCurrencyData('CNY');
                    currencyIncomes['CNY'].feeAmount += loanFeeAmount;
                }
                break;

            case 'credit':
                const creditCurrency = product.currency || 'CNY';
                initCurrencyData(creditCurrency);
                
                const creditFeeAmount = parseFloat(product.feeAmount) || 0;
                
                // 信用证手续费（人民币）
                if (creditFeeAmount > 0) {
                    initCurrencyData('CNY');
                    currencyIncomes['CNY'].feeAmount += creditFeeAmount;
                }
                
                currencyIncomes[creditCurrency].count += 1;
                currencyIncomes[creditCurrency].products.push(product);
                break;

            case 'foreign_spot':
                const spotSellCurrency = product.sellCurrency || 'CNY';
                const spotBuyCurrency = product.buyCurrency || 'USD';
                const spotSellAmount = parseFloat(product.sellAmount) || 0;
                const spotBuyAmount = parseFloat(product.buyAmount) || 0;
                
                // 初始化两种币种
                initCurrencyData(spotSellCurrency);
                initCurrencyData(spotBuyCurrency);
                
                // 卖出币种：减少卖出金额
                currencyIncomes[spotSellCurrency].spotSellAmount += spotSellAmount;
                currencyIncomes[spotSellCurrency].count += 1;
                currencyIncomes[spotSellCurrency].products.push(product);
                
                // 买入币种：增加买入金额
                currencyIncomes[spotBuyCurrency].spotBuyAmount += spotBuyAmount;
                break;

            case 'foreign_forward':
                const forwardSellCurrency = product.sellCurrency || 'CNY';
                const forwardBuyCurrency = product.buyCurrency || 'USD';
                const forwardSellAmount = parseFloat(product.sellAmount) || 0;
                const forwardBuyAmount = parseFloat(product.buyAmount) || 0;
                
                // 初始化两种币种
                initCurrencyData(forwardSellCurrency);
                initCurrencyData(forwardBuyCurrency);
                
                // 卖出币种：减少远期卖出金额
                currencyIncomes[forwardSellCurrency].forwardSellAmount += forwardSellAmount;
                currencyIncomes[forwardSellCurrency].count += 1;
                currencyIncomes[forwardSellCurrency].products.push(product);
                
                // 买入币种：增加远期买入金额
                currencyIncomes[forwardBuyCurrency].forwardBuyAmount += forwardBuyAmount;
                break;

            case 'foreign_swap':
                const nearSellCurrency = product.nearSellCurrency || 'CNY';
                const nearBuyCurrency = product.nearBuyCurrency || 'USD';
                const farSellCurrency = product.farSellCurrency || 'USD';
                const farBuyCurrency = product.farBuyCurrency || 'CNY';
                
                const swapEndIncome = parseFloat(product.finalIncome) || 0; // 期末收益
                
                // 初始化相关币种
                initCurrencyData(nearSellCurrency);
                initCurrencyData(nearBuyCurrency);
                initCurrencyData(farSellCurrency);
                initCurrencyData(farBuyCurrency);
                
                // 掉期产品的收益计算：
                // 期末收益已经是净收益，包含了近端和远端交易的差额
                // 不需要再分别计算近端和远端的交易金额，避免重复计算
                
                // 掉期期末收益（通常以远端卖出币种计算）
                currencyIncomes[farSellCurrency].swapEndIncome += swapEndIncome;
                
                // 产品计数：只在近端卖出币种计算
                currencyIncomes[nearSellCurrency].count += 1;
                currencyIncomes[nearSellCurrency].products.push(product);
                break;

            case 'foreign_option':
                const optionFeeAmount = parseFloat(product.optionFeeAmount) || 0;
                const optionFeeType = product.optionFeeType;
                
                // 期权费都是人民币
                initCurrencyData('CNY');
                
                if (optionFeeType === 'income') {
                    currencyIncomes['CNY'].optionFee += optionFeeAmount;
                } else if (optionFeeType === 'expense') {
                    currencyIncomes['CNY'].optionFee -= optionFeeAmount;
                }
                
                currencyIncomes['CNY'].count += 1;
                currencyIncomes['CNY'].products.push(product);
                break;

            default:
                break;
        }
    }

    /**
     * 获取产品主要币种（用于显示目的，仅作参考）
     */
    getProductCurrency(product) {
        switch (product.type) {
            case 'deposit':
            case 'loan':
            case 'credit':
                return product.currency || 'CNY';
            case 'foreign_spot':
            case 'foreign_forward':
                return product.sellCurrency || 'CNY'; // 以卖出币种为主要币种
            case 'foreign_swap':
                return product.nearSellCurrency || 'CNY'; // 掉期产品以近端卖出币种为主要币种
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
        this.renderGroup('group1', this.group1Products, this.group1CurrencyIncomes);
        
        // 渲染产品组2
        this.renderGroup('group2', this.group2Products, this.group2CurrencyIncomes);
    }

    /**
     * 渲染指定组的数据
     */
    renderGroup(groupId, products, currencyIncomes) {
        const countElement = document.getElementById(`${groupId}Count`);
        const currencyListElement = document.getElementById(`${groupId}CurrencyList`);
        const emptyStateElement = document.getElementById(`${groupId}EmptyState`);

        // 更新产品数量
        countElement.textContent = `共 ${products.length} 个产品`;

        if (products.length === 0) {
            // 显示空状态
            currencyListElement.style.display = 'none';
            emptyStateElement.style.display = 'block';
            return;
        }

        // 隐藏空状态
        emptyStateElement.style.display = 'none';
        currencyListElement.style.display = 'block';

        // 渲染币种收益列表（简化版，不包含汇率输入）
        this.renderSimpleCurrencyList(currencyListElement, currencyIncomes);
    }

    /**
     * 渲染简化版币种收益列表（不包含汇率输入）
     */
    renderSimpleCurrencyList(container, currencyIncomes) {
        // 过滤掉收益为0的币种
        const currencies = Object.keys(currencyIncomes).filter(currency => {
            const amount = currencyIncomes[currency].amount;
            return Math.abs(amount) > 0.01; // 保留两位小数精度，小于0.01视为0
        }).sort();
        
        if (currencies.length === 0) {
            container.innerHTML = '<div class="empty-text">暂无币种收益数据</div>';
            return;
        }

        container.innerHTML = currencies.map(currency => {
            const data = currencyIncomes[currency];
            const amount = data.amount;
            const currencyName = this.getCurrencyName(currency);
            
            return `
                <div class="currency-item simple-currency-item">
                    <div class="currency-info">
                        <div class="currency-name">${currencyName}</div>
                    </div>
                    <div class="currency-amount ${amount >= 0 ? 'positive' : 'negative'}">
                        ${this.formatAmount(amount)} ${currency}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * 渲染币种收益列表（原版，包含汇率输入）
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
            const isCNY = currency === 'CNY';
            
            const currencyName = this.getCurrencyName(currency);
            
            // 获取当前汇率
            let currentRate = this.exchangeRates[currency];

            const hasRate = currentRate && currentRate > 0;
            const cnyConverted = hasRate ? amount * currentRate : (isCNY ? amount : 0);
            
            if (isCNY) {
                // 人民币显示为单行
                return `
                    <div class="currency-item cny-item">
                        <div class="currency-info">
                            <div class="currency-name">${currencyName}</div>
                        </div>
                        <div class="currency-amount ${amount >= 0 ? 'positive' : 'negative'}">
                            ${this.formatAmount(amount)} ${currency}
                        </div>
                    </div>
                `;
            } else {
                // 外币显示为3个垂直排列的容器
                return `
                    <div class="currency-item foreign-currency-item ${hasRate ? 'has-rate' : 'no-rate'}" data-currency="${currency}">
                        <!-- 容器1：币种名称和金额 -->
                        <div class="currency-container">
                            <div class="currency-info">
                                <div class="currency-name">${currencyName}</div>
                            </div>
                            <div class="currency-amount ${amount >= 0 ? 'positive' : 'negative'}">
                                ${this.formatAmount(amount)} ${currency}
                            </div>
                        </div>
                        
                        <!-- 容器2：汇率输入 -->
                        <div class="rate-container">
                            <div class="rate-input-group">
                                <div class="rate-label">汇率</div>
                                <input type="number"
                                       class="rate-input"
                                       data-currency="${currency}"
                                       placeholder="请输入${currency}对CNY汇率"
                                       step="0.01"
                                       min="0.01"
                                       max="9999.99"
                                       value="">
                            </div>
                            <div class="rate-error" data-currency="${currency}" style="display: none;"></div>
                        </div>
                        
                        <!-- 容器3：兑换人民币 -->
                        <div class="conversion-container">
                            <div class="conversion-title">${currencyName}兑换人民币</div>
                            <div class="conversion-amount ${hasRate ? 'has-rate' : 'no-rate'} ${hasRate ? (cnyConverted >= 0 ? 'positive' : 'negative') : ''}">
                                ${hasRate ? this.formatAmount(cnyConverted) + ' CNY' : '请输入汇率'}
                            </div>
                        </div>
                    </div>
                `;
            }
        }).join('');
        
        // 绑定汇率输入事件
        this.bindRateInputEvents();
    }




    /**
     * 获取汇率
     */
    getExchangeRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) {
            return 1;
        }

        // 优先使用用户设置的汇率
        if (this.exchangeRates[fromCurrency] && toCurrency === 'CNY') {
            return this.exchangeRates[fromCurrency];
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
        
        // 重新计算和渲染所有数据
        this.loadAndCalculate();
    }

    /**
     * 更新汇率转换显示
     */
    updateRateConversionDisplay(currency) {
        const currencyItems = document.querySelectorAll(`[data-currency="${currency}"].currency-item`);
        currencyItems.forEach(currencyItem => {
            const rate = this.exchangeRates[currency];
            const conversionAmount = currencyItem.querySelector('.conversion-amount');
            
            if (conversionAmount) {
                if (rate && rate > 0) {
                    // 获取原币种金额
                    const amountText = currencyItem.querySelector('.currency-amount').textContent;
                    const amount = parseFloat(amountText.replace(/[^\d.-]/g, ''));
                    const cnyConverted = amount * rate;
                    
                    conversionAmount.textContent = this.formatAmount(cnyConverted) + ' CNY';
                    conversionAmount.className = `conversion-amount has-rate ${cnyConverted >= 0 ? 'positive' : 'negative'}`;
                } else {
                    conversionAmount.textContent = '请输入汇率';
                    conversionAmount.className = 'conversion-amount no-rate';
                }
            }
        });
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
        }
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
