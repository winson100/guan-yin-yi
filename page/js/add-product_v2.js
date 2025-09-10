/**
 * 存贷组合产品测算器 - 添加产品页面逻辑
 */

class AddProductPage {
    constructor() {
        this.currentProductType = '';
        
        // 汇率默认值配置 (以CNY为基准)
        this.exchangeRates = {
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
     * 初始化页面
     */
    async init() {
        try {
            // 初始化数据库
            await window.productDB.init();
            
            // 绑定事件
            this.bindEvents();
            
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

        // 取消按钮
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.goBack();
        });

        // 保存并返回按钮
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.handleSubmit();
        });

        // 产品种类选择
        document.getElementById('productType').addEventListener('click', () => {
            this.showProductTypeOptions();
        });

        // 产品名称选择 - 动态绑定事件
        const productNameField = document.getElementById('productName');
        
        // 禁用自动完成功能
        productNameField.setAttribute('autocomplete', 'off');
        productNameField.setAttribute('autocorrect', 'off');
        productNameField.setAttribute('autocapitalize', 'off');
        productNameField.setAttribute('spellcheck', 'false');
        
        productNameField.addEventListener('click', () => {
            // 只有衍生品类型才显示弹窗
            if (this.currentProductType === 'derivative') {
                this.showProductNameOptions();
            }
        });

        // 币种选择
        const currencyFields = [
            'depositCurrency', 'loanCurrency', 'creditCurrency',
            'sellCurrency', 'buyCurrency', 'nearSellCurrency', 'nearBuyCurrency',
            'farSellCurrency', 'farBuyCurrency'
        ];
        currencyFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('click', () => {
                    this.showCurrencyOptions(fieldId);
                });
            }
        });


        // 期限单位选择
        const periodUnitFields = ['depositPeriodUnit', 'loanPeriodUnit', 'creditPeriodUnit'];
        periodUnitFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('click', () => {
                    this.showPeriodUnitOptions(fieldId);
                });
            }
        });

        // 表单提交
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // 存款产品字段变化监听
        this.bindDepositFields();
        
        // 贷款产品字段变化监听
        this.bindLoanFields();
        
        // 外汇产品字段变化监听
        this.bindForeignFields();
    }

    /**
     * 绑定存款产品字段事件
     */
    bindDepositFields() {
        const fields = ['depositAmount', 'depositRate', 'depositPeriod', 'depositPeriodUnit'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.calculateDeposit();
                });
            }
        });
    }

    /**
     * 绑定贷款产品字段事件
     */
    bindLoanFields() {
        const fields = ['loanAmount', 'loanRate', 'loanPeriod', 'loanPeriodUnit'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.calculateLoan();
                });
            }
        });
    }

    /**
     * 绑定外汇产品字段事件
     */
    bindForeignFields() {
        // 即期/远期字段
        const spotForwardFields = ['sellAmount', 'exchangeRate'];
        spotForwardFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.calculateSpotForward();
                });
            }
        });



        // 掉期字段
        const swapFields = ['nearSellAmount', 'nearRate', 'farRate'];
        swapFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.calculateSwap();
                });
            }
        });


    }

    /**
     * 产品种类变化处理
     */
    onProductTypeChange(type) {
        this.currentProductType = type;

        // 隐藏所有表单
        this.hideAllForms();

        // 清除错误提示
        this.clearAllErrors();

        // 更新产品名称显示
        this.updateProductNameDisplay(type);

        if (type === 'deposit') {
            document.getElementById('depositForm').style.display = 'block';
        } else if (type === 'loan') {
            document.getElementById('loanForm').style.display = 'block';
        } else if (type === 'credit') {
            document.getElementById('creditForm').style.display = 'block';
        } else if (type === 'spot') {
            document.getElementById('foreignForm').style.display = 'block';
            document.getElementById('spotForwardForm').style.display = 'block';
            this.updateExchangeRatePlaceholder();
        } else if (type === 'derivative') {
            document.getElementById('foreignForm').style.display = 'block';
        }
    }


    /**
     * 更新产品名称显示
     */
    updateProductNameDisplay(type) {
        const productNameContainer = document.getElementById('productNameContainer');
        const productNameInput = document.getElementById('productName');
        const productNameArrow = document.getElementById('productNameArrow');
        const productNameLabel = document.getElementById('productNameLabel');

        if (type === 'credit' || type === 'spot') {
            // 信用证和即期：隐藏产品名称
            productNameContainer.style.display = 'none';
        } else if (type === 'derivative') {
            // 衍生：显示为下拉框
            productNameContainer.style.display = 'block';
            productNameInput.placeholder = '请选择产品名称';
            productNameInput.readOnly = true;
            productNameArrow.style.display = 'block';
            productNameLabel.textContent = '产品名称';
        } else {
            // 存款和贷款：手工输入
            productNameContainer.style.display = 'block';
            productNameInput.placeholder = '请输入产品名称';
            productNameInput.readOnly = false;
            productNameArrow.style.display = 'none';
            productNameLabel.textContent = '产品名称';
        }

        // 清除产品名称值
        productNameInput.value = '';
        productNameInput.dataset.value = '';
    }

    /**
     * 隐藏所有表单
     */
    hideAllForms() {
        document.getElementById('depositForm').style.display = 'none';
        document.getElementById('loanForm').style.display = 'none';
        document.getElementById('creditForm').style.display = 'none';
        document.getElementById('foreignForm').style.display = 'none';
    }

    /**
     * 计算存款产品
     */
    calculateDeposit() {
        const amount = parseFloat(document.getElementById('depositAmount').value) || 0;
        const rate = parseFloat(document.getElementById('depositRate').value) || 0;
        const period = parseInt(document.getElementById('depositPeriod').value) || 0;
        const periodUnitField = document.getElementById('depositPeriodUnit');
        const periodUnit = periodUnitField.dataset.value || 'year';

        if (amount > 0 && rate > 0 && period > 0) {
            // 根据期限单位调整计算
            let adjustedPeriod = period;
            if (periodUnit === 'month') {
                adjustedPeriod = period / 12; // 转换为年
            } else if (periodUnit === 'day') {
                adjustedPeriod = period / 365; // 转换为年
            }
            
            const interest = (amount * rate * adjustedPeriod) / 100;
            const principal = amount + interest;

            document.getElementById('depositInterest').value = this.formatAmount(interest);
            document.getElementById('depositPrincipal').value = this.formatAmount(principal);
        } else {
            document.getElementById('depositInterest').value = '';
            document.getElementById('depositPrincipal').value = '';
        }
    }

    /**
     * 计算贷款产品
     */
    calculateLoan() {
        const amount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const rate = parseFloat(document.getElementById('loanRate').value) || 0;
        const period = parseInt(document.getElementById('loanPeriod').value) || 0;
        const periodUnitField = document.getElementById('loanPeriodUnit');
        const periodUnit = periodUnitField.dataset.value || 'year';

        if (amount > 0 && rate > 0 && period > 0) {
            // 根据期限单位调整计算
            let adjustedPeriod = period;
            if (periodUnit === 'month') {
                adjustedPeriod = period / 12; // 转换为年
            } else if (periodUnit === 'day') {
                adjustedPeriod = period / 365; // 转换为年
            }
            
            const interest = (amount * rate * adjustedPeriod) / 100;
            const principal = amount + interest;

            document.getElementById('loanInterest').value = this.formatAmount(interest);
            document.getElementById('loanPrincipal').value = this.formatAmount(principal);
        } else {
            document.getElementById('loanInterest').value = '';
            document.getElementById('loanPrincipal').value = '';
        }
    }

    /**
     * 计算即期/远期产品
     */
    calculateSpotForward() {
        const sellAmount = parseFloat(document.getElementById('sellAmount').value) || 0;
        const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 0;

        if (sellAmount > 0 && exchangeRate > 0) {
            const buyAmount = sellAmount * exchangeRate;
            document.getElementById('buyAmount').value = this.formatAmount(buyAmount);
        } else {
            document.getElementById('buyAmount').value = '';
        }
    }

    /**
     * 获取汇率默认值
     */
    getExchangeRate(sellCurrency, buyCurrency) {
        if (!sellCurrency || !buyCurrency || sellCurrency === buyCurrency) {
            return null;
        }
        
        // 直接查找汇率
        if (this.exchangeRates[sellCurrency] && this.exchangeRates[sellCurrency][buyCurrency]) {
            return this.exchangeRates[sellCurrency][buyCurrency];
        }
        
        // 如果直接查找不到，尝试反向查找并计算倒数
        if (this.exchangeRates[buyCurrency] && this.exchangeRates[buyCurrency][sellCurrency]) {
            return 1 / this.exchangeRates[buyCurrency][sellCurrency];
        }
        
        return null;
    }

    /**
     * 更新即期/远期汇率提示和默认值
     */
    updateExchangeRatePlaceholder() {
        const sellCurrencyField = document.getElementById('sellCurrency');
        const buyCurrencyField = document.getElementById('buyCurrency');
        const sellCurrency = sellCurrencyField.dataset.value || '';
        const buyCurrency = buyCurrencyField.dataset.value || '';
        const exchangeRateField = document.getElementById('exchangeRate');
        
        if (sellCurrency && buyCurrency) {
            const placeholder = `请输入${sellCurrency}兑${buyCurrency}汇率`;
            exchangeRateField.placeholder = placeholder;
            
            // 如果汇率字段为空，自动填充默认汇率
            if (!exchangeRateField.value) {
                const defaultRate = this.getExchangeRate(sellCurrency, buyCurrency);
                if (defaultRate !== null) {
                    exchangeRateField.value = defaultRate.toFixed(4);
                }
            }
        } else {
            exchangeRateField.placeholder = '请输入汇率';
        }
    }

    /**
     * 更新掉期汇率提示和默认值
     */
    updateSwapRatePlaceholders() {
        const nearSellCurrencyField = document.getElementById('nearSellCurrency');
        const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
        const farSellCurrencyField = document.getElementById('farSellCurrency');
        const farBuyCurrencyField = document.getElementById('farBuyCurrency');
        
        const nearSellCurrency = nearSellCurrencyField.dataset.value || '';
        const nearBuyCurrency = nearBuyCurrencyField.dataset.value || '';
        
        const nearRateField = document.getElementById('nearRate');
        const farRateField = document.getElementById('farRate');
        
        // 近端汇率提示：近端卖出币种兑近端买入币种
        if (nearSellCurrency && nearBuyCurrency) {
            const nearPlaceholder = `请输入${nearSellCurrency}兑${nearBuyCurrency}汇率`;
            nearRateField.placeholder = nearPlaceholder;
            
            // 如果近端汇率字段为空，自动填充默认汇率
            if (!nearRateField.value) {
                const defaultRate = this.getExchangeRate(nearSellCurrency, nearBuyCurrency);
                if (defaultRate !== null) {
                    nearRateField.value = defaultRate.toFixed(4);
                }
            }
        } else {
            nearRateField.placeholder = '请输入近端汇率';
        }
        
        // 远端汇率提示：远端卖出币种兑远端买入币种
        // 根据掉期币种关联关系：远端卖出币种 = 近端买入币种，远端买入币种 = 近端卖出币种
        if (nearBuyCurrency && nearSellCurrency) {
            const farPlaceholder = `请输入${nearBuyCurrency}兑${nearSellCurrency}汇率`;
            farRateField.placeholder = farPlaceholder;
            
            // 如果远端汇率字段为空，自动填充默认汇率
            if (!farRateField.value) {
                const defaultRate = this.getExchangeRate(nearBuyCurrency, nearSellCurrency);
                if (defaultRate !== null) {
                    farRateField.value = defaultRate.toFixed(4);
                }
            }
        } else {
            farRateField.placeholder = '请输入远端汇率';
        }
    }

    /**
     * 根据字段ID更新相应的汇率提示
     */
    updateExchangeRatePlaceholders(fieldId) {
        // 即期/远期汇率字段
        if (fieldId === 'sellCurrency' || fieldId === 'buyCurrency') {
            this.updateExchangeRatePlaceholder();
        }
        // 掉期汇率字段
        else if (['nearSellCurrency', 'nearBuyCurrency', 'farSellCurrency', 'farBuyCurrency'].includes(fieldId)) {
            this.updateSwapRatePlaceholders();
            // 对于掉期币种字段，还需要更新币种关联
            if (['nearSellCurrency', 'nearBuyCurrency'].includes(fieldId)) {
                this.updateSwapCurrencyFields();
            }
        }
    }

    /**
     * 更新掉期币种字段关联
     */
    updateSwapCurrencyFields() {
        const nearSellCurrencyField = document.getElementById('nearSellCurrency');
        const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
        const farSellCurrencyField = document.getElementById('farSellCurrency');
        const farBuyCurrencyField = document.getElementById('farBuyCurrency');
        
        const nearSellCurrency = nearSellCurrencyField.dataset.value || '';
        const nearBuyCurrency = nearBuyCurrencyField.dataset.value || '';
        const nearSellCurrencyText = nearSellCurrencyField.value || '';
        const nearBuyCurrencyText = nearBuyCurrencyField.value || '';
        
        // 当选择近端卖出币种时，自动设置为远端买入币种
        if (nearSellCurrency && nearSellCurrencyText) {
            farBuyCurrencyField.value = nearSellCurrencyText;
            farBuyCurrencyField.dataset.value = nearSellCurrency;
        }
        
        // 当选择近端买入币种时，自动设置为远端卖出币种
        if (nearBuyCurrency && nearBuyCurrencyText) {
            farSellCurrencyField.value = nearBuyCurrencyText;
            farSellCurrencyField.dataset.value = nearBuyCurrency;
        }
        
        // 更新远端汇率提示和默认值
        this.updateSwapRatePlaceholders();
        
        // 更新期末收益币种显示
        this.updateFinalIncomeCurrency();
    }

    /**
     * 计算掉期产品
     */
    calculateSwap() {
        const nearSellAmount = parseFloat(document.getElementById('nearSellAmount').value) || 0;
        const nearRate = parseFloat(document.getElementById('nearRate').value) || 0;
        const farRate = parseFloat(document.getElementById('farRate').value) || 0;

        // 计算近端买入金额（近端卖出金额 × 近端汇率）
        if (nearSellAmount > 0 && nearRate > 0) {
            const nearBuyAmount = nearSellAmount * nearRate;
            document.getElementById('nearBuyAmount').value = this.formatAmount(nearBuyAmount);
        } else {
            document.getElementById('nearBuyAmount').value = '';
        }

        // 计算远端相关金额
        if (nearSellAmount > 0 && nearRate > 0 && farRate > 0) {
            const nearBuyAmount = nearSellAmount * nearRate; // 近端买入金额
            
            // 新的远端金额计算逻辑
            const farBuyAmount = nearSellAmount; // 远端买入金额 = 近端卖出金额
            const farSellAmount = farBuyAmount / farRate; // 远端卖出金额 = 远端买入金额 ÷ 远端汇率
            
            document.getElementById('farSellAmount').value = this.formatAmount(farSellAmount);
            document.getElementById('farBuyAmount').value = this.formatAmount(farBuyAmount);
            
            // 期末收益计算公式：近端买入金额 - 近端卖出金额 × (1/远端汇率)
            // 收益币种按照近端买入币种
            const finalIncome = nearBuyAmount - (nearSellAmount / farRate);
            document.getElementById('finalIncome').value = this.formatAmount(finalIncome);
        } else {
            document.getElementById('farSellAmount').value = '';
            document.getElementById('farBuyAmount').value = '';
            document.getElementById('finalIncome').value = '';
        }
        
        // 更新期末收益币种显示
        this.updateFinalIncomeCurrency();
    }

    /**
     * 处理表单提交
     */
    async handleSubmit() {
        try {
            // 清除所有错误
            this.clearAllErrors();

            // 验证表单
            const validationResult = this.validateForm();
            if (!validationResult.isValid) {
                this.showValidationErrors(validationResult.errors);
                return;
            }

            // 收集表单数据
            const productData = this.collectFormData();
            if (!productData) {
                return;
            }

            // 保存产品
            await this.saveProduct(productData);

            // 显示成功消息
            this.showSuccess('产品添加成功');

            // 返回主页面
            setTimeout(() => {
                this.goBack();
            }, 1500);

        } catch (error) {
            console.error('保存产品失败:', error);
            this.showError('保存产品失败，请重试');
        }
    }

    /**
     * 验证表单
     */
    validateForm() {
        const errors = [];
        const result = { isValid: true, errors: [] };

        // 验证产品种类
        const productTypeField = document.getElementById('productType');
        const productType = productTypeField.dataset.value || productTypeField.value;
        if (!productType) {
            errors.push({ field: 'productType', message: '请选择产品种类' });
        }

        // 根据产品类型验证产品名称
        if (productType === 'deposit' || productType === 'loan') {
            const productName = document.getElementById('productName').value.trim();
            if (!productName) {
                errors.push({ field: 'productName', message: '请输入产品名称' });
            } else if (productName.length > 50) {
                errors.push({ field: 'productName', message: '产品名称长度不能超过50个字符' });
            }
        } else if (productType === 'derivative') {
            const productName = document.getElementById('productName').dataset.value;
            if (!productName) {
                errors.push({ field: 'productName', message: '请选择产品名称' });
            }
        }
        // 信用证和即期不需要验证产品名称

        // 根据产品类型验证特定字段
        if (productType === 'deposit' || productType === 'loan') {
            this.validateDepositLoanFields(errors, productType);
        } else if (productType === 'credit') {
            this.validateCreditFields(errors);
        } else if (productType === 'spot' || productType === 'derivative') {
            this.validateForeignFields(errors, productType);
        }

        result.errors = errors;
        result.isValid = errors.length === 0;
        return result;
    }

    /**
     * 验证存款/贷款字段
     */
    validateDepositLoanFields(errors, type) {
        const prefix = type === 'deposit' ? 'deposit' : 'loan';

        // 验证币种
        const currencyField = document.getElementById(`${prefix}Currency`);
        const currency = currencyField.dataset.value || currencyField.value;
        if (!currency) {
            errors.push({ field: `${prefix}Currency`, message: '请选择币种' });
        }

        // 验证金额
        const amount = parseFloat(document.getElementById(`${prefix}Amount`).value);
        if (!amount || amount <= 0) {
            errors.push({ field: `${prefix}Amount`, message: '金额需为正数且保留2位小数' });
        } else if (amount > 999999999.99) {
            errors.push({ field: `${prefix}Amount`, message: '金额不能超过999,999,999.99' });
        }

        // 验证利率
        const rate = parseFloat(document.getElementById(`${prefix}Rate`).value);
        if (!rate || rate <= 0) {
            errors.push({ field: `${prefix}Rate`, message: '利率需为0.01%-99.99%' });
        } else if (rate > 99.99) {
            errors.push({ field: `${prefix}Rate`, message: '利率不能超过99.99%' });
        }

        // 验证期限单位
        const periodUnitField = document.getElementById(`${prefix}PeriodUnit`);
        const periodUnit = periodUnitField.dataset.value || periodUnitField.value;
        if (!periodUnit) {
            errors.push({ field: `${prefix}PeriodUnit`, message: '请选择期限单位' });
        }

        // 验证期限
        const period = parseInt(document.getElementById(`${prefix}Period`).value);
        if (!period || period <= 0) {
            errors.push({ field: `${prefix}Period`, message: '期限需为正整数' });
        } else if (periodUnit) {
            // 根据期限单位设置不同的最大值
            let maxPeriod = 1825; // 默认最大天数
            let errorMessage = '期限不能超过1825天';
            
            if (periodUnit === 'year') {
                maxPeriod = 5; // 最大5年
                errorMessage = '期限不能超过5年';
            } else if (periodUnit === 'month') {
                maxPeriod = 60; // 最大60个月
                errorMessage = '期限不能超过60个月';
            } else if (periodUnit === 'day') {
                maxPeriod = 1825; // 最大1825天
                errorMessage = '期限不能超过1825天';
            }
            
            if (period > maxPeriod) {
                errors.push({ field: `${prefix}Period`, message: errorMessage });
            }
        }

        // 验证手续费金额（仅对贷款产品）
        if (prefix === 'loan') {
            const feeAmount = parseFloat(document.getElementById(`${prefix}FeeAmount`).value);
            if (feeAmount && feeAmount > 0) {
                if (feeAmount > 999999999.99) {
                    errors.push({ field: `${prefix}FeeAmount`, message: '手续费金额不能超过999,999,999.99' });
                }
            }
        }

    }

    /**
     * 验证信用证字段
     */
    validateCreditFields(errors) {
        // 验证币种
        const currencyField = document.getElementById('creditCurrency');
        const currency = currencyField.dataset.value || currencyField.value;
        if (!currency) {
            errors.push({ field: 'creditCurrency', message: '请选择币种' });
        }

        // 验证金额
        const amount = parseFloat(document.getElementById('creditAmount').value);
        if (!amount || amount <= 0) {
            errors.push({ field: 'creditAmount', message: '金额需为正数且保留2位小数' });
        } else if (amount > 999999999.99) {
            errors.push({ field: 'creditAmount', message: '金额不能超过999,999,999.99' });
        }

        // 验证期限单位
        const periodUnitField = document.getElementById('creditPeriodUnit');
        const periodUnit = periodUnitField.dataset.value || periodUnitField.value;
        if (!periodUnit) {
            errors.push({ field: 'creditPeriodUnit', message: '请选择期限单位' });
        }

        // 验证期限
        const period = parseInt(document.getElementById('creditPeriod').value);
        if (!period || period <= 0) {
            errors.push({ field: 'creditPeriod', message: '期限需为正整数' });
        } else if (periodUnit) {
            // 根据期限单位设置不同的最大值
            let maxPeriod = 1825; // 默认最大天数
            let errorMessage = '期限不能超过1825天';

            if (periodUnit === 'year') {
                maxPeriod = 5; // 最大5年
                errorMessage = '期限不能超过5年';
            } else if (periodUnit === 'month') {
                maxPeriod = 60; // 最大60个月
                errorMessage = '期限不能超过60个月';
            } else if (periodUnit === 'day') {
                maxPeriod = 1825; // 最大1825天
                errorMessage = '期限不能超过1825天';
            }

            if (period > maxPeriod) {
                errors.push({ field: 'creditPeriod', message: errorMessage });
            }
        }

        // 验证手续费金额
        const feeAmount = parseFloat(document.getElementById('creditFeeAmount').value);
        if (!feeAmount || feeAmount <= 0) {
            errors.push({ field: 'creditFeeAmount', message: '手续费金额需为正数且保留2位小数' });
        } else if (feeAmount > 999999999.99) {
            errors.push({ field: 'creditFeeAmount', message: '手续费金额不能超过999,999,999.99' });
        }
    }

    /**
     * 验证外汇字段
     */
    validateForeignFields(errors, productType) {
        if (productType === 'spot') {
            // 即期交易验证
            this.validateSpotForwardFields(errors);
        } else if (productType === 'derivative') {
            // 衍生产品验证
            const productName = document.getElementById('productName').dataset.value;
            if (productName === 'forward') {
                this.validateSpotForwardFields(errors);
            } else if (productName === 'swap') {
                this.validateSwapFields(errors);
            }
        }
    }

    /**
     * 验证即期/远期字段
     */
    validateSpotForwardFields(errors) {
        // 验证卖出币种
        const sellCurrencyField = document.getElementById('sellCurrency');
        const sellCurrency = sellCurrencyField.dataset.value || sellCurrencyField.value;
        if (!sellCurrency) {
            errors.push({ field: 'sellCurrency', message: '请选择卖出币种' });
        }

        // 验证买入币种
        const buyCurrencyField = document.getElementById('buyCurrency');
        const buyCurrency = buyCurrencyField.dataset.value || buyCurrencyField.value;
        if (!buyCurrency) {
            errors.push({ field: 'buyCurrency', message: '请选择买入币种' });
        }

        // 验证卖出金额
        const sellAmount = parseFloat(document.getElementById('sellAmount').value);
        if (!sellAmount || sellAmount <= 0) {
            errors.push({ field: 'sellAmount', message: '卖出金额需为正数且保留2位小数' });
        } else if (sellAmount > 999999999.99) {
            errors.push({ field: 'sellAmount', message: '卖出金额不能超过999,999,999.99' });
        }

        // 验证汇率
        const exchangeRate = parseFloat(document.getElementById('exchangeRate').value);
        if (!exchangeRate || exchangeRate <= 0) {
            errors.push({ field: 'exchangeRate', message: '汇率需为正数' });
        } else if (exchangeRate > 9999.99) {
            errors.push({ field: 'exchangeRate', message: '汇率不能超过9999.99' });
        }
    }

    /**
     * 验证掉期字段
     */
    validateSwapFields(errors) {
        // 验证近端字段
        const nearSellCurrencyField = document.getElementById('nearSellCurrency');
        const nearSellCurrency = nearSellCurrencyField.dataset.value || nearSellCurrencyField.value;
        if (!nearSellCurrency) {
            errors.push({ field: 'nearSellCurrency', message: '请选择近端卖出币种' });
        }

        const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
        const nearBuyCurrency = nearBuyCurrencyField.dataset.value || nearBuyCurrencyField.value;
        if (!nearBuyCurrency) {
            errors.push({ field: 'nearBuyCurrency', message: '请选择近端买入币种' });
        }

        const nearSellAmount = parseFloat(document.getElementById('nearSellAmount').value);
        if (!nearSellAmount || nearSellAmount <= 0) {
            errors.push({ field: 'nearSellAmount', message: '近端卖出金额需为正数且保留2位小数' });
        } else if (nearSellAmount > 999999999.99) {
            errors.push({ field: 'nearSellAmount', message: '近端卖出金额不能超过999,999,999.99' });
        }

        const nearRate = parseFloat(document.getElementById('nearRate').value);
        if (!nearRate || nearRate <= 0) {
            errors.push({ field: 'nearRate', message: '近端汇率需为正数' });
        } else if (nearRate > 9999.99) {
            errors.push({ field: 'nearRate', message: '近端汇率不能超过9999.99' });
        }

        // 验证远端字段
        const farSellCurrencyField = document.getElementById('farSellCurrency');
        const farSellCurrency = farSellCurrencyField.dataset.value || farSellCurrencyField.value;
        if (!farSellCurrency) {
            errors.push({ field: 'farSellCurrency', message: '请选择远端卖出币种' });
        }

        const farBuyCurrencyField = document.getElementById('farBuyCurrency');
        const farBuyCurrency = farBuyCurrencyField.dataset.value || farBuyCurrencyField.value;
        if (!farBuyCurrency) {
            errors.push({ field: 'farBuyCurrency', message: '请选择远端买入币种' });
        }

        const farRate = parseFloat(document.getElementById('farRate').value);
        if (!farRate || farRate <= 0) {
            errors.push({ field: 'farRate', message: '远端汇率需为正数' });
        } else if (farRate > 9999.99) {
            errors.push({ field: 'farRate', message: '远端汇率不能超过9999.99' });
        }

        // 验证掉期一致性
        if (nearBuyCurrency && farSellCurrency && nearBuyCurrency !== farSellCurrency) {
            errors.push({ field: 'farSellCurrency', message: '近端买入币种与远端卖出币种必须一致' });
        }
    }

    /**
     * 显示验证错误
     */
    showValidationErrors(errors) {
        errors.forEach(error => {
            const errorElement = document.getElementById(`${error.field}Error`);
            if (errorElement) {
                errorElement.textContent = error.message;
                errorElement.style.display = 'block';
                
                const fieldElement = document.getElementById(error.field);
                if (fieldElement) {
                    fieldElement.classList.add('error');
                }
            }
        });
    }

    /**
     * 清除所有错误
     */
    clearAllErrors() {
        const errorElements = document.querySelectorAll('.input-error');
        errorElements.forEach(element => {
            element.style.display = 'none';
            element.textContent = '';
        });

        const fieldElements = document.querySelectorAll('.form-input-field, .form-select');
        fieldElements.forEach(element => {
            element.classList.remove('error');
        });
    }

    /**
     * 收集表单数据
     */
    collectFormData() {
        const productTypeField = document.getElementById('productType');
        const productType = productTypeField.dataset.value || productTypeField.value;

        // 根据产品类型处理产品名称
        let productName = '';
        if (productType === 'deposit' || productType === 'loan') {
            productName = document.getElementById('productName').value.trim();
        } else if (productType === 'derivative') {
            productName = document.getElementById('productName').dataset.value || '';
        }
        // 信用证和即期不需要产品名称

        const baseData = {
            type: productType,
            name: productName
        };

        if (productType === 'deposit' || productType === 'loan') {
            return this.collectDepositLoanData(baseData, productType);
        } else if (productType === 'credit') {
            return this.collectCreditData(baseData);
        } else if (productType === 'spot' || productType === 'derivative') {
            return this.collectForeignData(baseData, productType);
        }

        return null;
    }

    /**
     * 收集存款/贷款数据
     */
    collectDepositLoanData(baseData, type) {
        const prefix = type === 'deposit' ? 'deposit' : 'loan';
        
        const currencyField = document.getElementById(`${prefix}Currency`);
        const currency = currencyField.dataset.value || currencyField.value;
        
        const periodUnitField = document.getElementById(`${prefix}PeriodUnit`);
        const periodUnit = periodUnitField.dataset.value || periodUnitField.value;

        const data = {
            ...baseData,
            currency: currency,
            amount: parseFloat(document.getElementById(`${prefix}Amount`).value),
            rate: parseFloat(document.getElementById(`${prefix}Rate`).value),
            period: parseInt(document.getElementById(`${prefix}Period`).value),
            periodUnit: periodUnit,
            interest: parseFloat(document.getElementById(`${prefix}Interest`).value) || 0,
            principal: parseFloat(document.getElementById(`${prefix}Principal`).value) || 0
        };

        // 收集手续费金额（仅对贷款产品）
        if (prefix === 'loan') {
            data.feeAmount = parseFloat(document.getElementById(`${prefix}FeeAmount`).value) || null;
        }

        return data;
    }

    /**
     * 收集信用证数据
     */
    collectCreditData(baseData) {
        const currencyField = document.getElementById('creditCurrency');
        const currency = currencyField.dataset.value || currencyField.value;

        const periodUnitField = document.getElementById('creditPeriodUnit');
        const periodUnit = periodUnitField.dataset.value || periodUnitField.value;

        const data = {
            ...baseData,
            currency: currency,
            amount: parseFloat(document.getElementById('creditAmount').value),
            period: parseInt(document.getElementById('creditPeriod').value),
            periodUnit: periodUnit,
            feeAmount: parseFloat(document.getElementById('creditFeeAmount').value)
        };

        return data;
    }

    /**
     * 收集外汇数据
     */
    collectForeignData(baseData, productType) {
        let foreignType = '';
        if (productType === 'spot') {
            foreignType = 'foreign_spot';
        } else if (productType === 'derivative') {
            const productName = document.getElementById('productName').dataset.value;
            if (productName === 'forward') {
                foreignType = 'foreign_forward';
            } else if (productName === 'swap') {
                foreignType = 'foreign_swap';
            }
        }

        const data = {
            ...baseData,
            type: foreignType
        };

        if (foreignType === 'foreign_spot' || foreignType === 'foreign_forward') {
            const sellCurrencyField = document.getElementById('sellCurrency');
            const sellCurrency = sellCurrencyField.dataset.value || sellCurrencyField.value;
            const buyCurrencyField = document.getElementById('buyCurrency');
            const buyCurrency = buyCurrencyField.dataset.value || buyCurrencyField.value;
            
            Object.assign(data, {
                sellCurrency: sellCurrency,
                buyCurrency: buyCurrency,
                sellAmount: parseFloat(document.getElementById('sellAmount').value),
                exchangeRate: parseFloat(document.getElementById('exchangeRate').value),
                buyAmount: parseFloat(document.getElementById('buyAmount').value) || 0
            });
        } else if (foreignType === 'foreign_swap') {
            const nearSellCurrencyField = document.getElementById('nearSellCurrency');
            const nearSellCurrency = nearSellCurrencyField.dataset.value || nearSellCurrencyField.value;
            const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
            const nearBuyCurrency = nearBuyCurrencyField.dataset.value || nearBuyCurrencyField.value;
            const farSellCurrencyField = document.getElementById('farSellCurrency');
            const farSellCurrency = farSellCurrencyField.dataset.value || farSellCurrencyField.value;
            const farBuyCurrencyField = document.getElementById('farBuyCurrency');
            const farBuyCurrency = farBuyCurrencyField.dataset.value || farBuyCurrencyField.value;
            
            Object.assign(data, {
                nearSellCurrency: nearSellCurrency,
                nearBuyCurrency: nearBuyCurrency,
                nearSellAmount: parseFloat(document.getElementById('nearSellAmount').value),
                nearRate: parseFloat(document.getElementById('nearRate').value),
                nearBuyAmount: parseFloat(document.getElementById('nearBuyAmount').value) || 0,
                farSellCurrency: farSellCurrency,
                farBuyCurrency: farBuyCurrency,
                farBuyAmount: parseFloat(document.getElementById('farBuyAmount').value) || 0,
                farRate: parseFloat(document.getElementById('farRate').value),
                farSellAmount: parseFloat(document.getElementById('farSellAmount').value) || 0,
                finalIncome: parseFloat(document.getElementById('finalIncome').value) || 0
            });
        }


        return data;
    }

    /**
     * 保存产品
     */
    async saveProduct(productData) {
        await window.productDB.addProduct(productData);
    }

    /**
     * 格式化金额
     */
    formatAmount(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return '';
        }
        return parseFloat(amount).toFixed(2);
    }

    /**
     * 跳转到首页
     */
    async goHome() {
        try {
            // 清理 IndexedDB 中的所有产品数据
            await window.productDB.clearAllProducts();
            console.log('所有产品数据已清理');
        } catch (error) {
            console.error('清理数据失败:', error);
        }
        
        // 跳转到首页
        window.location.href = 'index.html';
    }

    /**
     * 返回上一页
     */
    goBack() {
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
     * 显示产品种类选项列表
     */
    showProductTypeOptions() {
        const mask = document.getElementById('productTypeMask');
        mask.style.display = 'flex';

        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmProductTypeSelection();
        };

        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 移除其他选中状态
                options.forEach(o => {
                    o.querySelector('.selected-icon').classList.add('not-selected');
                });
                // 添加当前选中状态
                option.querySelector('.selected-icon').classList.remove('not-selected');
            };
        });

        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 显示产品名称选项列表
     */
    showProductNameOptions() {
        const mask = document.getElementById('productNameMask');
        mask.style.display = 'flex';

        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmProductNameSelection();
        };

        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 移除其他选中状态
                options.forEach(o => {
                    o.querySelector('.selected-icon').classList.add('not-selected');
                });
                // 添加当前选中状态
                option.querySelector('.selected-icon').classList.remove('not-selected');
            };
        });

        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 确认产品种类选择
     */
    confirmProductTypeSelection() {
        const mask = document.getElementById('productTypeMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');

        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;

            // 更新输入框显示和存储实际值
            const inputField = document.getElementById('productType');
            inputField.value = text;
            inputField.dataset.value = value;

            // 处理产品种类变化
            this.onProductTypeChange(value);
        }

        // 隐藏弹窗
        mask.style.display = 'none';
    }

    /**
     * 确认产品名称选择
     */
    confirmProductNameSelection() {
        const mask = document.getElementById('productNameMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');

        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;

            // 更新输入框显示和存储实际值
            const inputField = document.getElementById('productName');
            inputField.value = text;
            inputField.dataset.value = value;

            // 处理衍生产品子类型变化
            this.onDerivativeTypeChange(value);
        }

        // 隐藏弹窗
        mask.style.display = 'none';
    }

    /**
     * 衍生产品子类型变化处理
     */
    onDerivativeTypeChange(type) {
        // 隐藏外汇子表单
        document.getElementById('spotForwardForm').style.display = 'none';
        document.getElementById('swapForm').style.display = 'none';

        if (type === 'forward') {
            document.getElementById('spotForwardForm').style.display = 'block';
            // 更新远期汇率提示
            this.updateExchangeRatePlaceholder();
        } else if (type === 'swap') {
            document.getElementById('swapForm').style.display = 'block';
            // 更新掉期汇率提示和币种关联
            this.updateSwapRatePlaceholders();
            this.updateSwapCurrencyFields();
        }
    }

    /**
     * 显示币种选项列表
     */
    showCurrencyOptions(fieldId) {
        const mask = document.getElementById('currencyMask');
        mask.style.display = 'flex';
        
        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmCurrencySelection(fieldId);
        };
        
        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 移除其他选中状态
                options.forEach(o => {
                    o.querySelector('.selected-icon').classList.add('not-selected');
                });
                // 添加当前选中状态
                option.querySelector('.selected-icon').classList.remove('not-selected');
            };
        });
        
        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 确认币种选择
     */
    confirmCurrencySelection(fieldId) {
        const mask = document.getElementById('currencyMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');
        
        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;
            
            // 更新输入框显示和存储实际值
            const inputField = document.getElementById(fieldId);
            inputField.value = text;
            inputField.dataset.value = value;
            
            // 根据更新的币种更新汇率提示
            this.updateExchangeRatePlaceholders(fieldId);
        }
        
        // 隐藏弹窗
        mask.style.display = 'none';
    }


    /**
     * 更新期末收益币种显示
     */
    updateFinalIncomeCurrency() {
        const currencyLabel = document.getElementById('finalIncomeCurrency');
        if (!currencyLabel) return;
        
        // 掉期产品：期末收益按照近端买入币种计算
        if (this.currentProductType === 'derivative') {
            const productName = document.getElementById('productName').dataset.value;
            if (productName === 'swap') {
                const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
                const nearBuyCurrency = nearBuyCurrencyField.dataset.value || '';
                if (nearBuyCurrency) {
                    currencyLabel.textContent = `(${nearBuyCurrency})`;
                } else {
                    currencyLabel.textContent = '';
                }
            } else {
                currencyLabel.textContent = '';
            }
        } else {
            currencyLabel.textContent = '';
        }
    }



    /**
     * 显示期限单位选项列表
     */
    showPeriodUnitOptions(fieldId) {
        const mask = document.getElementById('periodUnitMask');
        mask.style.display = 'flex';
        
        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmPeriodUnitSelection(fieldId);
        };
        
        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 移除其他选中状态
                options.forEach(o => {
                    o.querySelector('.selected-icon').classList.add('not-selected');
                });
                // 添加当前选中状态
                option.querySelector('.selected-icon').classList.remove('not-selected');
            };
        });
        
        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 确认期限单位选择
     */
    confirmPeriodUnitSelection(fieldId) {
        const mask = document.getElementById('periodUnitMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');
        
        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;
            
            // 更新输入框显示和存储实际值
            const inputField = document.getElementById(fieldId);
            inputField.value = text;
            inputField.dataset.value = value;
            
            // 重新计算利息和本息
            if (fieldId === 'depositPeriodUnit') {
                this.calculateDeposit();
            } else if (fieldId === 'loanPeriodUnit') {
                this.calculateLoan();
            }
        }
        
        // 隐藏弹窗
        mask.style.display = 'none';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new AddProductPage();
});
